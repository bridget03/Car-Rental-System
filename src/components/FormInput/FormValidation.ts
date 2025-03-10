import * as Yup from "yup";

export const userValidationSchema = Yup.object().shape({
    name: Yup.string().required("This field is required"),
    phone: Yup.string()
        .matches(/^\+?[0-9]{10,11}$/, "Please enter a valid phone number (10-11 digits, can start with '+')")
        .required("This field is required"),

    nationalID: Yup.string().required("This field is required"),
    dateOfBirth: Yup.string().required("This field is required"),
    email: Yup.string().email("Please enter a valid email address").required("This field is required"),
    drivingLicense: Yup.string().required("This field is required"),
    address: Yup.object({
        city: Yup.string().required("This field is required"),
        district: Yup.string().required("This field is required"),
        ward: Yup.string().required("This field is required"),
        houseNumberStreet: Yup.string().required("This field is required"),
    }),
});