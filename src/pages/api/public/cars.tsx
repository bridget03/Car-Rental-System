import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { carsPath } from "@/utils/mockdataPath";

// Đọc file JSON
const readJsonFile = (filePath: string) => {
  return fs.promises
    .readFile(filePath, "utf8")
    .then((data) => JSON.parse(data));
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cars = await readJsonFile(carsPath);

    if (req.method === "GET") {
      const { limit } = req.query;

      const sortedCars = cars.sort(
        (a, b) => b.productionYear - a.productionYear
      );

      if (limit) {
        return res
          .status(200)
          .json(sortedCars.slice(0, parseInt(limit as string)));
      }

      return res.status(200).json(sortedCars);
    } else {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default handler;
