import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
const Dashboard = () => {
  const { isAuthenticated, admin } = useContext(Context);
  const [appointment, setAppointment] = useState([]);
  useEffect(() => {
    const fatchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_KEY}/api/v1/appointment/getall`,
          { withCredentials: true }
        );
        // console.log(data.appointments);
        // console.log(user.firstName);
        setAppointment(data.appointments);
      } catch (error) {
        setAppointment({});
        // console.log("Appointment is not Registered", error);
      }
    };
    fatchAppointment();
  }, []);

  const [Doctors, setDoctors] = useState([]); // doctors data ko store karni ke lei

  useEffect(() => {
    const fatchData = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_KEY}/api/v1/user/doctors`,
          {
            withCredentials: true,
          }
        );
        // console.log(data.doctors);
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fatchData();
  }, []);

  const handleUpdateStatus = async (appointmentid, status) => {
    try {
      const { data } = await axios.put(
        `${
          import.meta.env.VITE_API_KEY
        }/api/v1/appointment/update/${appointmentid}`,
        { status },
        { withCredentials: true }
      );
      setAppointment((prevappointment) =>
        prevappointment.map((appointment) =>
          appointment._id === appointmentid
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/4d.png" alt="DocImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin && `${admin.firstName},${admin.lastName}`}</h5>
              </div>
              <p>
                The KMB INTERNATIONAL dashboard offers a smart, centralized view
                to manage all web development, media, hostel operations, and
                social media marketing.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Appointment</p>
            <h4>{appointment.length}</h4>
          </div>

          <div className="thirdBox">
            <p>Registers Servicer</p>
            <h4>{Doctors.length}</h4>
          </div>
        </div>
        <div className="appointments-wrapper">
          <h5 className="section-title">Appointments</h5>

          {/* Desktop Table */}
          <div className="appointment-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Doctor</th>
                  <th>Status</th>
                  <th>Visited</th>
                </tr>
              </thead>
              <tbody>
                {appointment && appointment.length > 0 ? (
                  appointment.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                      <td>{appointment.appointment_date.substring(0, 16)}</td>
                      <td>{appointment.department}</td>
                      <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                      <td>
                        <select
                          className={`status-select ${appointment.status.toLowerCase()}`}
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                      </td>
                      <td>
                        {appointment.hasVisited ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-appointment">
                      No Appointments
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Accordion */}
          <div className="appointment-mobile">
            {appointment && appointment.length > 0 ? (
              appointment.map((appointment) => (
                <div className="appointment-item" key={appointment._id}>
                  <div className="appointment-summary">
                    <span>{`${appointment.firstName} ${appointment.lastName}`}</span>
                    <button
                      className="toggle-btn"
                      onClick={() => toggleExpand(appointment._id)}
                    >
                      {expandedId === appointment._id ? "-" : "+"}
                    </button>
                  </div>

                  {expandedId === appointment._id && (
                    <div className="appointment-details">
                      <p>
                        <strong>Date:</strong>{" "}
                        {appointment.appointment_date.substring(0, 16)}
                      </p>
                      <p>
                        <strong>Service:</strong> {appointment.department}
                      </p>
                      <p>
                        <strong>Doctor:</strong>{" "}
                        {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                      </p>
                      <p>
                        <strong>Status:</strong>
                        <select
                          className={`status-select ${appointment.status.toLowerCase()}`}
                          value={appointment.status}
                          onChange={(e) =>
                            handleUpdateStatus(appointment._id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Accepted">Accepted</option>
                        </select>
                      </p>
                      <p>
                        <strong>Visited:</strong>
                        {appointment.hasVisited ? (
                          <GoCheckCircleFill className="green" />
                        ) : (
                          <AiFillCloseCircle className="red" />
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <h2 className="no-appointment">No Appointments</h2>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
