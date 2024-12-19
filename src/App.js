import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import './App.css';
import Play from './pages/play/Play';
import Home from './pages/home/Home';
import RaceResult from './pages/raceResult/RaceResult';
import { host } from './utils/host';

function App() {
  const [drivers, setDrivers] = useState([]);
  const [fetchStatus, setFetchStatus] = useState('');

  // Fetch driver data
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
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Pass drivers and fetchStatus as props */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play drivers={drivers} fetchStatus={fetchStatus} />} />
          <Route path="/raceresult" element={<RaceResult drivers={drivers} fetchStatus={fetchStatus} />} />
        </Routes>

        {/* Bottom navigation fixed to the bottom */}
        <BottomNav />
      </div>
    </Router>
  );
}

// BottomNav component for navigation
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
