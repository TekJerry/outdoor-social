import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Input,
  Checkbox,
  Select,
  Button,
  HStack,
  Divider,
  Text,
} from "@chakra-ui/react";
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
        const response = await axios.get(
          "https://outdoor-social.onrender.com/api/auth/preferences",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
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
      await axios.put(
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

  if (loading) return <Box textAlign="center">Loading...</Box>;

  return (
    <Box maxW="800px" mx="auto" p={5}>
      <Heading textAlign="center" mb={6}>
        Preference Center
      </Heading>
      <VStack spacing={4} align="stretch" bg="gray.100" p={5} borderRadius="md" shadow="md">
        <Text fontWeight="bold" fontSize="lg">
          Personal Details
        </Text>
        <Divider />
        <Input
          placeholder="Name"
          name="name"
          value={preferences.name}
          onChange={handleChange}
        />
        <Input
          type="date"
          placeholder="Date of Birth"
          name="dob"
          value={preferences.dob}
          onChange={handleChange}
        />
        <Input
          placeholder="Location"
          name="location"
          value={preferences.location}
          onChange={handleChange}
        />
        <Input
          placeholder="Favorite Lake"
          name="favoriteLake"
          value={preferences.favoriteLake}
          onChange={handleChange}
        />
        <Input
          placeholder="Favorite Hunting Reservoir"
          name="favoriteHuntingReservoir"
          value={preferences.favoriteHuntingReservoir}
          onChange={handleChange}
        />
        <Input
          placeholder="Favorite Hunting Lodge"
          name="favoriteHuntingLodge"
          value={preferences.favoriteHuntingLodge}
          onChange={handleChange}
        />
        <Input
          placeholder="Favorite Campsites"
          name="favoriteCampsites"
          value={preferences.favoriteCampsites}
          onChange={handleChange}
        />
        <Text fontWeight="bold" fontSize="lg" mt={4}>
          Interests
        </Text>
        <Divider />
        <HStack wrap="wrap" spacing={4}>
          {["Hunting", "Fishing", "Camping", "Hiking", "Kayaking"].map((interest) => (
            <Checkbox
              key={interest}
              name="interests"
              value={interest}
              isChecked={preferences.interests.includes(interest)}
              onChange={handleChange}
            >
              {interest}
            </Checkbox>
          ))}
        </HStack>
        <Text fontWeight="bold" fontSize="lg" mt={4}>
          Skill Levels
        </Text>
        <Divider />
        {["hunting", "fishing", "camping"].map((skill) => (
          <Select
            key={skill}
            placeholder={`Select ${skill} skill level`}
            name={skill}
            value={preferences.skillLevels[skill]}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                skillLevels: { ...prev.skillLevels, [skill]: e.target.value },
              }))
            }
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Select>
        ))}
        <Text fontWeight="bold" fontSize="lg" mt={4}>
          Notifications
        </Text>
        <Divider />
        {["specialEvents", "discounts", "updates"].map((notification) => (
          <Checkbox
            key={notification}
            name={notification}
            isChecked={preferences.notifications[notification]}
            onChange={handleChange}
          >
            {notification.replace(/([A-Z])/g, " $1")}
          </Checkbox>
        ))}
        <Button colorScheme="green" onClick={handleSubmit} width="full" mt={4}>
          Save Preferences
        </Button>
      </VStack>
    </Box>
  );
}
