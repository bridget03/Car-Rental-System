// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import withAuth from "@/utils/APIsProtection";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import { isValidNumber } from "@/utils/helperFunctions";
import { usersPath, carsPath } from "@/utils/mockdataPath";
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
        const { amount, carId } = req.body;

        if (!amount) {
            return res.status(400).json({ name: "Amount is required" });
        }

        if (!isValidNumber(amount)) {
            return res.status(400).json({ name: "Amount must be a number" });
        }

        const users = await readJsonFile(usersPath);
        const cars = await readJsonFile(carsPath);
        const customerIndex = users.findIndex((u: User) => u.id === id);
        const carIndex = cars.findIndex((c: any) => c.id === carId);
        const ownerId = cars[carIndex].ownerId;
        const ownerIndex = users.findIndex((u: User) => u.id === ownerId);
        console.log(users[customerIndex].wallet);


        if (customerIndex === -1) {
            return res.status(404).json({ name: "User not found" });
        }



        users[customerIndex].wallet = users[customerIndex].wallet - Number(amount);
        users[ownerIndex].wallet = users[ownerIndex].wallet + Number(amount);




        await writeJsonFile(usersPath, users);
        return res
            .status(200)
            .json({
                success: `Transfer successful`,
            });
    } catch (error) {
        console.log(error);
    }
}

export default await withAuth(handler);