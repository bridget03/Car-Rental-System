import { v2 as cloudinary } from "cloudinary";
 
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
 
export default async function handler(req, res) {
  const { folder } = req.query;
  let apiKey = process.env.CLOUDINARY_API_KEY;
  let timestamp = Math.round((new Date).getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({timestamp, folder, use_filename: "true"}, process.env.CLOUDINARY_API_SECRET);
 
  res.status(200).json({ timestamp, signature, apiKey, folder, cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME });
}