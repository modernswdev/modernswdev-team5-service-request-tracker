import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateRequest from "./pages/CreateRequest.jsx";
import RequestDetails from "./pages/RequestDetails.jsx";
import colors from "./colors";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.bgLight }}>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/create" element={<CreateRequest />} />
        <Route path="/request/:id" element={<RequestDetails />} />
      </Routes>
    </div>
  );
}
