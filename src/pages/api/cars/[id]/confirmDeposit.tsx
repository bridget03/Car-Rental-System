import { NextApiRequest, NextApiResponse } from "next";
import { bookingsPath, carsPath } from "@/utils/mockdataPath";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import withAuth from "@/utils/APIsProtection";
import { Booking } from "@/utils/types/Booking";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid car ID" });
    }

    let bookings: Booking[] = await readJsonFile(bookingsPath);

    let bookingsMap = new Map(bookings.map((b: any) => [b.carId, b]));

    if (req.method === "GET") {
      let pendingBookings = bookings.filter(
        (booking: any) =>
          booking.carId === id &&
          (booking.status === "pendingDeposit" ||
            booking.status === "pendingPayment")
      );
      return res.status(200).json(pendingBookings);
    }

    if (req.method === "PUT") {
      let booking = bookingsMap.get(id);

      if (
        !booking ||
        !["pendingDeposit", "pendingPayment"].includes(booking.status)
      ) {
        return res
          .status(404)
          .json({ error: "No pending transaction found for this car" });
      }

      // Cập nhật trạng thái booking
      booking.status =
        booking.status === "pendingDeposit" ? "confirmed" : "completed";

      let shouldUpdateCar = booking.status === "completed";
      let cars = shouldUpdateCar ? await readJsonFile(carsPath) : null;

      if (shouldUpdateCar) {
        let car = cars.find((c: any) => c.id === id);
        if (car) car.status = "Available";
        await writeJsonFile(carsPath, cars);
      }

      await writeJsonFile(bookingsPath, bookings);
      return res.status(200).json(booking);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
