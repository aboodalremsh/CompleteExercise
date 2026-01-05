import React from 'react'
import { Link } from "react-router-dom";
import BannerImage from "../assets/Nabatiye.jpg";
import "../styles/Home.css";


function Home() {
  return (
    
    <div className="home" style={{ backgroundImage: `url(${BannerImage})` }}>
      <div className="headerContainer">
        <h1> LIU Campuses </h1>
        <p> 9  Campuses</p>
        <Link to="/menu">
          <button> Explore them NOW </button>
        </Link>
      </div>
    </div>

  )
}

export default Home
