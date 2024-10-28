import React, { useState } from 'react'

const expeiment = () => {


    const hotels = [
        {
          "id": 1,
          "name": "Hotel A",
          "price": 100,
          "ratingStar": 4.5,
          "facilities": ["wifi", "pool", "spa"]
        },
        {
          "id": 2,
          "name": "Hotel B",
          "price": 80,
          "ratingStar": 4.0,
          "facilities": ["wifi", "parking"]
        },
        {
          "id": 3,
          "name": "Hotel C",
          "price": 150,
          "ratingStar": 5.0,
          "facilities": ["wifi", "gym", "spa"]
        }
      ];

      
    const [FilteredHotels, setFilteredHotels] = useState(null);

  // Function to filter hotels based on criteria
  const filterHotels = () => {
    const filtered = hotels.filter((hotel) => {
      const withinPriceRange = hotel.price >= priceRange.min && hotel.price <= priceRange.max;
      const meetsRating = hotel.ratingStar >= minRating;
      const hasFacilities = requiredFacilities.every(facility => hotel.facilities.includes(facility));

      return withinPriceRange && meetsRating && hasFacilities;
    });

    setFilteredHotels(filtered);

    console.log("Hotel: ", FilteredHotels);
  };

  return (
    <div>


    </div>
  )
}

export default expeiment