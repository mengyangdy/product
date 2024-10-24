import * as multer from "multer";
import * as fs from "node:fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync("uploads");
    } catch (e) {}
    cb(null, "uploads");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      (Math.round(Math.random() * 1e9) + "-" + file.originalname);
    callback(null, uniqueSuffix);
  },
});

export { storage };
