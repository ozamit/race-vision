import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { Reorder } from 'framer-motion';

const Play = () => {
    const [drivers, setDrivers] = useState([]); // Store fetched driver data
    const [fetchStatus, setFetchStatus] = useState(''); // Track fetch status

    useEffect(() => {
        // Fetch driver data from your backend (which proxies the request to the Ergast API)
        fetch('http://localhost:5000/api/data') // This hits your backend, not the Ergast API directly
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const raceResults = data.MRData.RaceTable.Races[0].Results || [];
                setDrivers(raceResults);  // Set drivers data to state
                setFetchStatus('Data fetched successfully!'); // Success status
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setFetchStatus('Failed to fetch data. Please try again later.'); // Failure status
            });
    }, []);  // Empty dependency array, so this runs once on component mount

    return (
        <div>
            <div>play</div>

            {/* Display fetch status */}
            <div style={{ marginBottom: '1rem', color: fetchStatus.startsWith('Failed') ? 'red' : 'green' }}>
                {fetchStatus}
            </div>

            {/* Reorder.Group for drivers */}
            <Reorder.Group values={drivers} onReorder={setDrivers}>
                {drivers.map((driver, index) => (
                    <Reorder.Item value={driver} key={driver.Driver.code}>
                        <Card>
                            <CardActions>Driver Code: {driver.Driver.code}</CardActions>
                            <CardActions>Predicted Position: {index + 1}</CardActions>
                        </Card>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
};

export default Play;
