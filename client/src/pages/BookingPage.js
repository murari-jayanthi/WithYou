import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/BookingPage.css";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState({});
  const [date, setDate] = useState(null); // Initialize as null
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();

  // Fetch doctor data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Check availability
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const formattedTime = time ? time.format("HH:mm") : null; // Format time correctly
      const formattedDate = date ? date.format("YYYY-MM-DD") : null; // Format date correctly
      const res = await axios.post(
        "/api/v1/user/booking-availbility",
        { doctorId: params.doctorId, date: formattedDate, time: formattedTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // Handle booking
  const handleBooking = async () => {
    try {
      if (!date || !time) {
        return message.error("Date & Time are required to proceed with the booking.");
      }
      dispatch(showLoading());

      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          userEmail: user.email, // Pass user email here
          date: date.format("DD-MM-YYYY"), // Format date correctly
          time: time.format("HH:mm"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  // Disable dates before today
  const disablePastDates = (current) => {
    return current && current < moment().startOf("day");
  };

  // Get disabled hours based on doctor's timings
  const disabledHours = () => {
    if (doctors && doctors.timings) {
      const [start, end] = doctors.timings.map((time) => moment(time, "HH:mm"));
      const startHour = start.hour();
      const endHour = end.hour();

      const hours = [];
      for (let i = 0; i < 24; i++) {
        if (i < startHour || i > endHour) {
          hours.push(i);
        }
      }
      return hours;
    }
    return [];
  };

  // Get disabled minutes based on selected hour and doctor's timings
  const disabledMinutes = (selectedHour) => {
    if (doctors && doctors.timings) {
      const [start, end] = doctors.timings.map((time) => moment(time, "HH:mm"));
      const startHour = start.hour();
      const endHour = end.hour();

      if (selectedHour === startHour) {
        return Array.from({ length: start.minute() }, (_, i) => i);
      } else if (selectedHour === endHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute > end.minute()
        );
      }
    }
    return [];
  };

  useEffect(() => {
    getUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <div className="booking-container">
        <div className="booking-form">
          <h3 className="booking-header">Booking Page</h3>
          {doctors && (
            <div>
              <div className="doctor-details">
                <h4>
                  Dr. {doctors.firstName} {doctors.lastName}
                </h4>
                <h4>Fees: {doctors.feesPerCunsaltation}</h4>
                <h4>
                  Timings: {doctors.timings && doctors.timings[0]} -{" "}
                  {doctors.timings && doctors.timings[1]}
                </h4>
              </div>
              <div className="date-time-pickers">
                <DatePicker
                  aria-required={"true"}
                  className="ant-picker"
                  format="DD-MM-YYYY"
                  disabledDate={disablePastDates}
                  onChange={(value) => {
                    setDate(value); // Set the moment object directly
                    setTime(null); // Reset time when date changes
                  }}
                />
                <TimePicker
                  aria-required={"true"}
                  format="HH:mm"
                  className="ant-picker"
                  disabledHours={disabledHours}
                  disabledMinutes={(hour) => disabledMinutes(hour)}
                  onChange={(value) => setTime(value)} // Keep moment object
                />
              </div>

              <button
                className="booking-button check-availability"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button className="btn btn-success booking-button" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
