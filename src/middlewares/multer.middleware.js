import multer from "multer";

const storage = multer.diskStorage({
  destination:
   function (req, file, cb) {
    cb(null, "./public/temp"); // Specify the destination folder for uploaded files
  },
  filename:
   function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname + '-' + uniqueSuffix); // Use the original file name with a unique suffix
  }
})

export const upload = multer({ storage,})