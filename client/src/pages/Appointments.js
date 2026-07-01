import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./../components/Layout";
import moment from "moment";
import { Table } from "antd";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from the backend
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
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

  // Define table columns
  const columns = [
    {
      title: "Appointment ID",
      dataIndex: "_id",
    },
    {
      title: "Doctor Name",
      render: (record) =>
        `${record?.doctorInfo?.firstName || "N/A"} ${record?.doctorInfo?.lastName || ""}`,
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time, "HH:mm").format("HH:mm")} {/* Ensure time is formatted correctly */}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];
  

  return (
    <Layout>
      <h1>Appointments List</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default Appointments;
