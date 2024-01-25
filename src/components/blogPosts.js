const blogPosts = [
  {
    id: 1,
    title: "The Benefits of Eating Apples",
    fileType: "image",
    content:
      "Apples are packed with nutrients and offer various health benefits. They are rich in antioxidants, fiber...",
    image: "/apple6.jpg",
    datePosted: "May 15, 2023",
    postedBy: "Admin",
    categories: ["fruit", "bag"],
    tags: ["apple", "orange", "Mango"],
    status: "published",
  },
  {
    id: 2,
    title: "Delicious Apple Recipes for Every Occasion",
    fileType: "image",
    content:
      "From mouth-watering apple pies to refreshing apple salads, there are countless ways to enjoy this versatile fruit...",
    image: "/apple3.jpg",
    datePosted: "May 20, 2023",
    postedBy: "Admin",
    categories: ["fruit", "bag"],
    tags: ["apple", "orange", "Mango"],
    status: "published",
  },
  {
    id: 3,
    title: "The Journey from Orchard to Your Table",
    content:
      "Have you ever wondered how apples make their way from the orchard to your table? Join us on a fascinating journey as we explore the apple harvesting process, sorting...",
    image: "/apple1.jpg",
    fileType: "image",
    datePosted: "May 25, 2023",
    categories: ["fruit", "bag"],
    tags: ["apple", "orange", "Mango"],
    postedBy: "Admin",
    status: "draft",
  },
  {
    id: 4,
    title: "I want to get is done",
    content: "Understanding the process",
    fileType: "image",
    image: "/apple1.jpg",
    datePosted: "May 25, 2023",
    postedBy: "Admin",
    status: "trash",
  },

  {
    id: 4,
    title: "I want to get is done",
    content: "Understanding the process",
    fileType: "image",
    image: "/apple1.jpg",
    datePosted: "May 25, 2023",
    postedBy: "Admin",
    status: "trash",
  },
];

export function getBlogPosts() {
  return blogPosts;
}

export function getBlogPost(title) {
  return blogPosts.find((post) => formatPermalink(post.title) === title);
}

function formatPermalink(title) {
  return title.toLowerCase().replaceAll(" ", "-");
}
