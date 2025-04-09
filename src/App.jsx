import React, { useContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./componanats/Dashboard";
import Login from "./componanats/Login";
import Message from "./componanats/Message";
import Doctors from "./componanats/Doctors";
import AddnewAdmin from "./componanats/AddnewAdmin";
import AddnewDoctor from "./componanats/AddnewDoctor";
import Sidebar from "./componanats/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  const contextValue = useContext(Context);
  // console.log(contextValue);
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } =
    useContext(Context);
  useEffect(() => {
    const fatchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/admin/me`,
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
        // console.log(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fatchData();
  }, []);

  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/admin/addnew" element={<AddnewAdmin />} />
        <Route path="/doctor/addnew" element={<AddnewDoctor />} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
