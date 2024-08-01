import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import { HOST_WITH_PORT } from "../consts";
import "./Requests.css";

const Request = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);
  const navigate = useNavigate();
  const handleShowAllRequests = () => navigate(`/show-requests`)
  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          `${HOST_WITH_PORT}/api/requests/${id}`,
        );
        setRequest(response.data);
      } catch (error) {
        setResponseMessage({ type: "error", text: "Error Fetching Request" });
        setTimeout(() => setResponseMessage(null), 3000);
        console.error("Error fetching request", error);
      }
    };

    fetchRequest();
  }, [id]);

  const updateRequestStatus = async (status) => {
    try {
      const response = await axios.put(`${HOST_WITH_PORT}/api/requests/${id}`, {
        status,
      });
      setRequest(response.data);
      setResponseMessage({
        type: "success",
        text: `Request ${status} Successfully!`,
      });
      setTimeout(() => setResponseMessage(null), 3000);
    } catch (error) {
      setResponseMessage({ type: "error", text: `Error Updating Request` });
      setTimeout(() => setResponseMessage(null), 3000);
      console.error("Error updating request", error);
    }
  };

  const handleApprove = () => {
    updateRequestStatus("Approved");
  };

  const handleDecline = () => {
    updateRequestStatus("Declined");
  };
  if (!request) {
    return <div>Loading...</div>;
  }

  return (
      <div className="main-container">
        <div className="single-request-container">
          <h1>Request Details</h1>
          <form className="single-request-form">
            <div>
              <label>ID:</label>
              <input type="text" value={request.id} readOnly/>
            </div>
            <div>
              <label>Name:</label>
              <input type="text" value={request.name} readOnly/>
            </div>
            <div>
              <label>Description:</label>
              <textarea value={request.description} readOnly/>
            </div>
            <div>
              <label>Request Type:</label>
              <input type="text" value={request.type} readOnly/>
            </div>
            <div>
              <label>Amount:</label>
              <input type="number" value={request.amount} readOnly/>
            </div>
            <div>
              <label>Currency:</label>
              <input type="text" value={request.currency} readOnly/>
            </div>
            <div>
              <label>Employee Name:</label>
              <input type="text" value={request.employee_name} readOnly/>
            </div>
            <div>
              <label>Status:</label>
              <input type="text" value={request.status} readOnly/>
            </div>
          </form>
          <div className="button-group">
            <button className="approve-button" onClick={handleApprove}>Approve</button>
            <button className="decline-button" onClick={handleDecline}>Decline</button>
          </div>
          {responseMessage && (
              <div className={`snackbar ${responseMessage.type}`}>
                {responseMessage.text}
              </div>
          )}
        </div>
        <div className="buttons-container">
          <button type="button" className="submit-button" onClick={handleShowAllRequests}>
            Show All Requests
          </button>
        </div>
      </div>
  );
};

export default Request;
