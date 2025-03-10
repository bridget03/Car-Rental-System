// pages/api/userData.js

let userProfile = {
  fullName: "John Doe",
  phoneNumber: "0123456789",
  email: "johndoe@example.com",
  dob: null,
  nationalId: null,
  drivingLicense: null,
  address: {
    city: null,
    district: null,
    ward: null,
  },
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(userProfile);
  }

  if (req.method === "PUT") {
    const { fullName, phoneNumber, email, dob, nationalId, drivingLicense, address } = req.body;

    // Kiểm tra tất cả các trường bắt buộc
    if (
      !fullName ||
      !phoneNumber ||
      !email ||
      !dob ||
      !nationalId ||
      !drivingLicense ||
      !address?.city ||
      !address?.district ||
      !address?.ward
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Cập nhật thông tin người dùng
    userProfile = {
      fullName,
      phoneNumber,
      email,
      dob,
      nationalId,
      drivingLicense,
      address,
    };

    return res.status(200).json({ message: "Cập nhật thông tin thành công", userProfile });
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
