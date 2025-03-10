import withAuth from "@/utils/APIsProtection";
import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { usersPath } from "@/utils/mockdataPath";
import bcrypt from "bcryptjs";
import messages from "@/utils/messageList";
import { SALT_ROUNDS } from "@/utils/consts";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const file = await fs.readFile(usersPath, "utf8");
  const users = JSON.parse(file);

  if (req.method === "PUT") {
    const { newPassword } = req.body;
    const { email } = (req as unknown as { user: any }).user;

    if (!newPassword) {
      return res.status(400).json({ message: `${messages.M003}: newPassword.` });
    }

    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User with email ${email} not found.` });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[A-Za-z]).{7,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: messages.ME014,
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    return res.status(200).json({ message: "Password changed successfully." });
  }

  res.status(405).json({ message: "Method Not Allowed" });
}

export default await withAuth(handler);
