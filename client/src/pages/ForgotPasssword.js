import React, { useState } from 'react';
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/forgot-password", values);
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Password reset successfully");
        navigate("/login");
      } else {
        message.error(res.data.message || "Reset failed. Please try again.");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="form-container">
      <Form layout="vertical" onFinish={onFinishHandler} className="register-form">
        <h3 className="text-center">Reset Password</h3>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input type="email" required />
        </Form.Item>

        <Form.Item
          label="Security Answer(Your favourite sport and sports personality)"
          name="answer"
          rules={[{ required: true, message: "Please enter your security answer" }]}
        >
          <Input type="text" required placeholder="Example: cricket-ms dhoni" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please enter your new password" }]}
        >
          <Input.Password
            type="password"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible
            }}
            required
          />
        </Form.Item>

        <Form.Item
          label="Retype New Password"
          name="retypePassword"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: "Please retype your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              }
            })
          ]}
        >
          <Input.Password
            type="password"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            visibilityToggle={{
              visible: retypePasswordVisible,
              onVisibleChange: setRetypePasswordVisible
            }}
            required
          />
        </Form.Item>
        <button type="button" class="btn btn-success login-button" onClick={()=>{navigate("/login")}}>Back to Login</button>
        <button className="btn btn-primary login-button">Reset Password</button>
      </Form>
    </div>
  );
};

export default ForgotPassword;
