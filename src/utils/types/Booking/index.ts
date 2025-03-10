import { User } from "../User";

export interface Booking {
  id: string; // YYYYMMdd-<sequence number>
  carId: string;
  userId: string;
  pickupDate: string;
  dropOffDate: string;
  pickupLocation: string;
  totalPrice: number;
  renterInformation: Partial<User>;
  driverInformation: Partial<User> | null;
  paymentMethod: "wallet" | "cash" | "bankTransfer" | string;
  status: "pendingDeposit" | "confirmed" | "cancelled" | "pendingPayment" | "inProgress" | "completed" | string;
}

// Constraint:
// In the same moment, one user can only rent 1 car

// status:
// Cash / bank: Upon booking >> Pending Deposit ||| pay offline >> Confirmed
// Wallet: if success >> Confirmed

// Number of days: end-start + 1

//  Pending deposit > Confirmed > Cancelled
//                    Confirmed > inProgress > Completed
//                                inProgress > pendingPayment > Completed

// Frontend ahh req
// Rule for driving license:  - If driver is different from renter: Then the driving license is required for driver, optional for renter
// If driver is same as renter: Driving license is required

// UC21 - BRL-21-01: Only allow user to mark a car as Stopped if the car’s status is Available
// If the car’s status is booked -> Do not allow to stop renting the car.

// UC22 - Confirm deposit, change booking status from Pending deposit to Confirmed
// UC23 - Confirm payment, change booking status from Pending payment to Completed

// note 1: xử lý booking thì phải nhớ update car status
