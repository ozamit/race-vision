import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route,useNavigate } from 'react-router-dom';
import './App.css';
import Play from './pages/play/Play';
import MyPredictions from './pages/myPredictions/MyPredictions';
import Home from './pages/home/Home';
import RaceResult from './pages/raceResult/RaceResult';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
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

function App() {
  const [drivers, setDrivers] = useState([]);
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
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  paddingTop: '10px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0))', // Gradient for transparency
  // backdropFilter: 'blur(10px)', // Blur effect
  // WebkitBackdropFilter: 'blur(10px)', // Safari support
}}
>
  {/* Left Chip */}
  <Box
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
  </Box>

  {/* Right Chip */}
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      marginRight: '10px', // 10px from the right edge
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
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play userInfo={userInfo} nextRaceSession={nextRaceSession} drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/raceresult" element={<RaceResult drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/mypredictions" element={<MyPredictions userInfo={userInfo} raceSessions={raceSessions} drivers={drivers} nextRaceSession={nextRaceSession}/>} />
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
              case 3:
                navigate('/mypredictions');
                break;
            default:
              break;
          }
        }}
      >
        {/* <BottomNavigationAction label="Home" icon={<HomeIcon />} /> */}
        {/* <BottomNavigationAction label="Play" icon={<SportsEsportsIcon />} /> */}
        {/* <BottomNavigationAction label="Race Results" icon={<SportsScoreIcon />} /> */}
        {/* <BottomNavigationAction label="Predictions" icon={<FactCheckIcon />} /> */}
        <BottomNavigationAction label="Home" icon={<i className="bi bi-house" style={{ fontSize: '28px' }}></i>} />
        <BottomNavigationAction label="Play" icon={<i class="bi bi-controller" style={{ fontSize: '28px' }}></i>} />
        <BottomNavigationAction label="Race Results" icon={<i class="bi bi-flag" style={{ fontSize: '24px' }}></i>}   sx={{
            '& .MuiBottomNavigationAction-label': {
              fontSize: '12px', // Change this to your desired font size
            },
          }}/>
        <BottomNavigationAction label="Predictions" icon={<i class="bi bi-ui-checks" style={{ fontSize: '28px' }}></i>} />
        {/* <BottomNavigationAction label="Predictions" style={{ fontSize: '28px' }} icon={"😀"} /> */}

      </BottomNavigation>
    </Box>
  );
};

export default App;
