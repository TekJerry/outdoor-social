import React from "react";
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
import { HamburgerIcon } from "@chakra-ui/icons";

const NavBar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email"); // Get user email from localStorage

  const handleEditProfile = () => {
    navigate("/preferences"); // Navigate to the Preference Center
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the auth token
    localStorage.removeItem("email"); // Clear the email
    navigate("/"); // Redirect to home
  };

  const goToProfile = () => {
    navigate("/profile"); // Navigate to Profile Page
  };

  return (
    <Box bg="#385802" px={4} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Box fontWeight="bold" fontSize="xl">
          <RouterLink to="/">Outdoor Social</RouterLink>
        </Box>

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
            <MenuList bg="white" color="#385802">
              {/* Email as Link to Profile */}
              <MenuItem onClick={goToProfile}>
                <Text fontSize="sm" fontWeight="bold">
                  {userEmail || "User Email"}
                </Text>
              </MenuItem>

              {/* Edit Profile */}
              <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>

              {/* Logout */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
