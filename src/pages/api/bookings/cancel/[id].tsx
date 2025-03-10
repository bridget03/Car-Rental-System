import withAuth from "@/utils/APIsProtection";
import { sendEmail } from "@/utils/email";
import emailTemplates from "@/utils/emailList";
import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import {
  isCarAvailableAfterCancelledOrCompleted,
  replaceCarNameFromTemplate,
  replaceDateFormatFromTemplate,
} from "@/utils/helperFunctions";
import { bookingsPath, carsPath, usersPath } from "@/utils/mockdataPath";
import { Booking } from "@/utils/types/Booking";
import { CarBase } from "@/utils/types/Car";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { email } = (req as unknown as { user: any }).user;
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

      // Check if booking status  In-progress, Completed or Pending payment, do not allow to cancel
      if (
        booking.status === "inProgress" ||
        booking.status === "completed" ||
        booking.status === "pendingPayment"
      ) {
        return res.status(400).json({
          error: `Cannot cancel a booking that is inProgress or Completed or pendingPayment. Current status: ${booking.status}`,
        });
      }
      // After customer has cancelled a booking, the deposit will be returned to customer’s wallet (if used wallet)
      if (booking.status === "cancelled") {
        return res.status(400).json({
          error: `Cannot cancel a booking that is already cancelled. Current status: ${booking.status}`,
        })
      }

      if (booking.paymentMethod === "wallet" && booking.status === "confirmed") {
        // Why check for confirmed? There's still a case where user is cancelled, and using wallet
        const userIndex = users.findIndex((u: any) => u.id === booking.userId);
        if (userIndex !== -1) {
          users[userIndex].wallet += car.deposit;
          await writeJsonFile(usersPath, users);
        }
      }

      // Update booking status to cancelled
      const bookingIndex = bookings.findIndex((b: Booking) => b.id === id);
      if (bookingIndex !== -1) {
        bookings[bookingIndex].status = "cancelled";
        await writeJsonFile(bookingsPath, bookings);
      }

      // Update car status to available
      const carIndex = cars.findIndex((c: CarBase) => c.id === booking.carId);
      if (carIndex !== -1) {
        const isCarAvailable = isCarAvailableAfterCancelledOrCompleted(bookings, car);
        if (isCarAvailable) {
          cars[carIndex].status = "Available";
          await writeJsonFile(carsPath, cars);
        }
      }

      const subject = emailTemplates.EM03.subject;
      const text = replaceDateFormatFromTemplate(
        replaceCarNameFromTemplate(emailTemplates.EM03.body, car)
      );

      sendEmail({
        to: email,
        subject,
        text,
      });

      return res
        .status(200)
        .json({ message: "Booking cancelled successfully, if user was using wallet, money is refunded", booking });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
