import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { Table, Input, Row, Col } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [usernameSearch, setUsernameSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  // Fetch all users
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
        setFilteredData(res.data.data); // Set initial filtered data to all users
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  // Handle search by username
  const handleUsernameSearch = (e) => {
    const value = e.target.value;
    setUsernameSearch(value);
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle search by email
  const handleEmailSearch = (e) => {
    const value = e.target.value;
    setEmailSearch(value);
    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Define table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Alphabetical sorting
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      sorter: (a, b) => a.isDoctor - b.isDoctor,
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isDoctor === value,
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      sorter: (a, b) => a.isAdmin - b.isAdmin,
      filters: [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ],
      onFilter: (value, record) => record.isAdmin === value,
      render: (text, record) => <span>{record.isAdmin ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button className="btn btn-danger">Block</button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center m-2">Users List</h1>

      {/* Search Bars */}
      <Row gutter={16} className="mb-3">
        <Col xs={24} md={12}>
          <Input
            placeholder="Search by Username"
            value={usernameSearch}
            onChange={handleUsernameSearch}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} md={12}>
          <Input
            placeholder="Search by Email"
            value={emailSearch}
            onChange={handleEmailSearch}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* Table with filtered data */}
      <Table columns={columns} dataSource={filteredData} rowKey="_id" />
    </Layout>
  );
};

export default Users;
