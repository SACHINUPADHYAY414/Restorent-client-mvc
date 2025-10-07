import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

const getCurrentYear = () => new Date().getFullYear();

const restaurantEventData = [
  {
    id: 1,
    name: "Seasonal Harvest Menu",
    date: `${getCurrentYear()}-01-14`,
    description:
      "A curated menu featuring seasonal ingredients from local farms, showcasing the best of the harvest season."
  },
  {
    id: 2,
    name: "Wine Pairing Experience",
    date: `${getCurrentYear()}-03-06`,
    description:
      "Join us for an exquisite wine pairing evening with hand-picked wines matched perfectly with our gourmet meals."
  },
  {
    id: 3,
    name: "Chef’s Special Tasting Night",
    date: `${getCurrentYear()}-04-02`,
    description:
      "Experience an exclusive tasting menu created by our head chef, featuring some of the finest ingredients."
  },
  {
    id: 4,
    name: "Summer Grilling Event",
    date: `${getCurrentYear()}-06-20`,
    description:
      "Enjoy a summer night of grilling and BBQ, with a variety of meats, seafood, and vegetarian dishes."
  },
  {
    id: 5,
    name: "Holiday Feast",
    date: `${getCurrentYear()}-12-24`,
    description:
      "Celebrate the holiday season with a special festive feast, complete with holiday classics and seasonal treats."
  },
  {
    id: 6,
    name: "Valentine's Day Special Dinner",
    date: `${getCurrentYear()}-02-14`,
    description:
      "Celebrate romance with a luxurious 4-course meal for two, complete with champagne and dessert."
  },
  {
    id: 7,
    name: "Autumn Harvest Festival",
    date: `${getCurrentYear()}-10-15`,
    description:
      "A celebration of fall’s bounty with special autumn-themed dishes, cocktails, and music."
  },
  {
    id: 8,
    name: "New Year’s Eve Party",
    date: `${getCurrentYear()}-12-31`,
    description:
      "Ring in the new year with a celebration of great food, live entertainment, and a midnight toast."
  },
  {
    id: 9,
    name: "Vegetarian Gourmet Night",
    date: `${getCurrentYear()}-07-15`,
    description:
      "A special night dedicated to plant-based cuisine with gourmet vegetarian dishes that will surprise and delight you."
  },
  {
    id: 10,
    name: "Oktoberfest Beer Pairing",
    date: `${getCurrentYear()}-10-10`,
    description:
      "Celebrate Oktoberfest with an evening of hearty dishes paired with the finest craft beers."
  }
];

const getUpcomingRestaurantEvents = () => {
  const today = new Date();
  return restaurantEventData
    .map((event) => ({
      ...event,
      date: new Date(event.date)
    }))
    .filter((event) => event.date > today)
    .sort((a, b) => a.date - b.date)
    .slice(0, 3);
};

const truncateDescription = (description, limit) => {
  if (description.length > limit) {
    return description.slice(0, limit) + "... More";
  }
  return description;
};

const Event = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getLimit = () => {
    if (windowWidth < 576) return 60;
    if (windowWidth < 768) return 60;
    if (windowWidth < 992) return 76;
    return 78;
  };

  const truncateLimit = getLimit();
  const upcomingEvents = getUpcomingRestaurantEvents();

  return (
    <Container fluid className="py-2 py-md-3 px-2 px-md-5" style={{minHeight:"50.3vh"}}>
      <div className="heading-wrapper text-center mb-2">
        <h2 className="background-text">Event</h2>
        <h2 className="foreground-text">Event</h2>
      </div>
      <Row className="g-2 justify-content-center">
        <AnimatePresence>
          {upcomingEvents.map((event) => (
            <Col xs={12} sm={6} md={4} lg={3} key={event.id} className="d-flex">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-100"
              >
                <Card
                  className="h-100 shadow-lg"
                  style={{ borderRadius: "15px" }}
                >
                  <Card.Body>
                    <Card.Title>{event.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {event.date.toDateString()}
                    </Card.Subtitle>
                    <p>
                      {truncateDescription(event.description, truncateLimit)}
                    </p>
                    <NavLink
                      to={`/event/${event.id}`}
                      className="text-decoration-none"
                    >
                      Explore Menu &rarr;
                    </NavLink>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </AnimatePresence>
      </Row>
    </Container>
  );
};

export default Event;
