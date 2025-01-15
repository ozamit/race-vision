import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';

const BottomNav = ({userInfo}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  // Map routes to BottomNavigation indexes
  const routeToIndexMap = {
    '/': 0,
    '/howtoplay': 1,
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

  return (
    <Box
      sx={{
        position: 'fixed',
        maxWidth: '100%',
        height: 60,
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
          navigate(indexToRouteMap[newValue] || '/');
        }}
      >
        <BottomNavigationAction label="Home" icon={<i className="bi bi-house" style={{ fontSize: '28px' }}></i>} />
        <BottomNavigationAction label="How To Play" icon={<i className="bi bi-info-circle" style={{ fontSize: '20px' }}></i>} />
        <BottomNavigationAction label="Play" icon={<i className="bi bi-controller" style={{ fontSize: '28px' }}></i>} />
        <BottomNavigationAction label="Race Results" icon={<i className="bi bi-flag" style={{ fontSize: '20px' }}></i>} />
        <BottomNavigationAction label="Predictions" icon={<i className="bi bi-ui-checks" style={{ fontSize: '28px' }}></i>} />
        {/* <BottomNavigationAction label="Admin" icon={<i className="bi bi-person-gear" style={{ fontSize: '28px' }}></i>} /> */}
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
