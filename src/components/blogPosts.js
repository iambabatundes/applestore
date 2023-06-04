const blogPosts = [
  {
    title: "The Benefits of Eating Apples",
    content:
      "Apples are packed with nutrients and offer various health benefits. They are rich in antioxidants, fiber...",
    image: "apple6.jpg",
    datePosted: "May 15, 2023",
    postedBy: "Admin",
  },
  {
    title: "Delicious Apple Recipes for Every Occasion",
    content:
      "From mouth-watering apple pies to refreshing apple salads, there are countless ways to enjoy this versatile fruit...",
    image: "apple3.jpg",
    datePosted: "May 20, 2023",
    postedBy: "Admin",
  },
  {
    title: "The Journey from Orchard to Your Table",
    content:
      "Have you ever wondered how apples make their way from the orchard to your table? Join us on a fascinating journey as we explore the apple harvesting process, sorting...",
    image: "apple1.jpg",
    datePosted: "May 25, 2023",
    postedBy: "Admin",
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
