import React from "react";


const AssignedDriver = () => {
  // Static driver data
  const driver = {
    driver_name: "Shivam",
    driver_contact: "9858667779",
    driver_location: "Gurugram",
    photo:
      "http://localhost:8000/storage/uploads/driver/g3ZEss6mN9fLzvZL9HqZkCf156w4BAUe52kiZClX.png",
    age: 24,
    location: "Sector 18, Gurgaon, Gurugram, Haryana, 122016, India",
    driving_experience: 12,
    car_driving_experience: "automatic",
    driving_licence_front:
      "http://localhost:8000/storage/uploads/driver/vKTJ8Cx5g2XbZ1TO6PEn3oNG5njrd3bogU8Il8fb.png",
    type_of_driving_licence: "MCWG",
    aadhar_card_front:
      "http://localhost:8000/storage/uploads/driver/OSCNGARUrqjmub5hRotQkyJ36LXeGP8jWipvDcHz.png",
    aadhar_card_back:
      "http://localhost:8000/storage/uploads/driver/H64yDeNKWwByJANMYd3XDToWWmtZioGm3EXGkXI9.png",
  };

  return (
    <div className="assigned-driver-container">
      <h2 className="section-title">Assigned Driver Details</h2>
      <div className="driver-profile">
        <img src={driver.photo} alt="Driver" className="driver-photo" />
        <div className="highlighted-details">
          <h3>{driver.driver_name}</h3>
          <p><strong>Contact:</strong> {driver.driver_contact}</p>
          <p><strong>Location:</strong> {driver.driver_location}</p>
        </div>
      </div>

      <div className="driver-info-grid">
        <div><strong>Age:</strong> {driver.age}</div>
        <div><strong>Full Address:</strong> {driver.location}</div>
        <div><strong>Driving Experience:</strong> {driver.driving_experience} years</div>
        <div><strong>Car Driving Type:</strong> {driver.car_driving_experience}</div>
        <div><strong>License Type:</strong> {driver.type_of_driving_licence}</div>
        <div>
          <strong>DL Front:</strong><br />
          <img src={driver.driving_licence_front} alt="DL Front" className="doc-img" />
        </div>
        <div>
          <strong>Aadhar Front:</strong><br />
          <img src={driver.aadhar_card_front} alt="Aadhar Front" className="doc-img" />
        </div>
        <div>
          <strong>Aadhar Back:</strong><br />
          <img src={driver.aadhar_card_back} alt="Aadhar Back" className="doc-img" />
        </div>
      </div>
    </div>
  );
};

export default AssignedDriver;
