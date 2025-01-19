import React, { useState, useEffect } from "react";
import axios from "axios";

export default function FriendRequestsPage() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("https://outdoor-social.onrender.com/api/users/friend-requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFriendRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        alert("Failed to fetch friend requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await axios.post(
        "https://outdoor-social.onrender.com/api/users/friend-requests/accept",
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFriendRequests(friendRequests.filter((req) => req.from._id !== requestId));
      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Failed to accept friend request.");
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(
        "https://outdoor-social.onrender.com/api/users/friend-requests/reject",
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setFriendRequests(friendRequests.filter((req) => req.from._id !== requestId));
      alert("Friend request rejected.");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      alert("Failed to reject friend request.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.length === 0 && <p>No friend requests at the moment.</p>}
        {friendRequests.map((req) => (
          <li key={req.from._id}>
            {req.from.name} ({req.from.email})
            <button onClick={() => handleAccept(req.from._id)}>Accept</button>
            <button onClick={() => handleReject(req.from._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
