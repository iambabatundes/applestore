import productImage from "../images/produ1.avif";
import productImage1 from "../images/produ2.avif";

const products = [
  {
    name: "Baseus GaN3 100W Charger",
    price: "₦100,537.20",
    originalPrice: "₦91,885.81",
    image: productImage1,
    sold: "5,000+ sold",
    rating: 4.8,
  },
  {
    name: "Baseus GaN3 100W Charger",
    price: "₦80,537.20",
    originalPrice: "₦91,885.81",
    image: productImage,
    sold: "5,000+ sold",
    rating: 4,
  },
  {
    name: "Baseus GaN3 100W Charger",
    price: "₦60,537.20",
    originalPrice: "₦91,885.81",
    image: productImage1,
    sold: "5,000+ sold",
    rating: 2.8,
  },
  {
    name: "Baseus GaN3 100W Charger",
    price: "₦50,537.20",
    originalPrice: "₦91,885.81",
    image: productImage,
    sold: "5,000+ sold",
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
