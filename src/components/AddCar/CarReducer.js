export const initialState = {
  step1: {
    license: "",
    brandName: "",
    productionYear: "",
    color: "",
    model: "",
    noOfSeats: "",
    transmission: "",
    fuel: "",
    registrationCertificate: null,
    certificateOfInspection: null,
    insurance: null,
  },
  step2: {
    mileage: "",
    fuelConsumption: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    description: "",
    additionalFunctions: [],
    leftSide: "",
    rightSide: "",
  },
  step3: {
    basePrice: "",
    deposit: "",
    rentalConditions: {
      noSmoking: false,
      noPet: false,
      noFood: false,
      other: false,
    },
    otherConditions: "",
  },
};

export const carReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_STEP1":
      return { ...state, step1: { ...state.step1, ...action.payload } };
    case "UPDATE_STEP2":
      return { ...state, step2: { ...state.step2, ...action.payload } };
    case "UPDATE_STEP3":
      return {
        ...state,
        step3: {
          ...state.step3,
          ...action.payload,
          rentalConditions: {
            ...state.step3.rentalConditions,
            ...action.payload.rentalConditions,
          },
        },
      };
    default:
      return state;
  }
};
