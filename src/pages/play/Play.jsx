import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Reorder } from 'framer-motion';

import { host } from '../../utils/host';

const Play = () => {
    const [drivers, setDrivers] = useState([]); // Store fetched driver data
    const [fetchStatus, setFetchStatus] = useState(''); // Track fetch status

    useEffect(() => {
        // Fetch driver data from your backend
        fetch(`${host}drivers/getdrivers`) // This hits your backend, not the Ergast API directly
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                const raceResults = data.map(driver => driver);
                setDrivers(raceResults);
                setFetchStatus('Data fetched successfully!');
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setFetchStatus('Failed to fetch data. Please try again later.');
            });
    }, []); // Runs once on mount

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}> {/* Max width ensures cards stay centered */}
                <div>{fetchStatus}</div>
                {/* Reorder.Group for drivers */}
                <Reorder.Group 
                    style={{
                        marginBottom: '80px',
                        padding: 0,  // Remove any padding applied by default
                        listStyle: 'none',  // Remove list style (dots or numbers)
                        display: 'flex',   // Use flexbox for layout
                        flexDirection: 'column', // Ensure the cards are stacked vertically
                        gap: '10px',  // Add space between the cards
                    }} 
                    values={drivers} 
                    onReorder={setDrivers}
                >
                    {drivers.map((driver, index) => (
                        <Reorder.Item value={driver} key={driver.name_acronym}>
                            <Card style={{
                                marginBottom: '1px',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',  // Center content horizontally
                                justifyContent: 'space-between',  // Space between content
                            }}>
                                <CardActions style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px' }}>
                                    <Typography variant="h6">{index + 1}</Typography>
                                    <img
                                        src={driver.headshot_url || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png'}
                                        alt={`${driver.name_acronym} driver`}
                                        style={{
                                            width: '40px',
                                            height: 'auto',
                                            margin: '0rem 1rem',
                                            border: `solid 2px #${driver.team_colour}`,
                                            borderRadius: '25px',
                                            padding: '5px'
                                        }}
                                    />
                                    <Typography>{driver.full_name}</Typography>
                                </CardActions>
                            </Card>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
        </div>
    );
};

export default Play;
