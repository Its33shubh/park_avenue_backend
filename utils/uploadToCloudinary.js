const cloudinary = require("../config/cloudinary");

exports.uploadImage = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder
      }
    );

    return result.secure_url;

  } catch (error) {
    throw new Error("Image upload failed");
  }
};