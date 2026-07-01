import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);


  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/getUserData",
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        localStorage.clear();
      }
    } catch (error) {
      localStorage.clear();
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token") && !user) {
      getUser();
    } else {
      setLoading(false);
    }

  }, [user, getUser]);


  if (loading) return <div>Loading...</div>;


  if (localStorage.getItem("token") && user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}
