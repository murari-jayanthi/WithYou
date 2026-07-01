import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import moment from "moment";
import { message, Table } from "antd";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch Appointments
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Update Status Handler
  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        // Refresh appointments after updating status
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  // Table Columns with sorting for Date & Time
  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
    },
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
      sorter: (a, b) => {
        const dateA = moment(`${a.date} ${a.time}`, "YYYY-MM-DD HH:mm");
        const dateB = moment(`${b.date} ${b.time}`, "YYYY-MM-DD HH:mm");
        return dateA - dateB; // Sort by date
      },
    },
    {
      title: "User Email",
      dataIndex: "userEmail", // New column for displaying user email
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {/* Show buttons conditionally based on the status */}
          {record.status === "pending" && (
            <>
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleStatus(record, "rejected")}
                style={{ marginLeft: '8px' }} // Optional: spacing between buttons
              >
                Reject
              </button>
            </>
          )}
          {record.status === "approved" && (
            <button
              className="btn btn-danger"
              onClick={() => handleStatus(record, "rejected")}
            >
              Reject
            </button>
          )}
          {record.status === "rejected" && (
            <button
              className="btn btn-success"
              onClick={() => handleStatus(record, "approved")}
            >
              Approve
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default DoctorAppointments;
