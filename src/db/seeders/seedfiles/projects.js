const { v4: uuid } = require("uuid");

module.exports = [
  {
    id: uuid(),
    title: "Ecommerce Mania",
    premium: false,
    image: "",
    skill_level: "intermediate",
    technologies: "Node,Express,Knex,PostgreSQL",
    description:
      "This project is all about building your own ecommerce store. You learn how to use modern tech to build your store front",
  },
  {
    id: uuid(),
    title: "Workout Tracker",
    premium: false,
    image: "",
    skill_level: "starter",
    technologies: "Node,GraphqL,Sequelize,PostgreSQL",
    description:
      "The classic app that help you manage your fitness journey and monitor your overall well being. ",
  },
  {
    id: uuid(),
    title: "Dealership",
    premium: false,
    image: "",
    skill_level: "challenging",
    technologies: "Node,Fastify,Sequelize,PostgreSQL",
    description:
      "This project is all about management software. You will learn how to manage inventory, track orders, and more",
  },
];
