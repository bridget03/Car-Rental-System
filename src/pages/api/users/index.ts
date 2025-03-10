import { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import messages from "@/utils/messageList";
import withAuth from "@/utils/APIsProtection";
import { usersPath } from "@/utils/mockdataPath";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const file = await fs.readFile(usersPath, "utf8");
  const users = JSON.parse(file);
  if (req.method === "GET") {
    const { email } = (req as unknown as { user: any }).user;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required." });
    }
    const user = users.find((u: any) => u.email === email);
    if (!user) {
      return res.status(404).json({ error: `User with email ${email} not found.` });
    }
    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  }
  if (req.method === "PUT") {
    // Currently nullifying driving license because of file saving mechanism...
    const { name, dateOfBirth, phone, nationalID, drivingLicense, address } = req.body;

    const { email } = (req as unknown as { user: any }).user;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!dateOfBirth) missingFields.push("dateOfBirth");
    if (!phone) missingFields.push("phone");
    if (!nationalID) missingFields.push("nationalID");
    if (!drivingLicense) missingFields.push("drivingLicense");
    if (!address || typeof address !== "object") {
      missingFields.push("address");
    } else {
      if (!address.city) missingFields.push("city");
      if (!address.district) missingFields.push("district");
      if (!address.ward) missingFields.push("ward");
      if (!address.houseNumberStreet) missingFields.push("houseNumberStreet");
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `${messages.M003} : ${missingFields.join(", ")}.`,
      });
    }

    const errors = [];
    if (isNaN(Date.parse(dateOfBirth))) errors.push("Invalid date format, should be YYYY-MM-DD");
    if (!/^\+[0-9]+$/.test(phone))
      errors.push("Invalid phone number format. Must have + in front of phone number");
    if (isNaN(Number(nationalID))) {
      errors.push("National ID is not a valid number.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      return res.status(400).json({ errors: `User with ${email} not found` });
    }

    users[userIndex] = {
      ...users[userIndex],
      name,
      dateOfBirth,
      phone,
      nationalID,
      drivingLicense,
      address,
    };

    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

    return res.status(200).json({ message: "User updated successfully" });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

export default await withAuth(handler);
