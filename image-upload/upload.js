require('dotenv').config({ path: '../.env' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Path to the images folder
const imagesFolder = path.join(__dirname, '../public/explainable-ai');

// Function to upload image
async function uploadImage(imagePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      public_id: publicId,
      folder: 'explainable-ai', // Optional: organize in a folder
    });
    console.log(`Uploaded ${publicId}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading ${publicId}:`, error);
  }
}

// Main function
async function uploadAllImages() {
  const images = [
    'brain_shap.png',
    'heart_shap.png',
    'kidney_shap.png',
    'liver_shap.png',
    'lung_shap.png',
  ];

  for (const image of images) {
    const imagePath = path.join(imagesFolder, image);
    const publicId = path.parse(image).name; // Remove extension
    await uploadImage(imagePath, publicId);
  }

  console.log('All images uploaded successfully!');
}

uploadAllImages();