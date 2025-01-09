import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api")
      .then((response) => response.text())
      .then((data) => setMessage(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <NavBar /> {/* Use the NavBar component */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>} />
          <Route path="/preferences" element={<PreferenceCenterPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/search-for-friends" element={<SearchForFriendsPage />} />
          <Route path="/friend-requests" element={<FriendRequestsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
