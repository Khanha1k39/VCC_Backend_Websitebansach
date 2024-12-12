const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
