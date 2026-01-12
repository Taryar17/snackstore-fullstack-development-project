export const siteConfig = {
  name: "Snack Break",
  description: "Your favorite place for snacks",
  mainNav: [
    {
      title: "Order Now",
      card: [
        {
          title: "Cheesy Delights",
          href: "/products?categories=1",
          description: "Rich, creamy, and full of cheese flavor",
        },
        {
          title: "Spicy Snacks",
          href: "/products?categories=2",
          description: "Bold flavors for heat lovers",
        },
        {
          title: "Chocolate Snacks",
          href: "/products?categories=3",
          description: "Indulgent chocolate goodness in every bite",
        },
        {
          title: "Salty Bites",
          href: "/products?categories=4",
          description: "Classic salty and crunchy treats",
        },
        {
          title: "Sweetened Treats",
          href: "/products?categories=6",
          description: "Lightly sweet and satisfying snacks",
        },
      ],
      menu: [
        { title: "Preorder", href: "preorders" },
        { title: "About Us", href: "about" },
      ],
    },
  ],
  footerNav: [
    {
      title: "Snack Types",
      items: [
        {
          title: "Savory Snacks",
          href: "/products?types=1",
          external: true,
        },
        {
          title: "Fried Favorites",
          href: "/products?types=2",
          external: true,
        },
        {
          title: "Confectionary Bites",
          href: "/products?types=3",
          external: true,
        },
        {
          title: "Healthy Choices",
          href: "/products?types=4",
          external: true,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "X",
          href: "https://twitter.com",
          external: true,
        },
        {
          title: "GitHub",
          href: "https://github.com",
          external: true,
        },
        {
          title: "Discord",
          href: "https://discord.com",
          external: true,
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          title: "About",
          href: "/about",
          external: false,
        },
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Terms",
          href: "/terms",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
      ],
    },
    {
      title: "Partner",
      items: [
        {
          title: "Shoppy",
          href: "https://shoppy.com",
          external: true,
        },
        {
          title: "Poppy",
          href: "https://poppy.com",
          external: true,
        },
        {
          title: "Talkie",
          href: "https://talkie.com",
          external: true,
        },
        {
          title: "Coffee",
          href: "https://coffee.com",
          external: true,
        },
      ],
    },
  ],
};
