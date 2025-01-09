import React, { useState } from "react";
import axios from "axios";

export default function SearchForFriendsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // Don't search for empty queries

    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSearchResults(response.data); // Update search results
    } catch (error) {
      console.error("Error searching for users:", error);
      alert("Failed to search for users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/friend-request`,
        { to: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request.");
    }
  };

  return (
    <div>
      <h2>Search for Friends</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      <ul>
        {searchResults.map((user) => (
          <li key={user._id}>
            {user.name} ({user.email})
            <button onClick={() => handleSendFriendRequest(user._id)}>Add Friend</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
