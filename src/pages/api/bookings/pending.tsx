import { NextApiRequest, NextApiResponse } from "next";
import { bookingsPath, carsPath } from "@/utils/mockdataPath";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import withAuth from "@/utils/APIsProtection";
import { Booking } from "@/utils/types/Booking";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Đọc danh sách bookings
      let bookings: Booking[] = await readJsonFile(bookingsPath);

      // Lọc các booking có trạng thái pendingDeposit hoặc pendingPayment
      let pendingBookings = bookings.filter(
        (booking) =>
          booking.status === "pendingDeposit" || booking.status === "pendingPayment"
      );

      return res.status(200).json(pendingBookings);
    }

    if (req.method === "PUT") {
      const { carId, actionType } = req.body; // actionType: "deposit" hoặc "payment"

      if (!carId || !["deposit", "payment"].includes(actionType)) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      // Đọc danh sách bookings
      let bookings: Booking[] = await readJsonFile(bookingsPath);

      // Tìm booking của xe cần cập nhật
      let bookingIndex = bookings.findIndex((b) => b.carId === carId);

      if (bookingIndex === -1) {
        return res.status(404).json({ error: "No pending booking found for this car" });
      }

      let booking = bookings[bookingIndex];

      if (
        (actionType === "deposit" && booking.status !== "pendingDeposit") ||
        (actionType === "payment" && booking.status !== "pendingPayment")
      ) {
        return res.status(400).json({ error: "Invalid booking status" });
      }

      // Cập nhật trạng thái booking
      booking.status = actionType === "deposit" ? "confirmed" : "completed";

      // Nếu đã hoàn tất thanh toán, cập nhật trạng thái xe
      if (booking.status === "completed") {
        let cars = await readJsonFile(carsPath);
        let car = cars.find((c: any) => c.id === carId);
        if (car) {
          car.status = "Available";
          await writeJsonFile(carsPath, cars);
        }
      }

      // Lưu lại danh sách bookings
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
