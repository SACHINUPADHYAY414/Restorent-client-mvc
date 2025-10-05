import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../components/action/Api";

const galleryData = [
  {
    id: 1,
    title: "Grilled Salmon",
    description: "Perfectly grilled salmon with lemon and herbs.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    type: "Food"
  },
  {
    id: 2,
    title: "Classic Margarita",
    description: "Refreshing margarita with lime and salt rim.",
    image:
      "https://mixthatdrink.com/wp-content/uploads/2023/03/classic-margarita-cocktail-540x720.jpg",
    type: "Drinks"
  },
  {
    id: 3,
    title: "Dining Area",
    description: "Elegant interior with cozy lighting and decor.",
    image:
      "https://www.restauranttimes.com/wp-content/uploads/2025/05/Step-5_-Plan-Dining-Room-Seating.webp",
    type: "Interior"
  },
  {
    id: 4,
    title: "Chef at Work",
    description: "Our expert chef crafting a gourmet experience.",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
    type: "Staff"
  },
  {
    id: 5,
    title: "Tiramisu Dessert",
    description: "Classic Italian dessert with mascarpone and espresso.",
    image:
      "https://cdn11.bigcommerce.com/s-p01b4rg6i8/images/stencil/1280x1280/products/190/487/Mini_Tiramisu__38427.1535587828.jpg?c=2",
    type: "Food"
  },
  {
    id: 6,
    title: "Cocktail Mix",
    description: "Signature cocktail with tropical fruit and mint.",
    image:
      "https://iowacapitaldispatch.com/wp-content/uploads/2021/12/GettyImages-1320844709-scaled-e1677723826725.jpg",
    type: "Drinks"
  },
  {
    id: 7,
    title: "Restaurant Lounge",
    description: "Relaxed and stylish lounge for casual dining.",
    image:
      "https://www.venuelook.com/_next/image?url=https%3A%2F%2Fcdn.venuelook.com%2Fuploads%2Fspace_39006%2F1716019211_595x400.png&w=640&q=75",
    type: "Interior"
  },
  {
    id: 8,
    title: "Serving Staff",
    description: "Friendly and attentive staff serving with care.",
    image:
      "https://kamereo.vn/blog/wp-content/uploads/2025/01/restaurant-service-14.jpg",
    type: "Staff"
  }
];

function shuffleArray(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [galleryItems, setGalleryItems] = useState([]);
  const [shuffledItems, setShuffledItems] = useState([]);
  const [tabs, setTabs] = useState(["All"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        window?.loadingStart?.();
        const response = await api.fetch("/gallery");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setGalleryItems(data);
        const types = Array.from(new Set(data.map((item) => item.type))).sort();
        setTabs(["All", ...types]);
      } catch (err) {
        setError(err?.message);
        setGalleryItems(galleryData);
        const types = Array.from(
          new Set(galleryData.map((item) => item.type))
        ).sort();
        setTabs(["All", ...types]);
      } finally {
        window?.loadingEnd?.();
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    const filtered =
      activeTab === "All"
        ? galleryItems
        : galleryItems.filter((item) => item.type === activeTab);
    setShuffledItems(shuffleArray(filtered));
  }, [activeTab, galleryItems]);

  return (
    <section className="about-section py-3 py-md-3">
      <div className="container">
        <div className="heading-wrapper text-center">
          <h2 className="background-text">Gallery</h2>
          <h2 className="foreground-text">Gallery</h2>
          <p className="text-muted mb-2">
            Explore our restaurant through images
          </p>
        </div>

        <div className="d-flex justify-content-center overflow-auto mb-3 px-2">
          <ul
            className="nav nav-pills flex-nowrap gap-1"
            style={{ minWidth: "max-content" }}
          >
            {tabs.map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  className={`nav-link px-2 px-md-3 py-1 py-md-2 rounded-pill ${
                    activeTab === tab ? "active bg-dark text-white" : "bg-light"
                  }`}
                  onClick={() => setActiveTab(tab)}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="row g-2">
          <AnimatePresence>
            {shuffledItems.map(({ id, title, description, image, type }) => (
              <motion.div
                layout
                key={id}
                className="col-12 col-sm-6 col-md-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden gallery-card">
                  <img
                    src={image}
                    alt={title}
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-semibold">{title}</h5>
                    <p className="card-text text-muted small mb-2">
                      {description}
                    </p>
                    <div className="mt-auto">
                      <span className="badge bg-secondary">{type}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
