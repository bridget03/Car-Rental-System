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
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid booking ID" });
    }

    const [bookings, users, cars] = await Promise.all([
      readJsonFile(bookingsPath),
      readJsonFile(usersPath),
      readJsonFile(carsPath),
    ]);

    const booking = bookings.find((b: Booking) => b.id === id);
    if (!booking) {
      return res.status(404).json({ error: `Booking with ID ${id} not found` });
    }

    const user = users.find((u: any) => u.id === booking.userId);
    if (!user) {
      return res.status(404).json({ error: `User with ID ${booking.userId} not found` });
    }

    const car = cars.find((c: CarBase) => c.id === booking.carId);
    if (!car) {
      return res.status(404).json({ error: `Car with ID ${booking.carId} not found` });
    }

    if (req.method === "GET") {
      // total = gia thuc te, deposit = coc
      const deductState = car.deposit - booking.totalPrice > 0;
      const deductValue = Math.abs(car.deposit - booking.totalPrice);
      return res.status(200).json({
        message: `Please confirm to return the car. The ${
          deductState ? "exceeding" : "remaining"
        } amount of ${deductValue} VND will be ${deductState ? "returned to" : "from"} your wallet`,
      });
    }

    if (req.method === "POST") {
      if (booking.status !== "inProgress") {
        return res.status(400).json({
          error: `Only allow to return car when booking status is inProgress. Current status: ${booking.status}`,
        });
      }

      const userBalanceBefore = user.wallet;

      // Update booking status to inProgress
      const bookingIndex = bookings.findIndex((b: Booking) => b.id === id);
      let bookingStatus;
      const bookingStatusBefore = booking.status;
      if (bookingIndex !== -1) {
        if (booking.paymentMethod === "wallet") {
          const bookerIndex = users.findIndex((u: any) => u.id === user.id);

          // If totalPrice > deposit, user wallet get deducted, check insufficient
          // If totalPrice < deposit, user wallet get added
          if (booking.totalPrice > car.deposit) {
            if (user.wallet < booking.totalPrice - car.deposit) {
              return res.status(400).json({
                error: `Insufficient wallet balance to return car. Current balance: ${
                  user.wallet
                }. Deduct amount: ${
                  booking.totalPrice - car.deposit
                } Please add more money to your wallet.`,
                deduct: booking.totalPrice - car.deposit,
                userWallet: user.wallet,
              });
            }
            users[bookerIndex].wallet -= booking.totalPrice - car.deposit;
          } else if (booking.totalPrice < car.deposit) {
            users[bookerIndex].wallet += car.deposit - booking.totalPrice;
          }

          // Add money to owner wallet
          const ownerIndex = users.findIndex((u: any) => u.id === car.ownerId);
          if (ownerIndex !== -1) {
            users[ownerIndex].wallet += booking.totalPrice;
          }

          bookings[bookingIndex].status = "completed";
        } else {
          bookings[bookingIndex].status = "pendingPayment";
        }

        bookingStatus = bookings[bookingIndex].status;
        await writeJsonFile(bookingsPath, bookings);
        await writeJsonFile(usersPath, users);

        // Change car status to available if condition is met
        if (
          bookingStatus === "completed" &&
          isCarAvailableAfterCancelledOrCompleted(bookings, car)
        ) {
          const carIndex = cars.findIndex((c: CarBase) => c.id === car.id);
          cars[carIndex].status = "Available";
          await writeJsonFile(carsPath, cars);
        }
      }

      const subject = emailTemplates.EM04.subject;
      const text = replaceDateFormatFromTemplate(
        replaceCarNameFromTemplate(emailTemplates.EM04.body, car)
      );

      sendEmail({
        to: user.email,
        subject,
        text,
      });

      return res.status(200).json({
        message: `Returning car succeed! Booking status from ${bookingStatusBefore} updated to ${bookingStatus}`,
        messageForUI: `Please confirm to return the car. The ${
          userBalanceBefore > user.wallet ? "remaining" : "exceeding"
        } amount of ${Math.abs(userBalanceBefore - user.wallet)} VND will be ${
          userBalanceBefore > user.wallet ? "deducted from" : "returned to"
        } your wallet.`,
        booking,
        walletBefore: userBalanceBefore,
        wallet: user.wallet,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
