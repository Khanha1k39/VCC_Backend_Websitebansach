const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    meta_data: {
      type: Object,
      default: {},
      properties: {
        authors: { type: String },
        coverType: { type: String },
        publisher: { type: String },
        publicationDate: { type: Date },
        pages: { type: Number },
        language: { type: String },
      },
    },
    price: {
      type: Number,
      required: true,
    },
    quantity_available: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
