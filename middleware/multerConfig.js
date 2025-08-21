const multer = require("multer");
const storage = multer.diskStorage({
  // const bhanera variable garayera
  // cb bhaneko call back function diskstorage bhaneko multer already hunxa hamley use matrai garne ho
  destination: (req, file, cb) => {
    const allowedFileTypes = ["image/jpg", "image/png", "image/jpeg"];

    if (!allowedFileTypes.includes(file.mimetype)) {
      cb(new Error("invalid file type.only jpg,png,jpeg are allowed"));
      return;
    }
    console.log(file);
    cb = (null, "./storage");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path(file.originalname));
  }, //date now ley unique time dinxa meaning current time
});

module.exports = { multer, storage };
