import { NextApiRequest, NextApiResponse } from "next";
import { carsPath } from "@/utils/mockdataPath";
import { CarBase } from "@/utils/types/Car";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cars: CarBase[] = await readJsonFile(carsPath);
    const { id } = req.query;
    const carIndex = cars.findIndex((car) => car.id === id);

    if (carIndex === -1) {
      return res.status(404).json({ error: "Car not found" });
    }

    switch (req.method) {
      case "GET":
        return res.status(200).json(cars[carIndex]);

      case "PUT":
        const updatedCar = { ...cars[carIndex], ...req.body };
        cars[carIndex] = updatedCar;
        await writeJsonFile(carsPath, cars);
        return res.status(200).json(updatedCar);

      case "DELETE":
        const deletedCar = cars.splice(carIndex, 1)[0];
        await writeJsonFile(carsPath, cars);
        return res.status(200).json(deletedCar);

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
}
