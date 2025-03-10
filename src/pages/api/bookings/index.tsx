import { readJsonFile, writeJsonFile } from "@/utils/fileMethods";
import {
  calculateDaysBetween,
  checkMissingFields,
  generateBookingNumber,
  isCarAvailable,
  replaceCarNameFromTemplate,
  replaceDateFormatFromTemplate,
} from "@/utils/helperFunctions";
import { bookingsPath, carsPath, usersPath } from "@/utils/mockdataPath";
import { dateTimeRegex } from "@/utils/regex";
import { Booking } from "@/utils/types/Booking";
import { CarBase } from "@/utils/types/Car";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";
import { sendEmail } from "@/utils/email";
import emailTemplates from "@/utils/emailList";
import withAuth from "@/utils/APIsProtection";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if exist then we all set!
  try {
    const [bookings, users, cars] = await Promise.all([
      readJsonFile(bookingsPath),
      readJsonFile(usersPath),
      readJsonFile(carsPath),
    ]);

    // GET - Lấy tất cả bookings của user
    if (req.method === "GET") {
      const { id } = (req as unknown as { user: any }).user;
      const userId = id;
      const { page = 1, itemsPerPage = 10, sort = "newest", carId } = req.query;
      if (carId) {
        // Lọc các booking của xe có carId
        const carBookings = bookings
          .filter((booking: Booking) => booking.carId === carId)
          .map(({ pickupDate, dropOffDate }) => ({ pickupDate, dropOffDate }));

        return res.status(200).json({
          carId,
          bookedDates: carBookings,
        });
      }

      if (userId) {
        // Lọc các booking của user
        let userBookings = bookings.filter(
          (booking: Booking) => booking.userId === userId
        );

        const user = users.find((user: any) => user.id === userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Thêm thông tin user và car vào bookings
        userBookings = userBookings.map((booking: Booking) => {
          const car = cars.find((car: CarBase) => car.id === booking.carId);
          return {
            ...booking,
            user: user,
            car: car,
          };
        });

        // Sort bookings theo parameter
        userBookings.sort((a: Booking, b: Booking) => {
          if (!a.pickupDate || !b.pickupDate) return 0;

          switch (sort) {
            case "newest":
              return (
                new Date(b.pickupDate).getTime() -
                new Date(a.pickupDate).getTime()
              );
            case "oldest":
              return (
                new Date(a.pickupDate).getTime() -
                new Date(b.pickupDate).getTime()
              );
            case "price_high":
              return (b.totalPrice || 0) - (a.totalPrice || 0);
            case "price_low":
              return (a.totalPrice || 0) - (b.totalPrice || 0);
            default:
              return 0;
          }
        });

        // Phân trang
        const startIndex = (Number(page) - 1) * Number(itemsPerPage);
        const endIndex = startIndex + Number(itemsPerPage);
        const paginatedBookings = userBookings.slice(startIndex, endIndex);

        return res.status(200).json({
          data: paginatedBookings,
          total: userBookings.length,
          page: Number(page),
          itemsPerPage: Number(itemsPerPage),
        });
      }

      return res.status(400).json({ error: "User ID is required" });
    }

    if (req.method === "POST") {
      let {
        carId,
        // userId, (dont need to pass in userId)
        pickupDate,
        dropOffDate,
        // pickupLocation,
        driverInformation,
        renterInformation,
        paymentMethod,
      } = req.body;
      const { id: userId, email } = (req as unknown as { user: any }).user;

      const requiredFields = [
        "carId",
        "pickupDate",
        "dropOffDate",
        "paymentMethod",
      ];
      const missingFields = checkMissingFields(req.body, requiredFields);

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

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      if (
        paymentMethod !== "wallet" &&
        paymentMethod !== "cash" &&
        paymentMethod !== "bankTransfer"
      ) {
        return res.status(400).json({
          error: `Invalid payment method: ${paymentMethod}, it's either wallet or bankTransfer or cash`,
        });
      }

      const car: CarBase = cars.find((car: CarBase) => car.id === carId);

      if (
        !isCarAvailable(
          bookings,
          car,
          new Date(pickupDate),
          new Date(dropOffDate)
        )
      ) {
        return res.status(400).json({
          error: `The car is not available from ${pickupDate} to ${dropOffDate}, please try again`,
        });
      }
      if (!car) {
        return res
          .status(400)
          .json({ error: `Car with id: ${carId} not found` });
      }

      // if (car.location !== pickupLocation) {
      //   return res.status(400).json({
      //     error: `Car with id: ${carId} is at [${car.location}], is not available at location: ${pickupLocation}`,
      //   });
      // }

      const carDeposit: number = Number(car.deposit);
      const totalPrice: number =
        (Math.floor(calculateDaysBetween(pickupDate, dropOffDate)) + 1) *
        Number(car.basePrice);
      const bookingId = generateBookingNumber(bookings);
      let status;

      if (paymentMethod === "wallet") {
        const userIndex = users.findIndex((user: User) => user.id === userId);

        if (!userIndex) {
          return res.status(404).json({ error: "User not found" });
        }

        const userBalance = users[userIndex].wallet.toFixed(2);

        if (users[userIndex].wallet < carDeposit) {
          return res.status(404).json({
            error: `Insufficient balance, your current balance: ${userBalance}. The deposit price is ${carDeposit}. Please top up and try again`,
          });
        }
        users[userIndex].wallet -= Number(carDeposit);
        await writeJsonFile(usersPath, users);
        status = "confirmed";
      } else {
        status = "pendingDeposit";
      }

      const newBooking: Booking = {
        id: bookingId,
        carId,
        userId,
        pickupDate,
        dropOffDate,
        pickupLocation: car.location,
        totalPrice,
        driverInformation,
        renterInformation,
        paymentMethod,
        status,
      };

      await writeJsonFile(bookingsPath, [...bookings, newBooking]);

      const carIndex = cars.findIndex((car: CarBase) => car.id === carId);
      if (carIndex !== -1) {
        cars[carIndex].status = "Booked";
        await writeJsonFile(carsPath, cars);
      }

      const subject = emailTemplates.EM02.subject;
      const text = replaceDateFormatFromTemplate(
        replaceCarNameFromTemplate(emailTemplates.EM02.body, car)
      );

      sendEmail({
        to: email,
        subject,
        text,
      });

      return res.status(200).json({ bookingNumber: bookingId });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default await withAuth(handler);
