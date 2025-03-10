import { HOUR } from "../consts";
import { Booking } from "../types/Booking";
import { CarBase } from "../types/Car";

const checkMissingFields = (
  body: Record<string, any>,
  requiredFields: string[]
) => {
  return requiredFields.filter((field) => !body[field]);
};

const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate difference in milliseconds
  const diffMs = end.getTime() - start.getTime();

  // Convert milliseconds to days
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

const generateBookingNumber = (bookingData: Booking[]): string => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD

  // Increment the sequence number

  const lastUser = bookingData[bookingData.length - 1];
  let bookingSequence;
  if (lastUser) {
    const sequence = lastUser.id?.split("-")[1];
    bookingSequence = sequence ? parseInt(sequence) + 1 : 1;
  } else {
    bookingSequence = 1;
  }

  // Format sequence number with leading zeros (e.g., 001, 002)
  const sequenceStr = String(bookingSequence).padStart(6, "0");

  return `${formattedDate}-${sequenceStr}`;
};

const isValidNumber = (str: any) => {
  return !isNaN(str) && str.trim() !== "";
};

const isCarAvailable = (
  bookings: Booking[],
  car: CarBase,
  pickupDateObiect: Date,
  dropOffDateObiect: Date
) => {
  for (let i = 0; i < bookings.length; i++) {
    if (
      bookings[i].carId === car.id &&
      bookings[i].status !== "cancelled"
    ) {
      const existingPickup = new Date(
        bookings[i].pickupDate as string
      ).getTime();
      const existingDropOff = new Date(
        bookings[i].dropOffDate as string
      ).getTime();

      // Check if requested dates overlap with an existing booking
      // (3600000 milliseconds = 1 hour), +-1 hour so that they have car to prepare for next customer

      if (
        pickupDateObiect.getTime() - HOUR < existingDropOff &&
        dropOffDateObiect.getTime() + HOUR > existingPickup
      ) {
        return false;
      }
    }
  }
  return true;
};

const isCarAvailableAfterCancelledOrCompleted = (bookings: Booking[], car: CarBase) => {
  // place this function RIGHT AFTER WRITING NEW STATUS ONTO BOOKING
  for (let i = 0; i < bookings.length; i++) {
    if (
      bookings[i].carId === car.id &&
      bookings[i].status !== "cancelled" &&
      bookings[i].status !== "completed"
    ) {
      return false;
    }
  }
  return true;
};

const replaceCarNameFromTemplate = (originalString: string, car: CarBase) => {
  return originalString.replace("<Name of car>", `<b>${car.name}</b> `);
};

const replaceDateFormatFromTemplate = (originalString: string) => {
  // "DD/MM/YYYY HH:MM" => 19/02/2025 11:06PM
  return originalString.replace(
    "DD/MM/YYYY HH:MM",
    new Date()
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace(" am", "AM")
      .replace(" pm", "PM")
  );
};

const isCarAvailableWithOccupiedBooking = (
  bookings: Booking[],
  car: CarBase,
  pickupDateObiect: Date,
  dropOffDateObiect: Date
) => {
  const occupiedBookings = [];
  for (let i = 0; i < bookings.length; i++) {
    if (
      bookings[i].carId === car.id &&
      bookings[i].status !== "cancelled"
    ) {
      const existingPickup = new Date(
        bookings[i].pickupDate as string
      ).getTime();
      const existingDropOff = new Date(
        bookings[i].dropOffDate as string
      ).getTime();

      // Check if requested dates overlap with an existing booking
      // (3600000 milliseconds = 1 hour), +-1 hour so that they have car to prepare for next customer

      if (
        pickupDateObiect.getTime() - HOUR < existingDropOff &&
        dropOffDateObiect.getTime() + HOUR > existingPickup
      ) {
        occupiedBookings.push(bookings[i]);
        break;
      }
    }
  }
  return [occupiedBookings.length > 0 ? false : true, occupiedBookings];
};


const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateString).toLocaleDateString("EN", options);
};

const calculateRentalDays = (pickupDate?: string, dropOffDate?: string): number => {
  if (!pickupDate || !dropOffDate) return 0;
  const pickup = new Date(pickupDate);
  const dropOff = new Date(dropOffDate);
  return Math.floor((dropOff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};
const calculatePrice = (days: number, price: number | string): string => {
  const numericPrice = typeof price === "string" ? Number(price.replace(/\./g, "")) : price;
  const total = days * numericPrice;
  return total.toLocaleString("vi-VN");
};

export {
  checkMissingFields,
  calculateDaysBetween,
  generateBookingNumber,
  isValidNumber,
  isCarAvailable,
  isCarAvailableAfterCancelledOrCompleted,
  replaceCarNameFromTemplate,
  replaceDateFormatFromTemplate,
  isCarAvailableWithOccupiedBooking,
  formatDate,
  calculateRentalDays,
  calculatePrice,
};
