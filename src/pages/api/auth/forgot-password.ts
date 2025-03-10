import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/utils/email";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import { usersPath, tokensPath } from "@/utils/mockdataPath";
import { SALT_ROUNDS } from "@/utils/consts";
import emailTemplates from "@/utils/emailList";
import messages from "@/utils/messageList";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  const file = await fs.readFile(usersPath, "utf8");
  const users = JSON.parse(file);

  const user = users.find((u: any) => u.email === email);
  // 1. Check if user exists
  if (!user) {
    return res.status(404).json({ error: `${messages.ME015}` });
  }

  // 2. Generate a reset token
  let tokens = [];
  try {
    const tokensFile = await fs.readFile(tokensPath, "utf8");
    tokens = JSON.parse(tokensFile);
  } catch (error) {
    console.log("Token file not found, creating new.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  tokens = tokens.filter((t: any) => t.email !== user.email);
  tokens.push({ email, token: hashedToken, expiresAt });
  await fs.writeFile(tokensPath, JSON.stringify(tokens, null, 2));
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${email}`;

  console.log("Recover password link:", resetLink);

  const mailBody = emailTemplates.EM01.body
    .replace("<user’s email address>", email)
    .replace(
      "here",
      `<a href="${resetLink}" style="color: blue; text-decoration: underline;">here</a>`
    );

  const mailSubject = emailTemplates.EM01.subject;

  await sendEmail({
    to: email,
    subject: mailSubject,
    text: mailBody,
  });

  return res.status(200).json({ message: "Password reset link sent!" });
}
