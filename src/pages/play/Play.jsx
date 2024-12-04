import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import { Reorder } from 'framer-motion';

const Play = () => {
    const [items, setItems] = useState([1, 2, 3, 4, 5]);
    const [drivers, setDrivers] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(''); // Track fetch status

    useEffect(() => {
        // Fetch driver data
        fetch('https://ergast.com/api/f1/2024/5/results.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setDrivers(data.MRData.RaceTable.Races[0].Results || []);
                setFetchStatus('Data fetched successfully!'); // Update status on success
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setFetchStatus('Failed to fetch data. Please try again later.'); // Update status on failure
            });
    }, []);

    return (
        <div>
            <div>play</div>

            {/* Fetch status message */}
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
