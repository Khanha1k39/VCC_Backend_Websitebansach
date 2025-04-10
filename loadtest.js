const autocannon = require("autocannon");
const fs = require("fs");

// Cấu hình Autocannon
const instance = autocannon({
  url: "http://localhost:3001/api/order/create", // URL của API bạn muốn test
  connections: 20, // Số kết nối đồng thời
  duration: 5, // Thời gian chạy test (giây)
  requests: [
    {
      method: "POST", // Phương thức GET
      body: JSON.stringify({
        orderItems: [
          {
            name: "Tôi Thấy Hoa Vàng Trên Cỏ Đen",
            amount: 1,
            image:
              "https://salt.tikicdn.com/cache/750x750/ts/product/2e/ae/d3/2e400bbfda127802bf5fd46f86ead538.jpg.webp",
            price: 160000,
            product: "675c6cdd96afc6f7cdfc9fcd",
            _id: "67f7755ce9c505d7570a6be7",
          },
        ],
        shippingAddress: {
          fullname: "Khánh",
          address: "xóm 3",
          email: "duongkhanhb1k39@gmail.com",
          phone: "0384574349",
        },
        paymentMethod: "Tiền mặt",
        itemsPrice: 0,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: 0,
        isPaid: false,
        paidAt: null,
        isDelevery: false,
        deliveryAt: null,
        createdAt: "2025-04-10T07:38:04.571Z",
        updatedAt: "2025-04-10T07:38:04.571Z",
        __v: 0,
      }),

      // Không cần body cho GET, bỏ JSON.stringify(orderData)
      headers: {
        "Content-Type": "application/json", // Vẫn giữ header nếu API yêu cầu
      },
    },
  ],
});

// Bắt đầu test và theo dõi tiến độ
autocannon.track(instance, { renderProgressBar: true });

// Khi test hoàn thành, sẽ thông báo kết quả
instance.on("done", () => {
  console.log("Test completed.");
});
