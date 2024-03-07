import React, { useState } from "react";
import axios from "axios";
import address from "../images/addressIcon.png";
import envelope from "../images/envelope.png";
import phone from "../images/phone-call.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      await axios.post("/api/form", formData);
      setIsSent(true);
      setFormData({ fullname: "", email: "", message: "" }); // Clear form
      setTimeout(() => setIsSent(false), 4000); // Reset success message
    } catch (error) {
      // setError("Sorry, message failed to send.");
      console.error(error);
    }
  };

  return (
    <section className="contact-main">
      {/* ... Your existing HTML structure */}
      <form onSubmit={handleSubmit}>
        {/* ... Form fields with onChange={handleInputChange} */}
        {error && <p className="error">{error}</p>}
        {isSent && <p className="success">Message sent successfully!</p>}
        <button type="submit" className="contact">
          Let's talk
        </button>
      </form>
    </section>
  );
};

export default Contact;
