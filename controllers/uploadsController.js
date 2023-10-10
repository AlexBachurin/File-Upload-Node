const { STATUS_CODES } = require("http");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const path = require("path");
const { log } = require("console");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// LOCAL UPLOAD FUNCTIONALITY
const uploadProductImageLocal = async (req, res) => {
  // check if file exists
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }

  // store image object we get from req.files
  const productImage = req.files.image;
  //   check format(image or not)
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }
  // check size of image
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1mb");
  }
  //construct path
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  //move image to our path
  await productImage.mv(imagePath);
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

//UPLOAD CLOUDINARY
const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      // store in folder
      folder: "FILE-UPLOAD-NODE",
    }
  );
  //   clear temp files
  fs.unlinkSync(req.files.image.tempFilePath);
  //   log(result)
  //   send back secure url
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage,
};
