import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { formatDate, convertToUserLocalTime } from './utils/dateUtils';
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
import League from './pages/league/League';
import UserPredictions from './pages/userPredictions/userPredictions';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Box,
  BottomNavigationAction,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { host } from './utils/host';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [driversLocalDB, setDriversLocalDB] = useState([]); // State to store drivers from DB
  const [fetchStatus, setFetchStatus] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [nextRaceSession, setNextRaceSession] = useState([]);
  const [startNextRaceSession, setStartNextRaceSession] = useState([]);
  const [raceSessions, setRaceSessions] = useState([]);
  const [simplifiedDate, setSimplifiedDate] = useState('');
  const [userLocalTime, setUserLocalTime] = useState('');
  const menuOpen = Boolean(anchorEl);

  // Functions formatDate and convertToUserLocalTime were moved to utils/dateUtils.js
    
    useEffect(() => {
      if (nextRaceSession?.date_start && nextRaceSession?.gmt_offset) {
        setSimplifiedDate(formatDate(nextRaceSession.date_start));
    
        const localTime = convertToUserLocalTime(nextRaceSession.date_start, nextRaceSession.gmt_offset);
        setUserLocalTime(localTime);
    
        console.log('Event Time in User Local Time:', localTime);
      }
    }, [nextRaceSession]);


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

    const fetchGridDrivers = async () => {
      try {
        const response = await fetch(`${host}drivers/getGridDriversLocalDB`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('GridDrivers:', data);
        setDrivers(data);
        setFetchStatus('Drivers fetched successfully!');
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setFetchStatus('Failed to fetch drivers. Please try again later.');
      }
    };
    fetchGridDrivers();

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
          // console.log('Drivers from Local DB:', data); // Print the state to the console
        } catch (error) {
          console.error('Error fetching drivers from local DB:', error);
        }
      };
      handleGetDriversFromDB();

// Fetch the next race session once and update both session states
const fetchNextRaceSessionCombined = async () => {
  try {
    // Fetch session data from DB (used in multiple components)
    const response = await fetch(`${host}sessions/getNextRaceSessionFromDB`);
    
    // Handle failed response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Log for debugging; shows fetched session in console
    console.log('Next Race Session:', data);

    // Sync both states with same data source
    setNextRaceSession(data);        // Primary race session
    setStartNextRaceSession(data);  // Secondary use, reused same data
  } catch (error) {
    // Keep visibility into API issues
    console.error('Error fetching the next race session:', error);
  }
};

// Call it once, instead of twice with duplicate fetches
fetchNextRaceSessionCombined();


          const fetchRaceSessions = async () => {
              try {
                  const response = await fetch(`${host}sessions/getRaceSessionsForYearFromDB`);
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
          {/* Background layer: fixed and behind everything */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundImage: `url(https://i.ibb.co/6cgKRDdw/Untitled-design-4.jpg)`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'top',
              zIndex: -1, // Ensure it stays in the background
            }}
          />
            {/* Foreground scrollable content */}
            <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', overflowX: 'hidden' }}>
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
                  }}
                >

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
  sx={{padding: '0px', marginTop: '10px'}}
  anchorEl={anchorEl}
  open={menuOpen}
  onClose={handleMenuClose}
  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
>
  <MenuItem sx={{padding: '0px 30px 0px 10px'}} onClick={handleLogout}>
    <BottomNavigationAction sx={{paddingRight: '0px'}} label="Predictions" icon={<i className="bi bi-box-arrow-right" style={{ fontSize: '24px' }}></i>} />
    Logout
  </MenuItem>
  {/* Conditionally render the Admin MenuItem based on userInfo.admin */}
  {userInfo && userInfo.admin === true && (
  <MenuItem sx={{padding: '0px 30px 0px 10px'}} onClick={handleAdmin}>
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
          <Route path="/" element={<Home userInfo={userInfo} nextRaceSession={nextRaceSession} startNextRaceSession={startNextRaceSession} userLocalTime={userLocalTime} simplifiedDate={simplifiedDate} />} />
          <Route path="/play" element={<Play userInfo={userInfo} nextRaceSession={nextRaceSession} userLocalTime={userLocalTime} drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/raceresult" element={<RaceResult driversLocalDB={driversLocalDB} />} />
          <Route path="/mypredictions" element={<MyPredictions userInfo={userInfo} raceSessions={raceSessions} />} />
          <Route path="/UserPredictions" element={<UserPredictions raceSessions={raceSessions} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/howtoplay" element={<HowToPlay />} />         
          <Route path="/admin" element={<Admin userInfo={userInfo} nextRaceSession={nextRaceSession} userLocalTime={userLocalTime} drivers={drivers} />} /> 
          <Route path="/league" element={<League userInfo={userInfo} raceSessions={raceSessions} />} /> 
        </Routes>

        {/* BottomNav is a different component */}
        <BottomNav userInfo={userInfo}/>  
      </Box>
      </div>
    </Router>
  );
}


export default App;
