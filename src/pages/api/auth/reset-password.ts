import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import { usersPath, tokensPath } from "@/utils/mockdataPath";
import messages from "@/utils/messageList";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Flow:
  // 1. User click link. Link contains token in query params.
  // 2. If token valid
  // 2.1. Return success (200). Redirect to reset-password page.
  // 2.2. If token is invalid, expired, not exist then return error (400). Redirect to login page.
  // 3. User input new password.
  // 4. If new password is valid
  // 4.0. If token valid >> proceed
  // 4.1. Delete token in db
  // 4.2. Return success (200). Redirect to login page.
  // 4.3. If new password is invalid, return error (400).

  // Why not delete token in db in GET request? Because there could be invalid password sent.
  // Why checking token twice, one at GET request and one at POST request? Because there
  // could be invalid token while POST request happens.

  let tokens = [];
  try {
    const tokensFileData = await fs.readFile(tokensPath, "utf8");
    tokens = JSON.parse(tokensFileData);
  } catch (error) {
    return res.status(400).json({ error: "No reset tokens found" });
  }

  if (req.method === "GET") {
    const { token, email } = req.query;

    const missingFields = [];

    if (!token) missingFields.push("token");
    if (!email) missingFields.push("email");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: `${messages.M003}: ${missingFields.join(", ")}` });
    }

    const storedToken = tokens.find((t: any) => {
      return t.email === email;
    });

    if (!storedToken) {
      return res.status(400).json({ error: messages.ME006 });
    }
    if (new Date(storedToken.expiresAt) < new Date()) {
      return res.status(400).json({ error: messages.ME006 });
    }
    const isValid = await bcrypt.compare(token as string, storedToken.token);
    if (!isValid) {
      return res.status(400).json({ error: messages.ME006 });
    }

    return res
      .status(200)
      .json({ message: "Token is valid, unlock reset-password page" });
  }

  if (req.method === "POST") {
    const { token, email, newPassword } = req.body;

    const missingFields = [];

    if (!token) missingFields.push("token");
    if (!newPassword) missingFields.push("newPassword");
    if (!email) missingFields.push("email");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: `${messages.M003}: ${missingFields.join(", ")}` });
    }
    // Token validation
    const storedToken = tokens.find((t: any) => {
      return t.email === email;
    });

    if (!storedToken) {
      return res.status(400).json({ error: messages.ME006 });
    }
    if (new Date(storedToken.expiresAt) < new Date()) {
      return res.status(400).json({ error: messages.ME006 });
    }
    const isValid = await bcrypt.compare(token as string, storedToken.token);
    if (!isValid) {
      return res.status(400).json({ error: messages.ME006 });
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[A-Za-z]).{7,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: messages.ME014,
      });
    }

    let users;
    try {
      const usersFileData = await fs.readFile(usersPath, "utf8");
      users = JSON.parse(usersFileData);
    } catch (error) {
      console.log("Backend error:", error);
    }

    const userIndex = users.findIndex(
      (u: any) => u.email === storedToken.email
    );
    if (userIndex === -1) {
      return res
        .status(400)
        .json({ error: `User with email ${email} not found.` });
    }

    users[userIndex].password = await bcrypt.hash(newPassword, 10);
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    tokens = tokens.filter((t: any) => t.email !== storedToken.email);
    await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
