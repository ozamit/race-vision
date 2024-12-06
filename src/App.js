import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import './App.css';
import Play from './pages/play/Play';
import Home from './pages/home/Home';
import RaceResult from './pages/raceResult/RaceResult';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Routes for navigating between pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/raceresult" element={<RaceResult />} />
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

          // Perform actions based on selected navigation
          switch (newValue) {
            case 0:
              navigate('/'); // Navigate to Play
              break;
            case 1:
              navigate('/play'); // Navigate to Home
              break;
            case 2:
              navigate('/raceresult'); // Navigate to raceresult
              break;
            default:
              break;
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Play" icon={<SportsEsportsIcon />} />
        <BottomNavigationAction label="Racing results" icon={<SportsScoreIcon />} />
      </BottomNavigation>
    </Box>
  );
};

export default App;
