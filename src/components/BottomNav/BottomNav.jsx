import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Typography } from '@mui/material';

const BottomNav = ({ userInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

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

  useEffect(() => {
    const currentPath = location.pathname;
    setValue(routeToIndexMap[currentPath] || 0);
  }, [location.pathname]);

  const actions = [
    { icon: <i className="bi bi-house" style={{ fontSize: '24px' }}></i> },
    { icon: <i className="bi bi-trophy" style={{ fontSize: '24px' }}></i> },
    { icon: <i className="bi bi-controller" style={{ fontSize: '24px' }}></i> },
    { icon: <i className="bi bi-flag" style={{ fontSize: '24px' }}></i> },
    { icon: <i className="bi bi-ui-checks" style={{ fontSize: '24px' }}></i> },
  ];

  const itemWidth = 70; // Approximate width of each item (56px icon + margin/padding)
  const totalItems = actions.length;
  const navWidth = itemWidth * totalItems;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${navWidth}px`,
        zIndex: 0, // Ensure nav is above other elements
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: '70px', // Set the height of the nav bar
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Animated yellow circle with the icon inside */}
        <Box
  sx={{
    position: 'absolute',
    top: 7, // Position the circle so it's above the nav bar and not overlapping the icons
    left: `${value * itemWidth + (itemWidth - 56) / 2}px`, // Position it based on the selected index
    width: 56,
    height: 56,
    backgroundColor: '#FDCA40',
    borderRadius: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'left 0.7s ease', // Smooth transition for the circle movement
    zIndex: 3, // Ensure the circle is above the background but below the icons
  }}
>
  {/* <Typography>{action.index}</Typography> */}
  {actions[value]?.icon && React.cloneElement(actions[value].icon, { style: { color: '#2167f3', fontSize: '25px' } })} {/* Dynamically display the icon inside the circle and set its color to blue */}
</Box>


        <BottomNavigation
          sx={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            backdropFilter: 'blur(4px)',
            height: 58,
            zIndex: 2, // Ensure nav items are above the circle
          }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(indexToRouteMap[newValue] || '/');
          }}
        >
          {actions.map((action, index) => (
            <BottomNavigationAction
              key={index}
              icon={action.icon}
              sx={{
                color: 'white',
                width: 56,
                height: 56,
                minWidth: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 0, // Ensure icons are above the yellow circle
                opacity: value === index ? 0 : 1, // Make the selected icon transparent
              }}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default BottomNav;
