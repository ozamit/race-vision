import React, { useState } from 'react';
import {Box, Typography} from '@mui/material';
import { host } from '../../utils/host';

const Home = ({ userInfo }) => {

  return (
    <div>
      <Box sx={{ marginTop: '30px' }}>
        <Typography sx={{ fontSize: 24 }} color="white">
          {userInfo?.name ? `${userInfo.name}, Welcome to Race-vision` : 'Welcome to Race-vision'}
        </Typography>
        {/* <h2>{userInfo?.name ? `${userInfo.name}, Welcome to Race-vision` : 'Welcome to Race-vision'}</h2> */}
      </Box>
    </div>
  );
};

export default Home;
