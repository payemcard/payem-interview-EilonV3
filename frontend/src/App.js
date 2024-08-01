import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./Components/Welcome";
import CreateRequestForm from "./Components/CreateRequestForm";
import ShowRequests from "./Components/ShowRequests";
import Request from "./Components/Request";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/create-request" element={<CreateRequestForm />} />
          <Route path="/show-requests" element={<ShowRequests />} />
          <Route path="/requests/:id" element={<Request />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
