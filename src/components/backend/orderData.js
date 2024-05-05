const orderData = [
  {
    id: 1,
    orderNumber: 34220934,
    items: ["Good", "Now"],
    price: 50,
    orderDate: "May 15, 2024",
    user: "John",
    status: "Successful",
  },
  {
    id: 2,
    orderNumber: 3992034,
    items: ["Good", "Now"],
    price: 150,
    orderDate: "June 15, 2024",
    user: "John",
    status: "Successful",
  },
  {
    id: 3,
    orderNumber: 3999234,
    items: ["Good", "Now"],
    price: 250,
    orderDate: "June 18, 2024",
    user: "John",
    status: "Failed",
  },
  {
    id: 4,
    orderNumber: 3932234,
    items: ["Good", "Now"],
    price: 250,
    orderDate: "June 18, 2024",
    user: "John",
    status: "Failed",
  },
  {
    id: 5,
    orderNumber: 39932234,
    items: ["Good", "Now"],
    price: 250,
    orderDate: "June 18, 2024",
    user: "John",
    status: "Failed",
  },
];

export function getOrderDatas() {
  return orderData;
}

export function getOrderData(orderNumber) {
  return orderData.find((order) => order.orderNumber === orderNumber);
}
