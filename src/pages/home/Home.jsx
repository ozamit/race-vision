import React, { useState } from 'react';
import {Box} from '@mui/material';
import { host } from '../../utils/host';

const Home = ({ userInfo }) => {

  return (
    <div>
      <Box>
        <h2>{userInfo?.name ? `${userInfo.name}, Welcome to Race-vision` : 'Welcome to Race-vision'}</h2>
      </Box>
    </div>
  );
};

export default Home;
