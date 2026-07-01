import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/register", values);
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Registered Successfully!");
        navigate("/login");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  // Navigate to login page
  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <div className="form-container ">
        <Form
          layout="vertical"
          onFinish={onfinishHandler}
          className="register-form"
        >
          <h3 className="text-center">Register Form</h3>

          {/* Name Input */}
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input type="text" placeholder="User" />
          </Form.Item>

          {/* Email Input */}
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input type="email" placeholder="User@user.com" />
          </Form.Item>

          {/* Question Input */}
          <Form.Item
            label="Your favourite sport and sports personality"
            name="answer"
            rules={[
              { required: true, message: "Please enter your security question!" },
            ]}
          >
            <Input type="text" placeholder="Example: cricket-ms dhoni" />
          </Form.Item>

          {/* Password Input */}
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 8, message: "Password must be at least 8 characters long!" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* Retype Password Input */}
          <Form.Item
            label="Retype Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please retype your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <button className="btn btn-primary login-button" type="submit">
            Register
          </button>
          <br />
          <button
            className="btn btn-secondary login-button"
            type="button"
            onClick={goToLogin}
          >
            Back to Login
          </button>
        </Form>
      </div>
    </>
  );
};

export default Register;
