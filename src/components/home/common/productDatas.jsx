import productImage from "../images/produ1.avif";
import productImage1 from "../images/produ2.avif";

const products = [
  {
    id: 13,
    name: "Image GaN3 100W Charger",
    price: 220537.2,
    originalPrice: 681885.81,
    image: productImage1,
    numberOfSales: "10,000+ sold",
    rating: 5,
    // superDeal: "Get 3 products get one free",
    shipping: "Get ₦150,000 products, get free shipping",
    choice: "Get 3 products get one free",
    discount: "35%",
  },

  {
    id: 14,
    name: "Online GaN3 100W Charger",
    price: 220537.2,
    originalPrice: 931885.81,
    image: productImage,
    numberOfSales: "20,000+ sold",
    rating: 5,
    superDeal: "Get 3 products get one free",
    // shipping: "Get ₦150,000 products, get free shipping",
    choice: "Get 3 products get one free",
    discount: "78%",
  },
  {
    id: 15,
    name: "Hope GaN3 100W Charger",
    price: 120537.2,
    originalPrice: 531885.81,
    image: productImage1,
    numberOfSales: "2,000+ sold",
    rating: 5,
    superDeal: "Get 3 products get one free",
    shipping: "Get ₦150,000 products, get free shipping",
    // choice: "Get 3 products get one free",
    // discount: "78%",
  },

  {
    id: 1,
    name: "Zenith GaN3 100W Charger",
    price: 100537.2,
    originalPrice: 91885.81,
    image: productImage1,
    numberOfSales: "5,000+ sold",
    rating: 4.8,
    superDeal: "Get 3 products get one free",
    shipping: "Get ₦150,000 products, get free shipping",
    // choice: "Get 3 products get one free",
    discount: "35%",
  },
  {
    id: 2,
    name: "Baseus GaN3 100W Charger",
    price: 80537.2,
    originalPrice: 91885.81,
    image: productImage,
    numberOfSales: "7,000+ sold",
    rating: 4.9,
    choice: "Get 3 products get one free",
    discount: "35%",
  },
  {
    id: 3,
    name: "Product GaN3 100W Charger",
    price: 60537.2,
    originalPrice: 91885.81,
    image: productImage1,
    numberOfSales: "10,000+ sold",
    rating: 2.8,
  },
  {
    id: 4,
    name: "Charge WTA23 100W Charger",
    price: 160537.2,
    originalPrice: 41885.81,
    image: productImage1,
    numberOfSales: "12,000+ sold",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Name GaN3 100W Charger",
    price: 260537.2,
    originalPrice: 81885.81,
    image: productImage,
    numberOfSales: "12,000+ sold",
    rating: 4.6,
  },
  {
    id: 6,
    name: "Price online 100W Charger",
    price: 308537.2,
    originalPrice: 901885.81,
    image: productImage1,
    numberOfSales: "10,000+ sold",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Rating GaN3 100W Charger",
    price: 50537.2,
    originalPrice: 91885.81,
    image: productImage,
    numberOfSales: "15,000+ sold",
    rating: 4.6,
  },
  {
    id: 8,
    name: "Number GaN3 100W Charger",
    price: 850537.2,
    originalPrice: 999885.81,
    image: productImage1,
    numberOfSales: "20,000+ sold",
    rating: 4.6,
  },
  {
    id: 9,
    name: "Sales GaN3 100W Charger",
    price: 750.98,
    originalPrice: 1000.81,
    image: productImage,
    numberOfSales: "19,000+ sold",
    rating: 4.6,
  },
  {
    id: 10,
    name: "Business GaN3 100W Charger",
    price: 550537.2,
    originalPrice: 991885.81,
    image: productImage1,
    numberOfSales: "22,000+ sold",
    rating: 4.6,
  },
  {
    id: 11,
    name: "Big save GaN3 100W Charger",
    price: 507537.2,
    originalPrice: 291885.81,
    image: productImage,
    numberOfSales: "14,000+ sold",
    rating: 4.6,
  },
  {
    id: 12,
    name: "Baseus GaN3 100W Charger",
    price: 505537.2,
    originalPrice: 191885.81,
    image: productImage1,
    numberOfSales: "11,000+ sold",
    rating: 4.6,
  },
];
export function getProducts() {
  return products;
}

export function getProduct(name) {
  return products.find((product) => formatPermalink(product.name) === name);
}

// export function getProduct(title) {
//   const formattedTitle = formatPermalink(title);
//   return products.find(
//     (product) => formatPermalink(product.title) === formattedTitle
//   );
// }

function formatPermalink(name) {
  return name.toLowerCase().replaceAll(" ", "-");
}
