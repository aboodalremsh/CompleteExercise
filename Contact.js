import React ,{useState} from "react";
import Akkar from "../assets/Akkar.jpg";
import "../styles/Contact.css";

function Contact() {
  const [state, setState] = useState({ fname: "" ,email: "", message: "" });

  const handleChange = e =>{
    const name = e.target.name;
    const value = e.target.value;
    

    setState({ ...state, [name] : value });

  };
  const handleSubmit = e => {
    alert (JSON.stringify(state));
  };

  return (
    <div className="contact">
      <div
        className="leftSide"
        style={{ backgroundImage: `url(${Akkar})` }}
      ></div>
      <div className="rightSide">
        <h1> Contact Us</h1>

        <form id="contact-form" >
          <label htmlFor="name">Full Name</label>
          <input name="fname" placeholder="Enter full name..." type="text" onChange={handleChange}/>
          <label htmlFor="email">Email</label>
          <input name="email" placeholder="Enter email..." type="email" onChange={handleChange} />
          <label htmlFor="message">Message</label>
          <textarea
            rows="6"
            placeholder="Enter message..."
            name="message"
            required onChange={handleChange}
          ></textarea>
          <button type="submit" onClick = {handleSubmit}> Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
