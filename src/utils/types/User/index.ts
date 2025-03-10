type UserRole = "carOwner" | "customer"

export interface Address {
  city?: string;
  district?: string;
  ward?: string;
  houseNumberStreet?: string;
};

export interface User {
  id?: string;
  name?: string;
  phone?: string;
  nationalID?: string;
  dateOfBirth?: string;
  email?: string;
  drivingLicense?: string;
  address?: Address;

  username?: string;
  password?: string;
  wallet?: number;
  role?: string;
};


export type CityType = {
  name: string;
  districts: DistrictType[];
};
export type DistrictType = {
  name: string;
  wards: WardType[];
};
export type WardType = {
  name: string;
};


