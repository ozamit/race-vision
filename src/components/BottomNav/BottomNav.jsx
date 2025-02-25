import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Typography } from '@mui/material';

const BottomNav = ({ userInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  // Map routes to BottomNavigation indexes
  const routeToIndexMap = {
    '/': 0,
    '/league': 1,
    '/play': 2,
    '/raceresult': 3,
    '/mypredictions': 4,
    '/admin': 5,
  };

  const indexToRouteMap = Object.keys(routeToIndexMap).reduce(
    (acc, key) => ({ ...acc, [routeToIndexMap[key]]: key }),
    {}
  );

  // Sync the value with the current route
  useEffect(() => {
    const currentPath = location.pathname;
    setValue(routeToIndexMap[currentPath] || 0);
  }, [location.pathname]);

  // Styling logic
  const getActionStyles = (isSelected) => ({
    backgroundColor: isSelected ? '#FDCA40' : 'transparent', // Custom background color
    borderRadius: '50%', // Circle shape
    color: isSelected ? 'white' : 'white', // Change text/icon color based on selection
    width: '56px', // Ensures circular shape
    height: '56px', // Ensures circular shape
    minWidth: '56px', // Prevents resizing
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px', // Adjust padding
    margin: '0px 10px', // Adjust margin
    '& .MuiSvgIcon-root': { // Override the icon color if it's an SVG icon
      color: 'white', // Icon color based on selection
    },
  });
  

  return (
  <Box>
    <Box
    sx={{
      width: '90%',
      position: 'fixed',
      height: 80,
      bottom: 0,
      marginBottom: '0px',
      padding: '0px',
      display: 'flex',
      flexDirection: 'column',
      left: '49%',
      transform: 'translateX(-50%)', // Center horizontally
      }}
    >
      <BottomNavigation
          sx={{
            width: '100%', // Stretch to fill the parent container
            backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent background
            borderRadius: 10,
            margin: '0px',
            // padding: '5px',
            backdropFilter: 'blur(4px)', // Apply blur effect to the background
          }}

        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(indexToRouteMap[newValue] || '/');
        }}
        >
        {[
          { icon: <i className="bi bi-house" style={{ fontSize: '24px' }}></i> },
          { icon: <i className="bi bi-trophy" style={{ fontSize: '24px' }}></i> },
          { icon: <i className="bi bi-controller" style={{ fontSize: '24px' }}></i> },
          { icon: <i className="bi bi-flag" style={{ fontSize: '24px' }}></i> },
          { icon: <i className="bi bi-ui-checks" style={{ fontSize: '24px' }}></i> },
        ].map((action, index) => (
          <BottomNavigationAction
          key={index}
          icon={action.icon}
          sx={getActionStyles(value === index)}
          />
        ))}
      </BottomNavigation>
      {/* <Typography style={{backgroundColor:'black', padingTop: '10px'}} color='white'>text</Typography> */}
      
    </Box>
  </Box>
  );
};

export default BottomNav;
