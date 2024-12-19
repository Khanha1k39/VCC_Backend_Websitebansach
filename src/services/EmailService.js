const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/.env" });

const sendEmailCreateOrder = async (order) => {
  console.log(order);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    totalPrice,
    user,
  } = order;
  const itemsPrice = orderItems.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );
  const itemsHtml = orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
            item.amount
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${(
            item.price * item.amount
          ).toLocaleString()} VND</td>
        </tr>
      `
    )
    .join("");

  const htmlContent = `
    <h2>Đơn hàng của bạn đã được đặt thành công!</h2>
    <p>Xin chào, ${user || "Khách hàng"},</p>
    <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là thông tin chi tiết về đơn hàng:</p>

    <h3>Thông tin đơn hàng</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th style="padding: 8px; border: 1px solid #ddd;">Tên sản phẩm</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Số lượng</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Giá</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <h3>Tổng cộng</h3>
    <p><strong>Phương thức thanh toán:</strong> ${
      paymentMethod || "Chưa cập nhật"
    }</p>
    <p><strong>Giá sản phẩm:</strong> ${itemsPrice.toLocaleString()} VND</p>
    <p><strong>Phí vận chuyển:</strong> ${shippingPrice.toLocaleString()} VND</p>
    <p><strong>Thuế:</strong> ${itemsPrice * 0.1} VND</p>
    <p><strong>Tổng cộng:</strong> ${(
      itemsPrice * 1.1
    ).toLocaleString()} VND</p>

    <h3>Địa chỉ giao hàng</h3>
    <p>${shippingAddress?.address || "Không có địa chỉ giao hàng"}</p>

    <p>Chúng tôi sẽ sớm liên hệ với bạn để xác nhận và giao hàng.</p>
    <p>Trân trọng,</p>
    <p>Đội ngũ hỗ trợ</p>
        <p>Khánh,</p>
    <p>Dương Quốc Khánh</p>
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    // true for port 465, false for other ports
    auth: {
      user: process.env.Mail_name,
      pass: process.env.Mail_password,
    },
  });
  const info = await transporter.sendMail({
    from: '"Khanhbansach" <duongkhanhb1k39@gmail.com>',
    to: shippingAddress.email, // người nhận email (khách hàng)
    subject: "Xác nhận đơn hàng thành công", // Tiêu đề email
    html: htmlContent, // Nội dung email dạng HTML
  });
  console.log("info", info);
};
module.exports = { sendEmailCreateOrder };
