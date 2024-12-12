const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: True },
        amount: { type: Number, required: True },
        image: { type: String, required: True },
        price: { type: Number, required: True },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullname: { type: String, required: True },
      address: { type: String, required: True },
      city: { type: String, required: True },
      phone: { type: String, required: True },
    },
    paymentMethod: { type: String, required: True },
    itemsPrice: { type: Number, required: True, unique: True },
    shippingPrice: { type: Number, required: True },
    taxPrice: { type: Number, default: false, required: True },
    totalPrice: { type: Number, required: True },
    user: { type: mongoose.Schema.ObjectId, ref: "Product" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelevery: { type: Boolean, default: False },
    deliveryAt: { type: Date },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
