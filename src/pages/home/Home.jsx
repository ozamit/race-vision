import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

const Home = ({ userInfo, simplifiedDate, nextRaceSession }) => {

  const navigate = useNavigate();

  const handleClickGoToRules = () => {
    navigate("/howtoplay");
  };
  return (
    <div>
      {/* Welcome Message */}
      <Box sx={{ marginTop: '30px', margin: '20px', textAlign: 'center' }}>
        <Typography sx={{ fontSize: 34 }} color="white">
          {userInfo?.name ? `${userInfo.name}, Welcome to Race-vision` : 'Welcome to Race-vision'}
        </Typography>
      </Box>

      {/* Main Content Boxes */}
      <Box
        sx={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* First Box: Wide Box (90% width) */}
        <Box
          sx={{
            width: '70%',
            borderRadius: '20px',
            // border: '1px solid #FDCA40',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
            textAlign: 'center',
            // display: 'flex', // Flexbox container
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            height: '120px', // Set a height for the box to center content vertically
          }}
        >
          <Typography color="white" style={{ fontSize: '18px', marginBottom: '10px' }}>
          <i class="bi bi-geo-fill"></i> {nextRaceSession.circuit_short_name}
          </Typography>
          <Typography color="white" style={{ fontSize: '18px', marginBottom: '10px' }}>
          <i class="bi bi-globe-americas"></i> {nextRaceSession.country_name}
          </Typography>
          <Typography color="white" style={{ fontSize: '18px' }}>
          <i class="bi bi-calendar-date"></i> {simplifiedDate}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '70%',
            borderRadius: '20px',
            // border: '1px solid rgba(255, 255, 255, 0.4)',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
            textAlign: 'center',
            display: 'flex', // Flexbox container
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            height: '30px', // Set a height for the box to center content vertically
          }}
          onClick={handleClickGoToRules}
        >
          <Typography color="white" style={{ fontSize: '18px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            How To Play <i className="bi bi-info-circle" style={{ fontSize: '20px', marginLeft: '10px' }}></i>
            {/* How To Play <SportsIcon style={{ fontSize: '40px', marginLeft: '10px' }}/> */}
          </Typography>
        </Box>

        <Box
          sx={{
            width: '70%',
            borderRadius: '20px',
            // border: '1px solid #FDCA40',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
            textAlign: 'center',
            display: 'flex', // Flexbox container
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            height: '50px', // Set a height for the box to center content vertically
          }}
        >
          <Typography color="white" style={{ fontSize: '14px' }}>
            {/* <i className="bi bi-graph-up" style={{ fontSize: '20px' }}></i> */}
            Exciting updates are coming soon! <i class="bi bi-hourglass-split"></i>
          </Typography>
        </Box>

        {/* Second and Third Boxes (Side by side) */}
        <Box
          sx={{
            display: 'flex',
            width: '80%',
            justifyContent: 'space-between', // Distribute boxes evenly
            gap: '20px',
          }}
        >
          {/* Second Box */}
          <Box
            sx={{
              width: '40%', // Takes 48% of the width (leaving space for gap)
              borderRadius: '20px',
              // border: '2px solid #FDCA40',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
              textAlign: 'center',
              display: 'flex', // Flexbox container
              justifyContent: 'center', // Center horizontally
              alignItems: 'center', // Center vertically
              height: '100px', // Set a height for the box
            }}
          >
            <Typography color="white">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <InsightsIcon style={{ fontSize: '40px' }} />
            <span style={{ marginTop: '8px' }}>(soon)</span>
            </div>
            </Typography>
          </Box>

          {/* Third Box */}
          <Box
            sx={{
              width: '40%', // Takes 48% of the width (leaving space for gap)
              borderRadius: '20px',
              // border: '2px solid #FDCA40',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
              textAlign: 'center',
              display: 'flex', // Flexbox container
              justifyContent: 'center', // Center horizontally
              alignItems: 'center', // Center vertically
              height: '100px', // Set a height for the box
            }}
          >
          <Typography color="white" align="center">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <i className="bi bi-collection-play-fill" style={{ fontSize: '40px' }}></i>
              <span style={{ marginTop: '8px' }}>(soon)</span>
            </div>
          </Typography>
          </Box>
        </Box>

      </Box>

    </div>
  );
};

export default Home;
