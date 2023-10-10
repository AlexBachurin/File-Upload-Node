const { STATUS_CODES } = require("http");
const { StatusCodes } = require("http-status-codes");
const path = require("path");

const uploadProductImage = async (req, res) => {
  // store image object we get from req.files
  const productImage = req.files.image;
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

module.exports = {
  uploadProductImage,
};
