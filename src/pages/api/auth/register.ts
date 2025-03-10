import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import messages from "@/utils/messageList";
import bcrypt from "bcryptjs";
import { usersPath } from "@/utils/mockdataPath";
import { SALT_ROUNDS } from "@/utils/consts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, email, phone, password, role } = req.body;

    // Load existing users from JSON file
    const file = await fs.readFile(usersPath, "utf8");
    const users = JSON.parse(file);

    // Exception Flow 1 – Email address is not unique
    if (users.some((user: any) => user.email === email)) {
      return res.status(400).json({ message: messages.ME004 });
    }

    // Exception Flow 2 – User doesn’t provide required information
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!phone) missingFields.push("phone");
    if (!role) missingFields.push("role");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `${messages.M003} : ${missingFields.join(", ")}.`,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: messages.ME002 });
    }

    // Exception Flow 4 – Password doesn’t meet password requirements
    const passwordRegex = /^(?=.*\d)(?=.*[A-Za-z]).{7,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: messages.ME014,
      });
    }

    const phoneRegex = /^\+[0-9]+$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message:
          "Invalid phone number format. Must have + in front of phone number",
      });
    }

    const lastId =
      users.length > 0
        ? Math.max(...users.map((user: any) => Number(user.id)))
        : 0;
    const newUserId = lastId + 1;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = {
      id: newUserId.toString(),
      name,
      username: name,
      email,
      phone,
      password: hashedPassword,
      wallet: 0,
      role,
    };
    users.push(newUser);

    // Save updated users list
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2), "utf8");

    return res
      .status(201)
      .json({ message: "User registered successfully, Please log in" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
