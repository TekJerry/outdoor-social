import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage"; // Import your page components
import AboutPage from "./pages/AboutPage/AboutPage";
import NavBar from "./components/Navbar/Navbar";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PreferenceCenterPage from "./pages/PreferenceCenterPage/PreferenceCenterPage";
import FeedPage from "./pages/FeedPage/FeedPage";
import SearchForFriendsPage from "./pages/SearchForFriendsPage/SearchForFriendsPage";
import FriendRequestsPage from "./pages/FriendRequestsPage/FriendRequestsPage";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import { Box, Button, Text, Input } from "@chakra-ui/react";

const App = () => {
  const location = useLocation();

  // Check if the current path is the home page
  const hideNavBar = location.pathname === "/";

  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("https://outdoor-social.onrender.com/api")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      {/* Conditionally render the NavBar */}
      {!hideNavBar && <NavBar />}
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/preferences" element={<PreferenceCenterPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/search-for-friends" element={<SearchForFriendsPage />} />
          <Route path="/friend-requests" element={<FriendRequestsPage />} />
          <Route path="/user-profile/:userId" element={<UserProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
