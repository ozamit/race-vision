import React, { useState, useEffect } from 'react';
import { Button, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, TextField } from '@mui/material';
import { host } from '../../utils/host';

const Admin = ({ userInfo }) => {
    const [driversLocalDB, setDriversLocalDB] = useState([]); // State to store drivers from DB
    const [raceSessions, setRaceSessions] = useState([]);
    const [sessionKey, setSessionKey] = useState(''); // State to store the inputted session key

    useEffect(() => {
        const fetchRaceSessions = async () => {
            try {
                const response = await fetch(`${host}sessions/getracesessionsforyear?year=2024`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setRaceSessions(data);
            } catch (error) {
                console.error('Error fetching race sessions:', error);
            }
        };
        fetchRaceSessions();
    }, []);

    const handleSaveFinalRaceResultToDB = async () => {
        if (sessionKey.length !== 4) {
            console.error('Session key must be a 4-digit number.');
            return;
        }
        console.log('Session Key:', sessionKey); // Print the session key to console
        try {
            const response = await fetch(`${host}positions/saveFinalRaceResultToDB?sessionKey=${sessionKey}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Result from SaveFinalRaceResultToDB:', result);
        } catch (error) {
            console.error('Error to SaveFinalRaceResultToDB:', error);
        }

    }

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

    const handleSaveNewSessionsToDB = async () => {
        try {
            const response = await fetch(`${host}sessions/saveSessionsToDB`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('RES:', data); 
        } catch (error) {
            console.error('Error saving sessions to DB:', error);
        }
    };

    
    const handleGetNexSessionsFromDB = async () => {
        try {
            const response = await fetch(`${host}sessions/getNextRaceSessionFromDB`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('RES:', data); 
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleUpdateFinalScoreforPrediction = async () => {
        try {
            const response = await fetch(`${host}predictions/updateFinalScoreforPrediction?sessionKey=9655`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('RES:', data); 
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <Typography>
            <Typography
                sx={{color: 'white', padding: '0px 0px 200px 0px'}}>
            <Typography>Admin</Typography>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />

            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', padding: '10px 20px', fontSize: '18px' }}>Save Final Race Result To DB</Typography>
            <Typography sx={{ padding: '10px 20px', fontSize: '16px' }}>To save the race results, please enter the session key and click 'Submit'.</Typography>
            {/* Input field for session key */}
            <TextField
  label="Session Key"
  variant="outlined"
  value={sessionKey}
  onChange={(e) => setSessionKey(e.target.value)}
  sx={{
    marginTop: '20px',
    marginRight: '10px',
    width: '150px',
    // Set text field background and border colors
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white', // White border
      },
      '&:hover fieldset': {
        borderColor: 'white', // Keep the border white on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white', // White border when focused
      },
    },
    // Label styles
    '& .MuiInputLabel-root': {
      color: 'white', // White label color
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white', // White label when focused
    },
    // Input text color
    '& .MuiInputBase-input': {
      color: 'white', // Black text for better visibility on white background
    },
  }}
  inputProps={{ maxLength: 4 }} // Ensures only a 4-digit key can be entered
/>


            <Button
                onClick={handleSaveFinalRaceResultToDB}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
            >
                Save Final Race Result To DB
            </Button>

            {/* Accordion displaying race session details */}
            {raceSessions.length > 0 && (
                <Accordion sx={{ margin: '20px'}}>
                    <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                        <Typography>Race Sessions - click to open</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {raceSessions.map((session, index) => (
                            <Typography key={index}>
                                <Typography variant="body2">
                                    <strong>Country:</strong> {session.country_name} <br />
                                    <strong>Session Key:</strong> {session.session_key}
                                </Typography>
                            </Typography>
                        ))}
                    </AccordionDetails>
                </Accordion>
            )}

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            
            <Typography sx={{ marginTop: '20px' }}>
                Specify the 'meeting_key' and 'session_key' in the backend before Save Drivers to DB
            </Typography>
            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', padding: '10px 20px', fontSize: '18px' }}>
            This controller fetches driver data from an external API, checks if each driver already exists in the database, and saves any new ones. At the end, it responds with a list of newly added drivers or reports an error if something goes wrong.
            </Typography>

            <Button
                onClick={handleSaveDrivers}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
            >
                Save Drivers to DB
            </Button>
            
            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            <Button
                onClick={handleGetDriversFromDB}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
                Get Drivers from DB
            </Button>
            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', padding: '10px 20px', fontSize: '18px' }}>
            This controller fetches race sessions from an external API, checks if each session already exists in the database, and saves any new ones. Finally, it responds with how many new sessions were added or reports an error if something goes wrong.
            </Typography>
            <Button
                onClick={handleSaveNewSessionsToDB}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
                save new session to DB
            </Button>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', padding: '10px 20px', fontSize: '18px' }}>
            checks the database for the next upcoming race. If none are found, it updates the database with new sessions and tells you to check back later. If something goes wrong, it reports an error.
            </Typography>
            <Button
                onClick={handleGetNexSessionsFromDB}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
                get next session from DB
            </Button>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />

            <Typography sx={{ fontWeight: 'bold', marginTop: '20px', padding: '10px 20px', fontSize: '18px' }}>
                write description here (update Final Score for Prediction)
            </Typography>
            <Button
                onClick={handleUpdateFinalScoreforPrediction}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
                update Final Score for Prediction
            </Button>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />

            </Typography>
        </Typography>
    );
};

export default Admin;
