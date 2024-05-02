const tags = [
  {
    id: 1,
    name: "Food",

    description:
      "Apples are packed with nutrients and offer various health benefits. They are rich in antioxidants, fiber...",
    slug: "food",
    count: 2,
  },
  {
    id: 2,
    name: "Business",
    description:
      "From mouth-watering apple pies to refreshing apple salads, there are countless ways to enjoy this versatile fruit...",
    slug: "business",
    count: 5,
  },
  {
    id: 3,
    name: "Education",
    description:
      "Have you ever wondered how apples make their way from the orchard to your table? Join us on a fascinating journey as we explore the apple harvesting process, sorting...",
    slug: "education",
    count: 10,
  },
  {
    id: 4,
    name: "Electronic",
    description: "Understanding the process",
    slug: "electronic",
    count: 15,
  },
];

export function getTags() {
  return tags;
}

export function getTag(name) {
  return tags.find((tag) => tag.name === name);
}
