const categories = [
  {
    id: 1,
    name: "Food",
    subcategories: [
      { id: 2, name: "Boys" },
      { id: 3, name: "Girls", subcategories: [{ id: 4, name: "Shoes" }] },
    ],
    description:
      "Apples are packed with nutrients and offer various health benefits. They are rich in antioxidants, fiber...",
    slug: "food",
    fileType: "image",
    image: "/apple6.jpg",
    count: 2,
  },
  {
    id: 5,
    name: "Business",
    subcategories: [
      { id: 6, name: "Online", slug: "online", description: "this is" },
      {
        id: 7,
        name: "Local",
        slug: "local",
        description: "this local",
        subcategories: [
          {
            id: 8,
            name: "Facebook",
            slug: "facebook",
            description: "this facebook",
          },
        ],
      },
    ],
    description:
      "From mouth-watering apple pies to refreshing apple salads, there are countless ways to enjoy this versatile fruit...",
    slug: "business",
    fileType: "image",
    image: "/apple6.jpg",
    count: 5,
  },
  {
    id: 9,
    name: "Education",
    subcategories: [
      { id: 10, name: "School", slug: "school", description: "this school" },
      {
        id: 11,
        name: "College",
        slug: "college",
        description: "this college",
        subcategories: [
          {
            id: 12,
            name: "Senior",
            slug: "senior",
            description: "this senior",
          },
        ],
      },
    ],
    description:
      "Have you ever wondered how apples make their way from the orchard to your table? Join us on a fascinating journey as we explore the apple harvesting process, sorting...",
    slug: "education",
    fileType: "image",
    image: "/apple6.jpg",
    count: 10,
  },
  {
    id: 13,
    name: "Electronic",
    subcategories: [
      { id: 14, name: "Phones", slug: "phone" },
      { id: 7, name: "Laptops", slug: "laptops" },
    ],
    description: "Understanding the process",
    slug: "electronic",
    fileType: "image",
    image: "/apple6.jpg",
    count: 15,
  },
];

export function getCategories() {
  return categories;
}

export function getCategory(name) {
  return categories.find((tag) => tag.name === name);
}
