import withAuth from "@/utils/APIsProtection";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import { bookingsPath, carsPath, usersPath } from "@/utils/mockdataPath";
import { Booking } from "@/utils/types/Booking";
import { CarBase } from "@/utils/types/Car";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    if (req.method === "POST") {
      const [bookings, users, cars] = await Promise.all([
        readJsonFile(bookingsPath),
        readJsonFile(usersPath),
        readJsonFile(carsPath),
      ]);

      const booking = bookings.find((b: Booking) => b.id === id);
      if (!booking) {
        return res
          .status(404)
          .json({ error: `Booking with ID ${id} not found` });
      }

      const user = users.find((u: any) => u.id === booking.userId);
      if (!user) {
        return res
          .status(404)
          .json({ error: `User with ID ${booking.userId} not found` });
      }

      const car = cars.find((c: CarBase) => c.id === booking.carId);
      if (!car) {
        return res
          .status(404)
          .json({ error: `Car with ID ${booking.carId} not found` });
      }

      if (booking.status !== "confirmed") {
        return res.status(400).json({
          error: `Only allow to confirm pickup if status is confirmed. Current status: ${booking.status}`,
        });
      }

      // Update booking status to inProgress
      const bookingIndex = bookings.findIndex((b: Booking) => b.id === id);
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = "inProgress";
        await writeJsonFile(bookingsPath, bookings);
      }

      return res
        .status(200)
        .json({
          message:
            "Booking status updated to inProgress",
          booking,
        });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
