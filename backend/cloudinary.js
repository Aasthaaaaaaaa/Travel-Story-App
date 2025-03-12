const cloudinary = require('cloudinary').v2;
require("dotenv").config();  // Only call once

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Debugging: Check if Cloudinary is properly configured
console.log("Cloudinary Uploader:", cloudinary.uploader ? "Loaded ✅" : "Not Loaded ❌");

module.exports = cloudinary;  // ✅ Correct way to export in CommonJS
