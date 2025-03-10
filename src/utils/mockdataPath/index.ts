import path from "path";

const usersPath = path.join(process.cwd(), "src/pages/api/mockdata/users.json");
const tokensPath = path.join(process.cwd(), "src/pages/api/mockdata/resetTokens.json");
const bookingsPath = path.join(process.cwd(), "src/pages/api/mockdata/booking.json");
const carsPath = path.join(process.cwd(), "src/pages/api/mockdata/cars.json");
export { usersPath, tokensPath, bookingsPath, carsPath };