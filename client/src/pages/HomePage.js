import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import { Row } from "antd";
import DoctorList from "../components/DoctorList";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all doctors
  const getUserData = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch doctors. Please try again later.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h1 className="text-center">With You</h1>
      <p className="text-center" style={{ marginTop: '10px' }}>
        Click on the site name(With YOU) on left top about this site
        Click on the Doctor's Profile to Book an Appointment for the Doctor
      </p>
      {loading ? (
        <p className="text-center">Loading doctors...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <Row>
          {doctors.map((doctor) => (
            <DoctorList key={doctor._id} doctor={doctor} /> // Use _id for a unique key
          ))}
        </Row>
      )}
    </Layout>
  );
};

export default HomePage;
