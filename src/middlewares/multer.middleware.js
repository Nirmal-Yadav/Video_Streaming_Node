import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // first parameter is for error handling thats why null is given
  }, //    cb(new Error("Invalid file type"), null);
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname); //   file.fieldname + "-" + uniqueSuffix
  },
});

export const upload = multer({ storage: storage });

// {
//     "message": "File uploaded successfully!",
//     "file": {
//       "fieldname": "file",
//       "originalname": "myfile.jpg",
//       "encoding": "7bit",
//       "mimetype": "image/jpeg",
//       "destination": "./public/temp",
//       "filename": "myfile.jpg",
//       "path": "./public/temp/myfile.jpg",
//       "size": 123456
//     }
//   }
