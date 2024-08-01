import React from "react";
import { Link } from "react-router-dom";
import "./Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Requests Page</h1>
      <div className="button-container">
        <Link to="/create-request" className="welcome-button">
          Create a request
        </Link>
        <Link to="/show-requests" className="welcome-button">
          Show Requests
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
