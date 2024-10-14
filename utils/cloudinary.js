const cloudinary = require("cloudinary");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImages = async (fileUpload) => {
  try {
    const data = await Promise.all(
      fileUpload?.map((file) =>
        cloudinary.uploader.upload(file, {
          resource_type: "auto",
        })
      )
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

const cloudinaryUploadImage = async (fileUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { cloudinaryUploadImages, cloudinaryUploadImage };
