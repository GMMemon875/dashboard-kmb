import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../main";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_KEY}/api/v1/message/getall`,
          { withCredentials: true }
        );

        setMessages(data.Messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        alert("Failed to fetch messages");
      }
    };
    fetchMessages();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_KEY}/api/v1/message/delete/${id}`, // ✅ ID ko URL men pass kiya gaya hai
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Message deleted successfully");

        // ✅ Delete ke baad state ko update karo
        setMessages(messages.filter((message) => message._id !== id));
      } else {
        alert(data.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page messages">
      <h1>Messages</h1>
      <div className="banner">
        {messages && messages.length > 0 ? (
          messages.map((element) => {
            return (
              <div className="card" key={element._id}>
                <div className="details">
                  <p>
                    First Name: <span>{element.firstName}</span>
                  </p>
                  <p>
                    Last Name: <span>{element.lastName}</span>
                  </p>
                  <p>
                    Email: <span>{element.email}</span>
                  </p>
                  <p>
                    Phone Number: <span>{element.phone}</span>
                  </p>
                  <p>
                    Message: <span>{element.message}</span>
                  </p>
                  <div className="delete">
                    <button onClick={() => handleDelete(element._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No messages</h1>
        )}
      </div>
    </section>
  );
};

export default Message;
