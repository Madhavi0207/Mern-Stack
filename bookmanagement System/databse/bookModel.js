const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookName: {
    type: String,
    unique: true, // rakhnai parxa which prevents us from posting books of same name
    // require: true,
  },
  bookPrice: {
    type: Number,
  },
  isbnNumber: {
    type: Number,
  },
  authorName: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  publication: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
