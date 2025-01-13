import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email"); // Replace with actual logged-in user's email

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleEditProfile = () => {
    navigate("/preferences"); // Navigate to the Preference Center
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear local storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Error logging out. Please try again.");
    }
  };
  

  return (
    <Box bg="#385802" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Box fontWeight="bold" fontSize="xl">
          <RouterLink to="/">Outdoor Social</RouterLink>
        </Box>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Navigation"
          display={{ md: "none" }}
          onClick={toggleMenu}
        />

        {/* Desktop Menu */}
        <HStack spacing={8} alignItems="center" display={{ base: "none", md: "flex" }}>
          <RouterLink to="/feed">Feed</RouterLink>
          <RouterLink to="/search-for-friends">Find Friends</RouterLink>
          <RouterLink to="/friend-requests">Friend Requests</RouterLink>
        </HStack>

        {/* User Account Menu */}
        <Flex alignItems="center">
          <Menu>
            <MenuButton
              as={Button}
              rounded="full"
              variant="link"
              cursor="pointer"
              minW={0}
            >
              <Avatar size="sm" />
            </MenuButton>
            <MenuList color="#385802">
              <MenuItem>
                <Text fontSize="sm" fontWeight="bold" >
                  {userEmail || "User Email"}
                </Text>
              </MenuItem>
              <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <HStack as="nav" spacing={4}>
            <RouterLink to="/feed">Feed</RouterLink>
            <RouterLink to="/search-for-friends">Find Friends</RouterLink>
            <RouterLink to="/friend-requests">Friend Requests</RouterLink>
          </HStack>
        </Box>
      ) : null}
    </Box>
  );
};

export default NavBar;
