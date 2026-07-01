import React, { useState } from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  // Navigate to Forgot Password
  const goToForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Navigate to Register
  const goToRegister = () => {
    navigate("/register");
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="form-container">
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form"
      >
        <h3 className="text-center">Login Form</h3>

        {/* Email Input */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email!" }]}
        >
          <Input type="email" required />
        </Form.Item>

        {/* Password Input with Eye Toggle */}
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input
            type={passwordVisible ? "text" : "password"}
            required
            suffix={
              passwordVisible ? (
                <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
              ) : (
                <EyeOutlined onClick={togglePasswordVisibility} />
              )
            }
          />
        </Form.Item>

        {/* Login Button */}
        <button className="btn btn-success login-button" type="submit">
          Login
        </button>

        {/* Forgot Password and Register Buttons */}
        <div className="d-flex flex-column align-items-center mt-3">
          <button
            className="btn btn-danger login-button"
            type="button"
            onClick={goToForgotPassword}
          >
            Forgot Password?
          </button>

          <button
            className="btn btn-primary login-button"
            type="button"
            onClick={goToRegister}
          >
            Register
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
