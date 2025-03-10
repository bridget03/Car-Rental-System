// When clicked
// • Return the list of matching cars that is available from pickup to drop-off time.

// Drop-off date and time must be later than Pick-up date and time. If not, display error message
// “Drop-off date time must be later than Pick-up date time, please try again.” >><<

// The search results only include the available cars. Other cars of different status will not show up in
// the search results.

// If there’s no search results, display message ME011:

// The search results need to return the list of cars that is available for the entire period from pick-up to
// drop-off.

// If a car is only available for a part of the duration, it will not be included in the search results

// The entered location will be used to search for the car’s address. Allow partial matches

// car status: available
// pickupdate - 1 dropoffdate + 1
// location: partial match

import { NextApiRequest, NextApiResponse } from "next";
import { readJsonFile } from "@/utils/fileMethods";
import withAuth from "@/utils/APIsProtection";
import { bookingsPath, carsPath } from "@/utils/mockdataPath";
import { CarBase } from "@/utils/types/Car";
import { dateTimeRegex } from "@/utils/regex";
import messages from "@/utils/messageList";
import { isCarAvailable } from "@/utils/helperFunctions";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    let { page = 1, limit = 10, pickupDate, dropOffDate, location, carBrand } = req.query;

    const missingFields = [];

    if (!pickupDate) missingFields.push("pickupDate");
    if (!dropOffDate) missingFields.push("dropOffDate");
    if (!location) missingFields.push("location");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required parameters: ${missingFields.join(", ")}`,
      });
    }

    const errors = [];

    if (!dateTimeRegex.test(pickupDate as string)) {
      errors.push(`Invalid date format for pickupDate: ${pickupDate}, must follow YYYY-MM-DDTHH:MM`);
    }

    if (!dateTimeRegex.test(dropOffDate as string)) {
      errors.push(`Invalid date format for dropOffDate: ${dropOffDate}, must follow YYYY-MM-DDTHH:MM`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    let pickupDateObject = new Date(pickupDate as string);
    let dropOffDateObject = new Date(dropOffDate as string);

    if (dropOffDateObject <= pickupDateObject) {
      return res.status(400).json({
        error:
          "Drop-off date must be later than Pick-up date, please try again.",
      });
    }

    const [bookings, cars] = await Promise.all([
      readJsonFile(bookingsPath),
      readJsonFile(carsPath),
    ]);

    const availableCarsWithLocation = cars.filter((car: CarBase) => {
      const locationRegex = new RegExp(location as string, "i");
      const carBrandRegex = new RegExp(carBrand as string, "i");
      return carBrandRegex.test(car.brand) && locationRegex.test(car.location);
    });

    const availableCars: CarBase[] = [];

    for (let i = 0; i < availableCarsWithLocation.length; i++) {
      let isAvailable = isCarAvailable(bookings, availableCarsWithLocation[i], pickupDateObject, dropOffDateObject);
      if (isAvailable) {
        availableCars.push(availableCarsWithLocation[i]);
      }
    }

    if (availableCars.length === 0) {
        return res.status(400).json({error: messages.ME011})
    }

    page = parseInt(page as string) || 1;
    limit = parseInt(limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCars = availableCars.slice(startIndex, endIndex);

    return res.status(200).json({
      cars: paginatedCars,
      pagination: {
        totalCars: availableCars.length,
        totalPages: Math.ceil(availableCars.length / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.log("bug! bug! bug! bug!?", error);
  }
}

export default await withAuth(handler);
