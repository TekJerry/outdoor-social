import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndFriends = async () => {
      try {
        // Fetch profile
        const profileResponse = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(profileResponse.data); // Set user data

        // Fetch friends
        const friendsResponse = await axios.get(
          "http://localhost:5000/api/users/friends",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFriends(friendsResponse.data); // Update the friends list
      } catch (error) {
        console.error("Error fetching profile or friends:", error.response?.data?.message || error.message);
        alert("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after both calls
      }
    };

    fetchProfileAndFriends();
  }, []);

  if (loading) return <p>Loading...</p>;
  return (<div>
    <div>
      <h1>Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Location: {user.location || "Not provided"}</p>
    </div>
    <section>
    <h3>Friends</h3>
    {friends.length === 0 ? (
      <p>You have no friends yet.</p>
    ) : (
      <ul>
        {friends.map((friend) => (
          <li key={friend._id}>
            {friend.name} ({friend.email})
          </li>
        ))}
      </ul>
    )}
  </section>
  </div>
  );
}
