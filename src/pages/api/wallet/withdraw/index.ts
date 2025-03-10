// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withAuth from "@/utils/APIsProtection";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import { isValidNumber } from "@/utils/helperFunctions";
import { usersPath } from "@/utils/mockdataPath";
import { User } from "@/utils/types/User";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ name: "Method not allowed" });
    }

    const { id } = (req as unknown as { user: any }).user;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ name: "Amount is required" });
    }

    if (!isValidNumber(amount) && amount !== "all") {
      return res.status(400).json({ name: "Amount must be a number" });
    }

    const users = await readJsonFile(usersPath);
    const userIndex = users.findIndex((u: User) => u.id === id);

    const beforeWithdraw = Number(users[userIndex].wallet.toFixed(2));
    let afterWithdraw: number;

    if (userIndex === -1) {
      return res.status(404).json({ name: "User not found" });
    }

    if (users[userIndex].wallet < Number(amount)) {
      return res.status(400).json({ name: `Insufficient action, not enough balance. Current balance: ${beforeWithdraw}` });
    }

    if (amount !== "all") {
      users[userIndex].wallet -= Number(amount);
      afterWithdraw = Number(users[userIndex].wallet.toFixed(2));
    } else {
      users[userIndex].wallet = 0;
      afterWithdraw = 0;

    }
    await writeJsonFile(usersPath, users);
    return res
      .status(200)
      .json({
        success: `Withdrawn successful, before: ${beforeWithdraw}, after: ${afterWithdraw}`,
      });
  } catch (error) {
    console.log(error);
  }
}

export default await withAuth(handler);