import { JSX } from "react";

export interface CarListDashboardProps {
  initialCars: CarBase[];
  hasConfirm?: boolean;
  mutate: () => void;
}

export interface ProcessStep {
  icon: JSX.Element;
  title: string;
  description: string;
}
export interface CarOwnerPageProps {
  cars: Car[];
}
export interface CarBase {
  id: string;
  license?: string;
  name: string;
  brand: string;
  model: string;
  color: string;
  ownerId: string;
  productionYear: number;
  numberOfSeats: number;
  transmissionType: string;
  fuelType: string;
  mileage: number;
  fuelConsumption: number | string;
  basePrice: number | string;
  deposit: number | string;
  location: string;
  status: "Available" | "Booked" | "Stopped";
  ratings: number;
  rides: number;
  features: {
    bluetooth: boolean;
    gps: boolean;
    camera: boolean;
    sunRoof: boolean;
    childLock: boolean;
    childSeat: boolean;
    dvd: boolean;
    usb: boolean;
  };
  rules: {
    noSmoking: boolean;
    noFood: boolean;
    noPet: boolean;
  };
  images: {
    front: string;
    back: string;
    left: string;
    right: string;
  };
}
export interface DocumentTableProps {
  documents: {
    id: number;
    name: string;
    status: "Verified" | "Not available";
    link: string;
  }[];
  editMode?: boolean;
}

export interface CarDetails extends CarBase {
  document: string[];
}

type Car = CarBase;

export type ToastType = {
  type: "success" | "error";
  title: string;
  message: string;
  duration?: number;
  doneAt?: number;
};

export type ToastContextType = {
  toast: ToastType[];
  createToast: (toast: ToastType) => void;
  addDoneCount: () => void;
};
export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  image: string;
}
