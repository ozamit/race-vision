import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,useNavigate,useLocation } from 'react-router-dom';
import './App.css';
import Play from './pages/play/Play';
import MyPredictions from './pages/myPredictions/MyPredictions';
import Home from './pages/home/Home';
import RaceResult from './pages/raceResult/RaceResult';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import HowToPlay from './pages/howToPlay/HowToPlay';
import BottomNav from './components/BottomNav/BottomNav';
import Admin from './pages/admin/Admin';
import 'bootstrap-icons/font/bootstrap-icons.css';
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
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { host } from './utils/host';
import { backgroundImg1 } from './utils/img';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [driversLocalDB, setDriversLocalDB] = useState([]); // State to store drivers from DB
  const [fetchStatus, setFetchStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [nextRaceSession, setNextRaceSession] = useState([]);
  const [raceSessions, setRaceSessions] = useState([]);

  
  const menuOpen = Boolean(anchorEl);
  const year = 2024;

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
          console.log('User Info:', data);
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
        console.log('Drivers:', data);
        setDrivers(data);
        setFetchStatus('Drivers fetched successfully!');
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setFetchStatus('Failed to fetch drivers. Please try again later.');
      }
    };
    fetchDrivers();

    // Fetch the drivers from DB
      const handleGetDriversFromDB = async () => {
        try {
          const response = await fetch(`${host}drivers/getDriversLocalDB`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const data = await response.json();
          setDriversLocalDB(data); // Update the state with fetched drivers
          console.log('Drivers from Local DB:', data); // Print the state to the console
        } catch (error) {
          console.error('Error fetching drivers from local DB:', error);
        }
      };
      handleGetDriversFromDB();

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

          const fetchRaceSessions = async () => {
              try {
                  const response = await fetch(`${host}sessions/getracesessionsforyear?year=${year}`);
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  const data = await response.json();
                  setRaceSessions(data);
              } catch (error) {
                  console.error('Error fetching race sessions:', error);
              }
          };
          fetchRaceSessions();
  }, []);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdmin = () => {

    window.location.href = '/admin'; // Redirect to admin page
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setAnchorEl(null);
    window.location.href = '/'; // Redirect to home page
  };

  return (
    <Router>
      <div className="App">
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(https://i.ibb.co/PgYfCpx/Untitled-design-1.png)`,
          // backgroundColor: `black`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover', // Ensures the image covers the whole background
          backgroundPosition: 'center', // Centers the image
        }}>
      <Box
sx={{
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  paddingTop: '15px',
  display: 'flex',
  alignItems: 'right',
  flexDirection: 'row-reverse',
  width: '100%',
  // background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))', // Gradient for transparency
  // backdropFilter: 'blur(10px)', // Blur effect
  // WebkitBackdropFilter: 'blur(10px)', // Safari support
}}
>
  {/* Left Chip */}
  {/* <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1, // Take up the available space on the left
    }}
  >
    <Chip
      label={nextRaceSession ? `Next Race: ${nextRaceSession.country_name}` : 'Welcome to Race Vision App'}
      sx={{
        backgroundColor: 'rgb(235, 235, 235)',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.25), -1px -1px 6px rgba(255, 255, 255, 0.06)',
      }}
    />
  </Box> */}

  {/* Right Chip */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      marginRight: '15px', // 15px from the right edge
    }}
  >
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
          sx={{
            backgroundColor: 'rgb(235, 235, 235)',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.25), -1px -1px 6px rgba(255, 255, 255, 0.06)', // Add box shadow
          }}
        />
<Menu
  anchorEl={anchorEl}
  open={menuOpen}
  onClose={handleMenuClose}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
  <MenuItem onClick={handleLogout}>
    <BottomNavigationAction label="Predictions" icon={<i className="bi bi-box-arrow-right" style={{ fontSize: '24px' }}></i>} />
    Logout
  </MenuItem>
  {/* Conditionally render the Admin MenuItem based on userInfo.admin */}
  {userInfo && userInfo.admin === true && (
  <MenuItem onClick={handleAdmin}>
    <BottomNavigationAction label="Predictions" icon={<i className="bi bi-person-gear" style={{ fontSize: '24px' }}></i>} />
    Admin
  </MenuItem>
)}


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
        sx={{
          backgroundColor: 'rgb(235, 235, 235)',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.25), -1px -1px 6px rgba(255, 255, 255, 0.06)',
        }}
      />
    )}
  </Box>
</Box>
        <Routes>
          <Route path="/" element={<Home userInfo={userInfo} />} />
          <Route path="/play" element={<Play userInfo={userInfo} nextRaceSession={nextRaceSession} drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/raceresult" element={<RaceResult drivers={drivers} driversLocalDB={driversLocalDB} fetchStatus={fetchStatus} />} />
          <Route path="/mypredictions" element={<MyPredictions userInfo={userInfo} raceSessions={raceSessions} drivers={drivers} nextRaceSession={nextRaceSession}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/howtoplay" element={<HowToPlay />} />         
          <Route path="/admin" element={<Admin userInfo={userInfo} />} /> 
        </Routes>

        {/* BottomNav is a different component */}
        <BottomNav userInfo={userInfo}/>  
      </Box>
      </div>
    </Router>
  );
}


export default App;
