import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { carsPath } from "@/utils/mockdataPath";
import { CarBase } from "@/utils/types/Car";
import withAuth from "@/utils/APIsProtection";
import { readJsonFile } from "@/utils/fileMethods";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cars = await readJsonFile(carsPath);

    if (req.method === "GET") {
      const { limit } = req.query;

      const tokenUserId = (req as any).user?.id;
      // console.log("token usser id:" + req.user.id);

      let isOwner = req.user.role === "carOwner";

      if (isOwner) {
        const ownerCars = cars.filter(
          (car: CarBase) => car.ownerId == tokenUserId
        );

        if (limit) {
          return res
            .status(200)
            .json(ownerCars.slice(0, parseInt(limit as string)));
        }

        return res.status(200).json(ownerCars);
      }

      const sortedCars = cars.sort(
        (a, b) => b.productionYear - a.productionYear
      );

      if (limit) {
        return res
          .status(200)
          .json(sortedCars.slice(0, parseInt(limit as string)));
      }

      return res.status(200).json(sortedCars);
    } else if (req.method === "POST") {
      const maxId =
        cars.length > 0
          ? Math.max(...cars.map((car: CarBase) => Number(car.id)))
          : 0;
      const newCar = { ...req.body, id: (maxId + 1).toString() };

      cars.push(newCar);
      fs.writeFileSync(carsPath, JSON.stringify(cars, null, 2));

      return res.status(201).json(newCar);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
