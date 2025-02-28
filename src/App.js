import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
// import { backgroundImg1 } from './utils/img';

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
  const [simplifiedDate, setSimplifiedDate] = useState('');
  const [userLocalTime, setUserLocalTime] = useState('');
  const menuOpen = Boolean(anchorEl);

  const formatDate = (isoDate) => {
    // console.log('Original isoDate:', isoDate);
  
    // Remove the "Z" if it exists
    const cleanIsoDate = isoDate.replace('Z', '');
    // console.log('Clean isoDate (without Z):', cleanIsoDate);
  
    // Create Date object (now correctly interpreted as local time)
    const date = new Date(cleanIsoDate);
    // console.log('Parsed Date:', date);
  
    // Format date and time in local timezone
    const simplifiedDate = date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  
    const simplifiedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    // console.log('Simplified Date:', simplifiedDate);
    // console.log('Simplified Time:', simplifiedTime);
  
    return `${simplifiedDate} ${simplifiedTime}`; // Example: dd/mm/yyyy 01:00 PM
  };
  


  const convertToUserLocalTime = (isoDate, gmtOffset) => {
    // Parse event date as if it is in the provided GMT offset timezone
    const eventDate = new Date(isoDate);
  
    // Extract hours and minutes from the gmtOffset string (e.g., "11:00:00")
    const [hours, minutes] = gmtOffset.split(':').map(Number);
  
    // Convert offset to total minutes
    const totalOffsetMinutes = hours * 60 + minutes;
  
    // Convert event time to UTC (by subtracting the offset)
    eventDate.setMinutes(eventDate.getMinutes() - totalOffsetMinutes);
  
    // Get the day, month, year, hours, and minutes
    const day = String(eventDate.getDate()).padStart(2, '0'); // Ensure two digits
    const month = String(eventDate.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const year = eventDate.getFullYear();
    const hour = String(eventDate.getHours()).padStart(2, '0'); // Ensure two digits for hour
    const minute = String(eventDate.getMinutes()).padStart(2, '0'); // Ensure two digits for minute
  
    // Format the date and time as dd/mm/yyyy HH:mm
    const formattedDateTime = `${day}/${month}/${year} ${hour}:${minute}`;
  
    return formattedDateTime;
  };
   
    
    
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
          // const response = await fetch(`${host}sessions/getNextRaceSession`);
          const response = await fetch(`${host}sessions/getNextRaceSessionFromDB`);
          
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
          <Route path="/" element={<Home userInfo={userInfo} nextRaceSession={nextRaceSession} userLocalTime={userLocalTime} simplifiedDate={simplifiedDate} />} />
          <Route path="/play" element={<Play userInfo={userInfo} nextRaceSession={nextRaceSession} userLocalTime={userLocalTime} drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/raceresult" element={<RaceResult drivers={drivers} driversLocalDB={driversLocalDB} fetchStatus={fetchStatus} />} />
          <Route path="/mypredictions" element={<MyPredictions userInfo={userInfo} raceSessions={raceSessions} drivers={drivers} nextRaceSession={nextRaceSession}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/howtoplay" element={<HowToPlay />} />         
          <Route path="/admin" element={<Admin userInfo={userInfo} />} /> 
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
