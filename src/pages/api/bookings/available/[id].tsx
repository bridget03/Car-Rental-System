import withAuth from "@/utils/APIsProtection";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import {
  isCarAvailable,
  isCarAvailableWithOccupiedBooking,
} from "@/utils/helperFunctions";
import { bookingsPath, carsPath, usersPath } from "@/utils/mockdataPath";
import { dateTimeRegex } from "@/utils/regex";
import { Booking } from "@/utils/types/Booking";
import { CarBase } from "@/utils/types/Car";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      console.log(req.query);

      const { id: carId, pickupDate, dropOffDate } = req.query;
      const missingFields = [];

      if (!carId) missingFields.push("carId");
      if (!pickupDate) missingFields.push("pickupDate");
      if (!dropOffDate) missingFields.push("dropOffDate");

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required parameters: ${missingFields.join(", ")}`,
        });
      }

      const errors = [];

      if (!dateTimeRegex.test(pickupDate as string)) {
        errors.push(
          `Invalid date format for pickupDate: ${pickupDate}, must follow YYYY-MM-DDTHH:MM`
        );
      }

      if (!dateTimeRegex.test(dropOffDate as string)) {
        errors.push(
          `Invalid date format for dropOffDate: ${dropOffDate}, must follow YYYY-MM-DDTHH:MM`
        );
      }

      let pickupDateObject = new Date(pickupDate as string);
      let dropOffDateObject = new Date(dropOffDate as string);

      if (dropOffDateObject <= pickupDateObject) {
        return res.status(400).json({
          error:
            "Drop-off date must be later than Pick-up date, please try again.",
        });
      }

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      const [bookings, cars] = await Promise.all([
        readJsonFile(bookingsPath),
        readJsonFile(carsPath),
      ]);

      const car = cars.find((c: CarBase) => c.id === carId);
      if (!car) {
        return res
          .status(404)
          .json({ error: `Car with ID ${carId} not found` });
      }

      const [carAvailable, occupiedBookings] =
        isCarAvailableWithOccupiedBooking(
          bookings,
          car,
          new Date(pickupDate as string),
          new Date(dropOffDate as string)
        );

      return res.status(200).json({
        message: carAvailable
          ? `Car is available`
          : `Car is not available between ${pickupDate} to ${dropOffDate}`,
        carAvailable,
        occupiedBookings,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
