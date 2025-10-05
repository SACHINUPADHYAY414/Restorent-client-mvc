import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Aarav Mehta",
    title: "Food Blogger",
    message:
      "Absolutely loved the flavors! Every dish was presented beautifully and tasted even better.",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Nikita Sharma",
    title: "Customer",
    message:
      "The desserts here are heavenly. Can’t wait to come back again with my friends!",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Rahul Verma",
    title: "Chef & Critic",
    message:
      "Perfect balance of spices and freshness. You can tell the ingredients are top-quality.",
    image: "https://randomuser.me/api/portraits/men/65.jpg"
  },
  {
    id: 4,
    name: "Simran Kapoor",
    title: "Food Enthusiast",
    message:
      "Hands down the best experience I've had in a restaurant in a long time!",
    image: "https://randomuser.me/api/portraits/women/50.jpg"
  },
  {
    id: 5,
    name: "Vikram Joshi",
    title: "Hotel Manager",
    message:
      "Exceptional service and taste. Will definitely recommend to my guests.",
    image: "https://randomuser.me/api/portraits/men/23.jpg"
  }
];

const Testimonial = () => {
  return (
    <section className="py-3 py-md-3 about-section" style={{ minHeight: "40vh" }}>
      <div className="container text-center">
        <div className="heading-wrapper text-center mb-3">
          <h2 className="background-text">What Our Guests Say</h2>
          <h2 className="foreground-text">What Our Guests Say</h2>
        </div>
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          loop={true}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          dir="rtl"
          breakpoints={{
            0: {
              slidesPerView: 1
            },
            768: {
              slidesPerView: 2
            },
            992: {
              slidesPerView: 3
            }
          }}
        >
          {testimonials.map(({ id, name, title, message, image }) => (
            <SwiperSlide key={id}>
              <div className="card h-100 shadow-sm border-0 p-4 rounded-4 mx-3">
                <img
                  src={image}
                  alt={name}
                  className="rounded-circle mx-auto mb-3"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <h5 className="fw-bold mb-1">{name}</h5>
                <p className="text-muted mb-2">{title}</p>
                <p className="fst-italic text-secondary">“{message}”</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
