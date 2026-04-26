import multer from "multer";
import ErrorResponse from "../utils/ApiError.util.js";

// const myStorage = multer.diskStorage({
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "----" + file.originalname);
//   }, //? in your server, this will be the name of the file
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp"); //? this folder should be present the directory (should be relative to the main file)
//   }, //? in your server, this will be the path of the file
// });

const myStorage = multer.memoryStorage();

const myFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse(
        "Only image file with extension .jpg, .jpeg, .png, .gif are allowed",
        400,
      ),
      false,
    );
  }
};

const upload = multer({
  storage: myStorage,
  fileFilter: myFileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

export default upload;
