import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../images/store.jpg";

function WelcomePage() {
  const styles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    color: "#333",
    fontFamily: "Arial, sans-serif",
    padding: "50px",
    textAlign: "center",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  const headingStyles = {
    fontSize: "3rem",
    marginBottom: "2rem",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "2px 2px 4px #000000",
  };

  const adminButtonStyles = {
    color: "#fff",
    background: "transparent",
    borderRadius: "5px",
    padding: "10px",
    position: "absolute",
    top: "20px",
    right: "20px",
    border: "none",
    boxShadow: "2px 2px 4px #000000",
    transition: "background 0.3s ease-in-out",
    fontWeight: "bold",
    letterSpacing: "1px",
    textShadow: "1px 1px 2px #333",
    textTransform: "uppercase",
  };

  const adminButtonHoverStyles = {
    background: "rgba(255, 255, 255, 0.3)",
  };

  const registoruttonStyles = {
    color: "#fff",
    background: "transparent",
    borderRadius: "5px",
    padding: "10px",
    border: "none",
    boxShadow: "2px 2px 4px #000000",
    transition: "background 0.3s ease-in-out",
    fontWeight: "bold",
    letterSpacing: "1px",
    textShadow: "1px 1px 2px #333",
    textTransform: "uppercase",
  };

  const buttonContainerStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "2rem",
  };

  const paragraphStyles = {
    fontSize: "1.2rem",
    lineHeight: "1.5",
    marginTop: "-40px",
    color: "#fff",
    textShadow: "1px 1px 2px #000",
  };

  const keyframes = `
    @keyframes loop {
      0% {
        text-shadow: 1px 1px 2px #333;
      }
      50% {
        text-shadow: 2px 2px 4px #007bff;
      }
      100% {
        text-shadow: 1px 1px 2px #333;
      }
    }
  `;

  const lastdivstyles = {
    position: "absolute",
    bottom: "20px"
  }

  const paragraphStyles2 = {
    color: "#fff",
    fontSize: "1rem",
    lineHeight: "1.5",
    textShadow:
      "0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000, 0 0 2px #000",
  };

  return (
    <div style={styles}>
      <h1 className="text-center" style={headingStyles}>
        Welcome to Bumble Bee!
      </h1>
      <style>{keyframes}</style>
      <p style={paragraphStyles}>
        Bumble Bee is an online loan providing application that lets you buy
        first and pay later.
      </p>

      <div style={buttonContainerStyles}>
        <Link
          to="/login"
          style={adminButtonStyles}
          onMouseEnter={(e) =>
            (e.target.style.background = adminButtonHoverStyles.background)
          }
          onMouseLeave={(e) =>
            (e.target.style.background = adminButtonStyles.background)
          }
        >
          Admin Login
        </Link>
      </div>
      <div style={lastdivstyles}>
      <p style={paragraphStyles2}>
        Our goal is to provide a simple and convenient way for you to get the
        things you need now and pay for them later. With Bumble Bee, you can
        enjoy a more flexible way to shop online. You can Register From Here
      </p>
      <div style={{ textAlign: "center" }}>
        <Link
        style={registoruttonStyles}
          to="/register"
        >
          Register
        </Link>
      </div>
      </div>
    </div>
  );
}

export default WelcomePage;

