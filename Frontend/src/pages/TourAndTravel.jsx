import React from "react";
import { Helmet } from "react-helmet";

const touristPlaces = [
  {
    name: "Taj Mahal, Agra",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
    description: "One of the Seven Wonders of the World and an eternal symbol of love.",
  },
  {
    name: "Jaipur, Rajasthan",
    image: "/jaipur2.jpg",
    description: "The Pink City known for its palaces, forts, and vibrant culture.",
  },
  {
    name: "Kerala Backwaters",
    image: "/kerala.jpg",
    description: "Experience the serene beauty of Kerala’s houseboat rides.",
  },
  {
    name: "Leh-Ladakh",
    image: "/ladakh.jpg",
    description: "Breathtaking landscapes, monasteries, and adventure tourism.",
  },
];

function TourAndTravel() {
  return (
    <>
      <Helmet>
        <title>Tour & Travel Packages | Sahyog Force</title>
        <meta
          name="description"
          content="Explore India with Sahyog Force's tour & travel packages. Book destinations like Taj Mahal, Kerala backwaters, Leh-Ladakh, and more."
        />
      </Helmet>

      <section className="tour-travel-page">
        <h1>Tour & Travel Packages</h1>
        <p>Choose your destination and book your journey today.</p>

        <div className="tour-grid">
          {touristPlaces.map((place, index) => (
            <div key={index} className="tour-card">
              <img src={place.image} alt={place.name} />
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              <button className="book-btn">Book Now</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default TourAndTravel;
