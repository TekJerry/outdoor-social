import React from 'react'
import { Link } from 'react-router-dom';
import '../Navbar/Navbar.css'

export default function Navbar() {
  return (
    <header>
      <nav className="navbar">
        <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/search-for-friends">Search for Friends</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </ul>
      </nav>
    </header>
  )
}
