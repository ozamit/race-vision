import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,useNavigate } from 'react-router-dom';
import './App.css';
import Play from './pages/play/Play';
import Home from './pages/home/Home';
import RaceResult from './pages/raceResult/RaceResult';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import { Home as HomeIcon, SportsEsports as SportsEsportsIcon, Logout as LogoutIcon, SportsScore as SportsScoreIcon, Person as PersonIcon } from '@mui/icons-material';
import { host } from './utils/host';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [nextRaceSession, setNextRaceSession] = useState([]);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (token && storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && userId) {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch(`${host}users/getOneUser`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      fetchUserInfo();
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${host}drivers/getdrivers`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDrivers(data);
        setFetchStatus('Drivers fetched successfully!');
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setFetchStatus('Failed to fetch drivers. Please try again later.');
      }
    };

    fetchDrivers();
    const fetchNextRaceSession = async () => {
      try {
          // Construct the API endpoint URL
          const response = await fetch(`${host}sessions/getNextRaceSession`);
          
          // Check if the response is successful
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          // Parse the response JSON
          const data = await response.json();
          
          // Log the fetched data to the console
          console.log('Next Race Session:', data);
          setNextRaceSession(data);
      } catch (error) {
          // Log any errors that occur during the fetch
          console.error('Error fetching the next race session:', error);
      }
  };

  // Call the function to fetch the next race session
  fetchNextRaceSession();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setAnchorEl(null);
  };

  return (
    <Router>
      <div className="App">
        <Box
    sx={{
      position: 'sticky', // Change to sticky
      top: 0, // Stick to the top
      left: 0, // Ensure it stays within the viewport horizontally
      right: 0, // Ensure it stays within the viewport horizontally
      backgroundColor: 'white', // Set background to white
      zIndex: 10, // Ensure it stays above other content
      paddingTop: '10px', // Optional: Add some padding for better spacing
      // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Optional: Add some shadow to separate from the rest of the content
    }}
  >
    <Chip
      label={nextRaceSession ? `Next Race:  ${nextRaceSession.country_name}` : 'nextRaceSession'}
      sx={{ cursor: 'pointer', fontWeight: 'bold' }}
    />
    {isLoggedIn ? (
      <>
        <Chip
          avatar={
            <Avatar>
              {userInfo ? userInfo.name.charAt(0).toUpperCase() : '?'}
            </Avatar>
          }
          label={userInfo ? userInfo.name : 'Guest'}
          onClick={handleAvatarClick}
          sx={{ cursor: 'pointer', fontWeight: 'bold' }}
        />
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </>
    ) : (
      <Chip
        avatar={
          <Avatar>
            <PersonIcon />
          </Avatar>
        }
        label="Login"
        onClick={() => (window.location.href = '/login')}
        sx={{ cursor: 'pointer', fontWeight: 'bold' }}
      />
    )}
  </Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/raceresult" element={<RaceResult drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <BottomNav />
      </div>
    </Router>
  );
}

const BottomNav = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        boxShadow: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);

          switch (newValue) {
            case 0:
              navigate('/');
              break;
            case 1:
              navigate('/play');
              break;
            case 2:
              navigate('/raceresult');
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Play" icon={<SportsEsportsIcon />} />
        <BottomNavigationAction label="Racing Results" icon={<SportsScoreIcon />} />
      </BottomNavigation>
    </Box>
  );
};

export default App;
