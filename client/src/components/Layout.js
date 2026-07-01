import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import logo from '../assets/logo.png'; 

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    try {
      localStorage.clear();
      message.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      message.error("Error during logout. Please try again.");
    }
  };

  // Doctor menu
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  // Rendering menu list based on user role
  const getSidebarMenu = () => {
    if (user?.isAdmin) return adminMenu;
    if (user?.isDoctor) return doctorMenu;
    return userMenu;
  };

  const SidebarMenu = getSidebarMenu();

  return (
    <div className="main">
      <div className="layout">
        {/* Navbar */}
        <div className="navbar">
          <Link to="/" className="logo">
            <div className="logo-circle">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
          </Link>
          <Link to="/about" className="text-light">
            <h6 className="text-light"><strong>with you</strong></h6>
          </Link>
          <div className="menu">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={menu.name}
                  to={menu.path}
                  className={`menu-item ${isActive ? "active" : ""}`}
                  aria-label={menu.name}
                >
                  <i className={menu.icon}></i>
                  {menu.name}
                </Link>
              );
            })}
            {/* Logout Button */}
            <div className="menu-item" onClick={handleLogout} aria-label="Logout">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </div>
          </div>
          <div className="header-content">
            <div className="notification-container">
              <Badge
                count={user?.notifcation?.length || 0} // Handle undefined notifications
                onClick={() => navigate("/notification")}
              >
                <i className="fa-solid fa-bell bell-large"></i> 
              </Badge>
              <span className="user-name user-name-large">{user?.name}</span> {/* Use user-name-large class */}
            </div>
          </div>   
        </div>
        {/* Content Area */}
        <div className="content">
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
