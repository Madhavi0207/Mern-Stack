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
    origin: "*",
  })
);

app.use(express.json());

connectToDatabase();

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
  // tyo image lekheko thau ma postman ma ni tei lekhnu parxa
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body;
  let fileName;

  if (!req.file) {
    fileName =
      "https://media.licdn.com/dms/image/v2/D4E03AQFrOCW3mBEe7Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707299574083?e=1756339200&v=beta&t=bIsV63fRvp4l7I0KzCl_Yno4B968BVsvUhtrk2QOiDs";
  } else {
    fileName = "http://localhost:3000/" + req.file.filename;
  }

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

app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;
  await Book.findByIdAndDelete(id); //returns null
  res.status(200).json({
    message: "Book deleted successfully",
  });
});

//update

app.patch("/book/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id; // kun book ma update garaune ho
  const {
    bookName,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  } = req.body;

  const oldDatas = await Book.findById(id);
  let fileName;
  if (req.file) {
    const oldImagePath = oldDatas.imageUrl;
    console.log(oldImagePath);

    const localHostUrlLength = "http://localhost:3000/".length;
    console.log(oldDatas);
    let newOldImagePath;
    if (oldImagePath.startsWith("http://localhost:3000/")) {
      newOldImagePath = oldImagePath.slice(localHostUrlLength);
    } else {
      newOldImagePath = oldImagePath;
    }
    console.log(newOldImagePath);

    fs.unlink(`storage/${newOldImagePath}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file deleted succesfully");
      }
    });
    fileName = "http://localhost:3000/" + req.file.filename;
  }

  await Book.findByIdAndUpdate(id, {
    bookName /*: bookName*/,
    bookPrice,
    isbnNumber,
    authorName,
    publishedAt,
    publication,
  });

  res.status(200).json({
    message: "book updated successfully.........",
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
