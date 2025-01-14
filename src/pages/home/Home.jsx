import React, { useState } from 'react';
import { host } from '../../utils/host';

const Home = ({ userInfo }) => {
  const [driversLocalDB, setDriversLocalDB] = useState([]); // State to store drivers from DB

  const handleSaveDrivers = async () => {
    try {
      const response = await fetch(`${host}drivers/saveDriversToDB`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Result from saving drivers:', result);
    } catch (error) {
      console.error('Error while saving drivers:', error);
    }
  };

  const handleGetDriversFromDB = async () => {
    try {
      const response = await fetch(`${host}drivers/getDriversLocalDB`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDriversLocalDB(data); // Update the state with fetched drivers
      console.log('Drivers from Local DB:', data); // Print the state to the console
    } catch (error) {
      console.error('Error fetching drivers from local DB:', error);
    }
  };

  return (
    <div>
      <h2>{userInfo?.name ? `${userInfo.name}, Welcome to Race-vision` : 'Welcome to Race-vision'}</h2>
      {/* <button
        onClick={handleSaveDrivers}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        Save Drivers to DB
      </button>
      <button
        onClick={handleGetDriversFromDB}
        style={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
      >
        Get Drivers from DB
      </button> */}
    </div>
  );
};

export default Home;
