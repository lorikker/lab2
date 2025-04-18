// Populate db with some placeholder data
const users = [
  {
    id: "6544f4dbfeb59e967ca03906",
    name: "John Doe",
    email: "john@doe.com",
    password: "12345678",
  },
];

const posts = [
  {
    id: "6544f4dbfeb59e967ca03206",
    title: "Exploring the Wonders of Nature",
    content:
      "Join us on a journey through lush forests, cascading waterfalls, and breathtaking landscapes. Experience the beauty of the natural world like never before.",
    createdById: "6544f4dbfeb59e967ca03906",
  },
  {
    id: "6544f4dbfeb52e967ca03206",
    title: "The Art of Culinary Delights",
    content:
      "Indulge your taste buds with our culinary creations. From delectable desserts to savory dishes, discover the secrets of gastronomic excellence.",
    createdById: "6544f4dbfeb59e967ca03906",
  },
  {
    id: "6514f4dbfeb59e967ca03206",
    title: "Mastering the Digital Realm",
    content:
      "Unleash your creativity in the digital world. Learn the latest techniques in graphic design, web development, and digital marketing to boost your online presence.",
    createdById: "6544f4dbfeb59e967ca03906",
  },
];

module.exports = {
  users,
  posts,
};
