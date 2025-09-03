require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./bookmanagement System/databse");
const Book = require("./bookmanagement System/databse/bookModel");
const fs = require("fs");
const { multer, storage } = require("./middleware/multerConfig");

const upload = multer({ storage: storage }); // multer ma storage bhanne key ho

const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["*", "https://frontend-react-seven-psi.vercel.app/"],
  })
);

app.use(express.json());

connectToDatabase();
const BASE_URL = "https://mern-stack-jhqs.onrender.com ";

app.get("/", (req, res) => {
  res.status(202).json("hello Madhavi");
  console.log(req.url);
});

app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.status(200).json({
    message: "Books fetched successfully",
    data: books,
  });
});

app.post("/books", upload.single("image"), async (req, res) => {
  let fileName = req.file
    ? `{BASE_URL}/${req.file.filename}`
    : "https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg";
  // tyo image lekheko thau ma postman ma ni tei lekhnu parxa
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body;
  await Book.create({
    bookName /*: bookName*/,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
    imageUrl: fileName,
  });
  console.log("Body: ", req.body);
  res.status(201).json({
    message: "Book create successfully........",
  });
});

//single read
app.get("/book/:id", async (req, res) => {
  const id = req.params.id;
  const book = await Book.findById(id);
  if (!book) {
    res.status(404).json({
      message: "Nothing found",
    });
  } else {
    res.status(200).json({
      message: "Single book triggered",
      data: book,
    });
  }
});

// delete garda jun user ley delete garna khojeko ho tyo matrai delete hunu paryo

app.delete("/book/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Delete image file only if it's stored locally (not placeholder or external link)
    if (book.imageUrl && book.imageUrl.startsWith(BASE_URL)) {
      const imagePath = book.imageUrl.slice(BASE_URL.length + 1);
      fs.unlink(`torage/${imagePath}`, (err) => {
        if (err) console.error("Error deleting file:", err);
        else console.log("Image file deleted successfully");
      });
    }
    // Delete book from DB
    await Book.findByIdAndDelete(id);

    res.status(200).json({
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
if (book.imageUrl && book.imageUrl.startsWith(BASE_URL)) {
  const imagePath = book.imageUrl.slice(BASE_URL.length + 1);
  fs.unlink(`torage/${imagePath}`, (err) => {
    if (err) console.error("Error deleting file:", err);
    else console.log("Image file deleted successfully");
  });
}

//update

app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // kun book update garney id ho yo
  const {
    bookName,
    bookPrice,
    authorName,
    publishedAt,
    publication,
    isbnNumber,
  } = req.body;
  const oldDatas = await Book.findById(id);
  if (!oldDatas) {
    return res.status(404).json({ message: "Book not found" });
  }

  let fileName = oldDatas.imageUrl;

  if (req.file) {
    // delete old file if it was not a placeholder image
    if (oldDatas.imageUrl && oldDatas.imageUrl.startsWith(BASE_URL)) {
      const oldImagePath = oldDatas.imageUrl.slice(BASE_URL.length + 1);
      fs.unlink(`storage/${oldImagePath}`, (err) => {
        if (err) console.log("Error deleting old file:", err);
        else console.log("Old file deleted successfully");
      });
    }

    // save new file path
    fileName = `{BASE_URL}/${req.file.filename}`;
  }

  await Book.findByIdAndUpdate(id, {
    bookName,
    bookPrice,
    authorName,
    publication,
    publishedAt,
    isbnNumber,
    imageUrl: fileName, //  update image URL if changed
  });

  res.status(200).json({
    message: "Book Updated Successfully",
  });
});

app.use(express.static("./storage/")); // esma k dine bhanera carefull hunu parxa

app.listen(process.env.PORT, () => {
  console.log("Node.js server is running on the port");
});

// multer is middleware. multer ley border ma police checking gare jasto garxa
//backend ma file storage  file handling garxa
// middleware bhanera file garayera rakhera export imort garyo bhaney sajilo hunxa
// text wala data aayo bhaney application/json hunxa tara file aayo bhaney multipart/form-data hunxa
