import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../components/action/Api";

function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const fallbackData = [
  {
    id: 1,
    title: "Prosciutto-Wrapped Shatawari",
    description: "Vivamus tempor magna et tempus elementum.",
    price: "₹950",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
    tags: ["V"],
    type: "Starter"
  },
  {
    id: 2,
    title: "Dark Chocolate Avocado Moos",
    description: "Vestibulum ante ipsum primis in faucibus orci luctus.",
    price: "₹1120",
    image:
      "https://bootstrapmade.com/content/demo/Platia/assets/img/restaurant/dessert-9.webp",
    tags: ["SF"],
    type: "Dessert"
  },
  {
    id: 3,
    title: "Herb-Crusted Rack of Lamb",
    description: "Mauris auctor nulla et felis tempor.",
    price: "₹2100",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    tags: ["Featured", "Chef's Choice"],
    type: "Main Course"
  },
  {
    id: 4,
    title: "Truffle Mushroom Soup",
    description: "A creamy blend of wild mushrooms with a hint of truffle oil.",
    price: "₹650",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo2hJLfC2nfBTf6ljxawrNoAmICUD22s7vag&s",
    tags: ["V"],
    type: "Starter"
  },
  {
    id: 5,
    title: "Grilled Salmon with Asparagus",
    description:
      "Fresh Atlantic salmon grilled to perfection with seasonal greens.",
    price: "₹1850",
    image:
      "https://mealpractice.b-cdn.net/277900502140850176/lemon-herb-grilled-salmon-with-garlic-mashed-potatoes-and-steamed-asparagus-bqgNl4iYUi.webp",
    tags: ["Gluten-Free"],
    type: "Main Course"
  },
  {
    id: 6,
    title: "Classic Tiramisu",
    description:
      "Italian dessert with layers of mascarpone and espresso-soaked ladyfingers.",
    price: "₹720",
    image:
      "https://staticcookist.akamaized.net/wp-content/uploads/sites/22/2024/09/THUMB-VIDEO-2_rev1-56.jpeg",
    tags: ["Chef's Choice"],
    type: "Dessert"
  },
  {
    id: 7,
    title: "Spicy Mango Margarita",
    description:
      "A tropical twist on a classic margarita with chili and mango.",
    price: "₹490",
    image:
      "https://images.squarespace-cdn.com/content/v1/5ea5f3913b0ccf06d0ec2563/8c101f41-feb0-4bfd-9df9-7ad5d383abcb/TSO_Mango+Margarita_4x5+%284%29.jpg",
    tags: ["Signature"],
    type: "Beverage"
  },
  {
    id: 8,
    title: "Stuffed Bell Peppers",
    description: "Colorful peppers filled with herbed rice and cheese.",
    price: "₹880",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjomtdta4s3v3Zwac_ktHtBwFfJZzD_Fq5ONTVcegRQhorltCUvu8cxIno2mN6TRPwAYY&usqp=CAU",
    tags: ["Vegan"],
    type: "Main Course"
  },
  {
    id: 9,
    title: "Blueberry Cheesecake",
    description: "Rich and creamy cheesecake with a blueberry topping.",
    price: "₹650",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoDveWXNKWpxKzBGzMwOl_9tojV0vs5bypfA&s",
    tags: ["SF"],
    type: "Dessert"
  }
];

const Menu = () => {
  const [activeTab, setActiveTab] = useState("All Dishes");
  const [menuItems, setMenuItems] = useState([]);
  const [shuffledItems, setShuffledItems] = useState([]);
  const [tabs, setTabs] = useState(["All Dishes"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        window?.loadingStart?.();
        const response = await api.fetch("/menu");

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setMenuItems(data);

        const types = Array.from(new Set(data.map((item) => item.type))).sort();
        setTabs(["All Dishes", ...types]);
      } catch (err) {
        setMenuItems(fallbackData);
        const types = Array.from(
          new Set(fallbackData.map((item) => item.type))
        ).sort();
        setTabs(["All Dishes", ...types]);
        setError("Failed to fetch from server. Showing fallback items.");
      } finally {
        window?.loadingEnd?.();
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const filtered =
      activeTab === "All Dishes"
        ? menuItems
        : menuItems.filter((item) => item.type === activeTab);

    setShuffledItems(shuffleArray(filtered));
  }, [activeTab, menuItems]);

  return (
    <section className="py-3 py-md-3" style={{ minHeight: "80vh" }}>
      <div className="container">
        <div className="heading-wrapper text-center">
          <h2 className="background-text">Menu</h2>
          <h2 className="foreground-text">Menu</h2>
        </div>

        <p className="text-center mb-4 fw-semibold">
          Select your favorite dishes and enjoy!
        </p>

        <ul className="nav nav-pills justify-content-center mb-2 rounded-5 bg-white shadow-sm menu-tabs p-2 gap-2">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link px-4 py-2 rounded-pill ${
                  activeTab === tab
                    ? "active bg-orange text-white"
                    : "text-black"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>

        <div className="row g-2 g-md-3">
          {shuffledItems.length > 0 && (
            <AnimatePresence>
              {shuffledItems.map(
                ({ id, title, description, price, image, type }) => (
                  <motion.div
                    layout
                    key={id}
                    className="col-sm-12 col-md-6 col-lg-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="card menu-card h-100 shadow-sm rounded-4 border-0">
                      <div className="position-relative">
                        <img
                          src={image}
                          alt={title}
                          className="card-img-top rounded-top"
                          style={{ height: "220px", objectFit: "cover" }}
                          loading="lazy"
                        />
                        <div className="position-absolute top-2 start-2 d-flex flex-wrap gap-1 p-2 tags-container">
                          <span className="badge bg-success text-white tag-badge">
                            {type}
                          </span>
                        </div>
                        <div className="position-absolute bottom-2 end-2 bg-orange text-white px-2 py-1 rounded-3 price-tag">
                          {price}
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{title}</h5>
                        <p className="card-text text-muted">{description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default Menu;
