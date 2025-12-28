export const Products = [];
import p1 from "../data/images/p-1.jpg";
import p2 from "../data/images/p-2.jpg";
import p3 from "../data/images/p-3.png";
import p4 from "../data/images/p-4.jpg";
import p5 from "../data/images/p-5.png";
import p6 from "../data/images/p-6.jpg";
import p7 from "../data/images/p-7.png";
import p8 from "../data/images/p-8.png";

export const filterList = {
  types: [
    { id: "uuid1", label: "savory" },
    { id: "uuid2", label: "confectionary" },
    { id: "uuid3", label: "fried" },
    { id: "uuid4", label: "baked" },
    { id: "uuid5", label: "healthy" },
  ],
  categories: [
    { id: "uuid1", label: "spicy" },
    { id: "uuid2", label: "salty" },
    { id: "uuid3", label: "sweetened" },
    { id: "uuid4", label: "cheesy" },
    { id: "uuid5", label: "chocolate" },
  ],
};

export const products = [
  {
    id: "uuid1",
    name: "Cheetos Cheese Crunch",
    description:
      "Crunchy corn snack coated with bold cheesy seasoning, delivering a rich and savory flavour in every bite.",
    images: [p1],
    categoryId: "uuid4", // cheesy
    price: 2.5,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 150,
    status: "order",
  },
  {
    id: "uuid2",
    name: "Doritos Nacho Cheese",
    description:
      "Crispy triangle corn chips packed with intense nacho cheese flavour, perfect for bold snacking moments.",
    images: [p2],
    categoryId: "uuid4",
    price: 3.0,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 120,
    status: "order",
  },
  {
    id: "uuid3",
    name: "Doritos Dinamita",
    description:
      "Rolled tortilla chips with explosive spicy seasoning and an extra crunchy texture for heat lovers.",
    images: [p3],
    categoryId: "uuid1", // spicy
    price: 3.2,
    discount: 1,
    rating: 5,
    review: [],
    inventory: 100,
    status: "order",
  },
  {
    id: "uuid4",
    name: "Goldfish Cheddar Crackers",
    description:
      "Baked cheese crackers with a light crunch and mild cheddar taste, ideal for everyday snacking.",
    images: [p4],
    categoryId: "uuid4",
    price: 2.8,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 200,
    status: "order",
  },
  {
    id: "uuid5",
    name: "KitKat Chocolate Bar",
    description:
      "Crispy wafer fingers layered with smooth milk chocolate for a perfectly balanced chocolate treat.",
    images: [p5],
    categoryId: "uuid5", // chocolate
    price: 2.2,
    discount: 1,
    rating: 5,
    review: [],
    inventory: 180,
    status: "order",
  },
  {
    id: "uuid6",
    name: "Kurkure Masala Munch",
    description:
      "Fried corn snack infused with bold spices and deep seasoning for a satisfying spicy crunch.",
    images: [p6],
    categoryId: "uuid1",
    price: 2.0,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 140,
    status: "order",
  },
  {
    id: "uuid7",
    name: "Lay’s Classic",
    description:
      "Thin and crispy potato chips lightly seasoned with salt to highlight the natural potato flavour.",
    images: [p7],
    categoryId: "uuid2", // salty
    price: 2.7,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 220,
    status: "order",
  },
  {
    id: "uuid8",
    name: "Lindt Excellence 70% Cocoa",
    description:
      "Premium dark chocolate crafted with high cocoa content, offering a rich and refined taste.",
    images: [p8],
    categoryId: "uuid5",
    price: 4.5,
    discount: 1,
    rating: 5,
    review: [],
    inventory: 90,
    status: "order",
  },
  {
    id: "uuid9",
    name: "Nature Valley Oats & Honey",
    description:
      "Crunchy granola bars made with whole-grain oats and honey, providing natural sweetness and energy.",
    images: ["nature valley(health-sweet).jpg"],
    categoryId: "uuid3", // sweetened
    price: 3.5,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 160,
    status: "order",
  },
  {
    id: "uuid10",
    name: "Oreo Original",
    description:
      "Chocolate sandwich cookies with a smooth vanilla cream filling, delivering iconic flavour and crunch.",
    images: ["Oreo(choco-con).png"],
    categoryId: "uuid5",
    price: 3.0,
    discount: 1,
    rating: 5,
    review: [],
    inventory: 200,
    status: "order",
  },
  {
    id: "uuid11",
    name: "Pringles Original",
    description:
      "Uniformly shaped potato crisps lightly salted for consistent crunch and classic flavour.",
    images: ["pringles(sav-salt).jpg"],
    categoryId: "uuid2",
    price: 3.3,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 170,
    status: "order",
  },
  {
    id: "uuid12",
    name: "Takis Fuego",
    description:
      "Rolled tortilla chips bursting with intense chilli heat and tangy lime flavour.",
    images: ["Takis(sav-spi).png"],
    categoryId: "uuid1",
    price: 3.4,
    discount: 1,
    rating: 5,
    review: [],
    inventory: 110,
    status: "order",
  },
  {
    id: "uuid13",
    name: "Uncle Chipps",
    description:
      "Classic fried potato chips with a hearty crunch and simple salty seasoning.",
    images: ["unclechips(fri-salt).jpg"],
    categoryId: "uuid2",
    price: 2.3,
    discount: 1,
    rating: 4,
    review: [],
    inventory: 190,
    status: "order",
  },
  {
    id: "uuid14",
    name: "Wonderful Pistachios",
    description:
      "Roasted pistachios lightly salted for a nutritious and satisfying healthy snack.",
    images: ["wonderful(pistachios)(health-salty).png"],
    categoryId: "uuid2",
    price: 4.0,
    discount: 1,
    rating: 5,
    review: [],
    inventory: 130,
    status: "order",
  },
];
