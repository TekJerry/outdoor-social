import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PreferenceCenterPage() {
  const [preferences, setPreferences] = useState({
    name: "",
    dob: "",
    location: "",
    favoriteLake: "",
    favoriteHuntingReservoir: "",
    favoriteHuntingLodge: "",
    favoriteCampsites: "",
    interests: [],
    skillLevels: {
      hunting: "",
      fishing: "",
      camping: "",
    },
    notifications: {
      specialEvents: false,
      discounts: false,
      updates: false,
    },
    dreamDestination: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get("https://outdoor-social.onrender.com/api/auth/preferences", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPreferences(response.data || {});
        setLoading(false);
      } catch (error) {
        console.error("Error fetching preferences:", error);
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "interests") {
        const updatedInterests = preferences.interests.includes(value)
          ? preferences.interests.filter((interest) => interest !== value)
          : [...preferences.interests, value];
        setPreferences((prev) => ({ ...prev, interests: updatedInterests }));
      } else {
        setPreferences((prev) => ({
          ...prev,
          notifications: { ...prev.notifications, [name]: checked },
        }));
      }
    } else {
      setPreferences((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        "https://outdoor-social.onrender.com/api/auth/preferences",
        preferences,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Preferences updated successfully!");
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Preference Center</h1>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={preferences.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Date of Birth:
        <input
          type="date"
          name="dob"
          value={preferences.dob}
          onChange={handleChange}
        />
      </label>
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={preferences.location}
          onChange={handleChange}
        />
      </label>
      <label>
        Favorite Lake:
        <input
          type="text"
          name="favoriteLake"
          value={preferences.favoriteLake}
          onChange={handleChange}
        />
      </label>
      <label>
        Favorite Hunting Reservoir:
        <input
          type="text"
          name="favoriteHuntingReservoir"
          value={preferences.favoriteHuntingReservoir}
          onChange={handleChange}
        />
      </label>
      <label>
        Favorite Hunting Lodge:
        <input
          type="text"
          name="favoriteHuntingLodge"
          value={preferences.favoriteHuntingLodge}
          onChange={handleChange}
        />
      </label>
      <label>
        Favorite Campsites:
        <input
          type="text"
          name="favoriteCampsites"
          value={preferences.favoriteCampsites}
          onChange={handleChange}
        />
      </label>
      <h3>Interests</h3>
      <label>
        <input
          type="checkbox"
          name="interests"
          value="Hunting"
          checked={preferences.interests.includes("Hunting")}
          onChange={handleChange}
        />
        Hunting
      </label>
      <label>
        <input
          type="checkbox"
          name="interests"
          value="Fishing"
          checked={preferences.interests.includes("Fishing")}
          onChange={handleChange}
        />
        Fishing
      </label>
      <label>
        <input
          type="checkbox"
          name="interests"
          value="Camping"
          checked={preferences.interests.includes("Camping")}
          onChange={handleChange}
        />
        Camping
      </label>
      <label>
        <input
          type="checkbox"
          name="interests"
          value="Hiking"
          checked={preferences.interests.includes("Hiking")}
          onChange={handleChange}
        />
        Hiking
      </label>
      <label>
        <input
          type="checkbox"
          name="interests"
          value="Kayaking"
          checked={preferences.interests.includes("Kayaking")}
          onChange={handleChange}
        />
        Kayaking
      </label>
      <h3>Skill Levels</h3>
      <label>
        Hunting:
        <select
          name="hunting"
          value={preferences.skillLevels.hunting}
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              skillLevels: { ...prev.skillLevels, hunting: e.target.value },
            }))
          }
        >
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>
      <label>
        Fishing:
        <select
          name="fishing"
          value={preferences.skillLevels.fishing}
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              skillLevels: { ...prev.skillLevels, fishing: e.target.value },
            }))
          }
        >
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>
      <label>
        Camping:
        <select
          name="camping"
          value={preferences.skillLevels.camping}
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              skillLevels: { ...prev.skillLevels, camping: e.target.value },
            }))
          }
        >
          <option value="">Select Skill Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>
      <h3>Notifications</h3>
      <label>
        Special Events:
        <input
          type="checkbox"
          name="specialEvents"
          checked={preferences.notifications.specialEvents}
          onChange={handleChange}
        />
      </label>
      <label>
        Discounts:
        <input
          type="checkbox"
          name="discounts"
          checked={preferences.notifications.discounts}
          onChange={handleChange}
        />
      </label>
      <label>
        Updates:
        <input
          type="checkbox"
          name="updates"
          checked={preferences.notifications.updates}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleSubmit}>Save Preferences</button>
    </div>
  );
}
