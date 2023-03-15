import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptIcon from '@mui/icons-material/Receipt';import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import FinanceImage from "../../assets/Finance.jpg";
import CategoryIcon from '@mui/icons-material/Category';
import FlagIcon from '@mui/icons-material/Flag';
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";


const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const [selected, setSelected] = useState(location.pathname);
    const role = localStorage.getItem('is_super') === '1' ? 'superadmin' : 'admin';

    const isSuperAdmin = localStorage.getItem('is_super') === '1';
  
    return (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
          },
          "& .pro-inner-item:hover": {
            color: "#868dfb !important",
          },
          "& .pro-menu-item.active": {
            color: "#6870fa !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
              style={{
                margin: "10px 0 20px 0",
                color: colors.grey[100],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography variant="h3" color={colors.grey[100]}>
                    Financial App
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
  
            {/* USER INFO */}
            {!isCollapsed && (
              <Box mb="25px">
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="User avatar"
                    src={FinanceImage}
                    width="75"
                    height="75"
                    style={{ borderRadius: "50%", marginRight: "10px" }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      color={colors.grey[100]}
                      style={{ fontWeight: "bold" }}
                    >
                      {localStorage.getItem('username')}
                    </Typography>
                    <Typography variant="subtitle2" color={colors.grey[500]}>
                      {isSuperAdmin ? "Super Admin" : "Admin"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
  
             {/* MENU ITEMS */}
             <Item
                    title="Dashboard"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                {role === 'superadmin' && (
            <Item
                title="Admins"
                to="/admins"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
            />
          )}
                <Item
                    title="Incomes"
                    to="/income"
                    icon={<ReceiptIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Expenses"
                    to="/expense"
                    icon={<PointOfSaleIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Categories"
                    to="/categories"
                    icon={<CategoryIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Goal"
                    to="/goal"
                    icon={<FlagIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Calendar"
                    to="/calendar"
                    icon={<CalendarTodayOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Bar Chart"
                    to="/bar"
                    icon={<BarChartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Pie Chart"
                    to="/pie"
                    icon={<PieChartOutlineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Line Chart"
                    to="/line"
                    icon={<TimelineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
            </Menu>
        </ProSidebar>
    </Box>
);
};

export default Sidebar;