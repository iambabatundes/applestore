const products = [
  {
    id: 1,
    data: "/brandNew21.webp",
    productDatas: {
      image1: "/brandNew23.webp",
      image2: "/brandNew21.webp",
      image3: "/brandNew32.webp",
      image4: "/brandNew342.webp",
      image5: "/brandNew.webp",
      video1: "/video1.mp4",
      video2: "/video1.mp4",
    },

    title: "Refreshing Flavors in Every Bite",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    description:
      "Experience the Orchard's Finest Selection with our Handpicked Apples: Indulge in the Juicy Sweetness and Exquisite Flavor of Nature's Bounty",
    rating: 4.5,
    price: 19.99,
    className: "brandNew",
  },
  {
    id: 2,
    data: "/brand11.webp",
    title: "Discover the Delight of Fresh Apples",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    description:
      "Embark on a Journey through Nature's Apple Extravaganza: Immerse Yourself in a Whirlwind of Tempting Varieties Grown in Lush Orchards",
    rating: 5,
    price: 20.99,
    className: "brand11",
  },

  {
    id: 3,
    data: "/newBrand.webp",
    title: "Apple Ecstasy at Your Fingertips.",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    description:
      "Savor the Symphony of Freshness with our Crisp and Succulent Apples: Grown with Care and Nurtured",
    rating: 3.9,
    price: 100,
    className: "newBrand",
  },

  {
    id: 4,
    // image: "apple9.jpg",
    title: "Savor the Orchard's Finest Apples.",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    price: 50.99,
    data: "/brandNew23.webp",
    productDatas: {
      image1: "/brandNew23.webp",
      image2: "/brandNew21.webp",
      image3: "/brandNew32.webp",
      image4: "/brandNew342.webp",
    },
    className: "brandNew23",
  },

  {
    id: 5,
    // image: "apple1.jpg",
    title: "Savor the Orchard's Finest Apples.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    price: 50.99,
    data: "/brandNew21.webp",
    className: "brandNew21",
  },
  {
    id: 6,
    // image: "apple2.jpg",
    title: "A Crescendo of Crispness, Sweetness Apple.",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    price: 50.99,
    data: "/brandNew32.webp",
    className: "brandNew32",
  },
  {
    id: 7,
    // image: "apple3.jpg",
    title: "Savor the Orchard's Finest Apples.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    rating: 4.99,
    price: 50.99,
    data: "/brand2.webp",
    className: "brand2",
  },
  {
    id: 8,
    // image: "apple10.jpg",
    title: "Prepare for The Apple Symphony.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    price: 50.99,
    data: "/brand11.webp",
    className: "brand11",
  },
  {
    id: 9,
    // image: "apple8.jpeg",
    title: "the Orchard's Finest Apples.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    price: 50.99,
    data: "/brands.webp",
    className: "brands",
  },
  {
    id: 10,
    // image: "apple9.jpg",
    title: "Savor the Orchard's Finest Apples.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    price: 50.99,
    data: "/brand32.webp",
    className: "brand32",
  },
  {
    id: 11,
    // image: "apple9.jpg",
    title: "Prepare for The Apple Symphony Orchestra.",
    subtitle: "Prepare for The Apple Symphony Orchestra.",
    description:
      "Prepare for The Apple Symphony Orchestra: A Crescendo of Crispness, Sweetness, and Unforgettable Eating Pleasure.",
    rating: 4.99,
    price: 50.99,
    data: "/brand32.webp",
    className: "brand32",
  },
];

// export default products;

export function getProducts() {
  return products;
}

export function getProduct(title) {
  return products.find((product) => formatPermalink(product.title) === title);
}

function formatPermalink(title) {
  return title.toLowerCase().replaceAll(" ", "-");
}
