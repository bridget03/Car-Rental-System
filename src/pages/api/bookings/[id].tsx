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

        const [bookings, users, cars] = await Promise.all([
            readJsonFile(bookingsPath),
            readJsonFile(usersPath),
            readJsonFile(carsPath),
        ]);

        const booking = bookings.find((b: Booking) => b.id === id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        const user = users.find((u: any) => u.id === booking.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const car = cars.find((c: CarBase) => c.id === booking.carId);
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }

        if (req.method === "GET") {
            return res.status(200).json({
                ...booking,
                user,
                car,
            });
        }

        if (req.method === "PUT") {
            const { driverInformation, renterInformation } = req.body;

            const bookingIndex = bookings.findIndex((b: Booking) => b.id === id);

            if (bookingIndex === -1) {
                return res.status(404).json({ error: "Booking not found" });
            }

            if (booking.status !== "confirmed" && booking.status !== "pendingDeposit") {
                return res.status(400).json({
                    error: `Cannot update booking with current status: ${booking.status}, only allowed to update when booking status is either confirmed or pendingDeposit`,
                });
            }

            const updatedBooking = {
                ...booking,
                driverInformation,
                renterInformation,
            };

            bookings[bookingIndex] = updatedBooking;

            await writeJsonFile(bookingsPath, bookings);

            return res.status(200).json(updatedBooking);
        }

        res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error("API error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export default await withAuth(handler);
