import { Box, IconButton, useTheme, Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from 'react';
import useToken from '../login/useToken';

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const { token, setToken } = useToken();
  const [anchorEl, setAnchorEl] = useState(null);



  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setToken(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('is_super');
    handleMenuClose();
    window.location.reload();
};



    return (
        <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
        >
            {/* <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
            </IconButton> */}
        </Box>

        {/* ICONS */}
        <Box display="flex">
            <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
                <DarkModeOutlinedIcon />
            ) : (
                <LightModeOutlinedIcon />
            )}
            </IconButton>
            {/* <IconButton>
            <NotificationsOutlinedIcon />
            </IconButton> */}
            {/* <IconButton>
            <SettingsOutlinedIcon />
            </IconButton> */}
            <IconButton onClick={handleMenuOpen}>
            <PersonOutlinedIcon />
            </IconButton>
            <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
        </Box>
        </Box>
    );
};

export default Topbar;