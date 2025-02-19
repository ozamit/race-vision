import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

const Home = ({ userInfo, simplifiedDate, userLocalTime, nextRaceSession }) => {
  const navigate = useNavigate();

  const handleClickGoToRules = () => {
    navigate("/howtoplay");
  };

  // State to store the countdown time
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!userLocalTime) return;

    // Convert userLocalTime (formatted as dd/mm/yyyy HH:mm) to a Date object
    const [datePart, timePart] = userLocalTime.split(" ");
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    
    const raceTime = new Date(year, month - 1, day, hours, minutes); // Month is zero-based in JS Dates

    const updateCountdown = () => {
      const now = new Date();
      const tenMinutesBeforeRace = new Date(raceTime.getTime() - 10 * 60 * 1000); // Subtract 10 minutes
    
      const diffMs = tenMinutesBeforeRace - now;
    
      if (diffMs <= 0) {
        setCountdown("Predictions are closed!");
        return;
      }
    
      const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);
    
      setCountdown(`${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
    };    
    
    // Initial call
    updateCountdown();

    // Update countdown every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [userLocalTime]);

  return (
    <Typography >
      {/* Welcome Message */}
      <Box sx={{ marginTop: '30px', margin: '20px', textAlign: 'center' }}>
        <Typography component="span"sx={{ fontSize: 34 }} color="white">
          {userInfo?.name ? `${userInfo.name}, Welcome to Race-vision` : 'Welcome to Race-vision'}
        </Typography>
      </Box>

      {/* Main Content Boxes */}
      <Box sx={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        
        {/* Next Race Details */}
        <Box sx={{ width: '70%', borderRadius: '20px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', textAlign: 'center', height: '110px' }}>
          <Typography color="white" style={{ fontSize: '18px', marginBottom: '10px' }}>
            <i className="bi bi-geo-fill" style={{ marginRight: '10px' }}></i> {nextRaceSession.circuit_short_name}
          </Typography>
          <Typography color="white" style={{ fontSize: '18px', marginBottom: '10px' }}>
            <i className="bi bi-globe-americas" style={{ marginRight: '10px' }}></i> {nextRaceSession.country_name}
          </Typography>
          <Typography color="white" style={{ fontSize: '18px' }}>
          <i className="bi bi-calendar-date" style={{ marginRight: '10px' }}></i> {userLocalTime}
          </Typography>
        </Box>

        {/* Countdown Box */}
        <Box
          sx={{
            width: '70%',
            borderRadius: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50px',
          }}
        >
            <Typography color="white" style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
              Time to submit prediction for the next race
              <i className="bi bi-hourglass-split" style={{ fontSize: '20px', marginLeft: '10px' }}></i>
            </Typography>
            <Typography color="white" style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
              {countdown}
            </Typography> 
        </Box>

        {/* How To Play Box */}
        <Box
          sx={{
            width: '70%',
            borderRadius: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30px',
          }}
          onClick={handleClickGoToRules}
        >
          <Typography color="white" style={{ fontSize: '18px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            How To Play <i className="bi bi-info-circle" style={{ fontSize: '20px', marginLeft: '10px' }}></i>
          </Typography>
        </Box>

        {/* Two Side-by-Side Boxes */}
        <Box sx={{ display: 'flex', width: '80%', justifyContent: 'space-between', gap: '20px' }}>
          {/* Insights Box */}
          <Box
            sx={{
              width: '40%',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <Typography color="white">
              <Typography style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <InsightsIcon style={{ fontSize: '40px' }} />
                <span style={{ marginTop: '8px' }}>(soon)</span>
              </Typography>
            </Typography>
          </Box>

          {/* Video Collection Box */}
          <Box
            sx={{
              width: '40%',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <Typography color="white" align="center">
              <Typography style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <i className="bi bi-collection-play-fill" style={{ fontSize: '40px' }}></i>
                <span style={{ marginTop: '8px' }}>(soon)</span>
              </Typography>
            </Typography>
          </Box>
        </Box>

      </Box>
    </Typography>
  );
};

export default Home;
