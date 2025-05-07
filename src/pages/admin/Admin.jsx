import React, { useState, useEffect } from 'react';
import { Button, Typography, Divider, Accordion, AccordionSummary, AccordionDetails, TextField, Card, CardActions, Snackbar, Alert } from '@mui/material';
import { host } from '../../utils/host';
import { Reorder } from 'framer-motion';
import { unknownProfileIMG } from '../../utils/img';


const Admin = ({ drivers, userInfo, nextRaceSession, userLocalTime }) => {
    const [driversLocalDB, setDriversLocalDB] = useState([]); // State to store drivers from DB
    const [raceSessions, setRaceSessions] = useState([]);
    const [sessionKey, setSessionKey] = useState(''); // State to store the inputted session key
    const [localDrivers, setLocalDrivers] = useState(drivers);
    const [savedOrder, setSavedOrder] = useState([]);
    const [simplifiedDate, setSimplifiedDate] = useState('');
    const [scrollOffset, setScrollOffset] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
    setLocalDrivers(drivers);
    }, [drivers]);

    useEffect(() => {
        const fetchRaceSessions = async () => {
            try {
                const response = await fetch(`${host}sessions/getracesessionsforyear?year=2025`);
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
            const response = await fetch(`${host}predictions/updateFinalScoreforPrediction?sessionKey=9693`, {
                method: 'POST',
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

      const handleSaveFinalRaceResultFromAdminToDB = async () => {
        console.log('Saving order:', localDrivers);
        console.log('Session Key:', sessionKey);
        console.log('URL:', `${host}predictions/saveFinalRaceResultFromAdminToDB`);
    
        try {
          const body = {
            sessionKey: sessionKey,
            predictedOrder: localDrivers,
          };
    
          // Check for missing properties in the body
          Object.entries(body).forEach(([key, value]) => {
            if (value === undefined || value === null) {
              if (key === 'user') {
                showNotification('User information is missing. Please log in again.', 'error');
                console.log('Missing user field:', key);
              } else {
                showNotification(`Missing required field: ${key}. Please try again.`, 'warning');
                console.log('Missing required field:', key);
              }
            }
          });
    
          const response = await fetch(`${host}predictions/saveFinalRaceResultFromAdminToDB`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
    
          if (response.ok) {
            const result = await response.json();
            console.log('Saved Order:', localDrivers);
            showNotification(result.message || 'Driver order saved successfully!', 'success');
            setSavedOrder(localDrivers);
          } else {
            const errorData = await response.json();
            console.log('Error saving order:', errorData);
            throw new Error(errorData.message || 'Failed to save driver order');
          }
        } catch (error) {
          console.error('Error saving order:', error);
          showNotification(error.message || 'An error occurred while saving the order', 'error');
        }
      };

      const showNotification = (message, severity) => {
        setSnackbar({ open: true, message, severity });
      };
    
      const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
      };


    return (
        <Typography>
            <Typography
                sx={{color: 'white', padding: '0px 0px 200px 0px'}}>
            <Typography>Admin</Typography>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />

            <Accordion>
            <AccordionSummary>
                <Typography>AccordionSummary</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>AccordionDetails</Typography>
            </AccordionDetails>
            </Accordion>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            
            <Accordion>
            <AccordionSummary>
                <Typography>Save Final Race Result To DB</Typography>
            </AccordionSummary>
            <AccordionDetails>
            
            <Typography sx={{ padding: '10px 20px', fontSize: '16px' }}>To save the race results, please enter the session key and click 'Submit'.</Typography>

            <TextField
                label="Session Key"
                variant="outlined"
                value={sessionKey}
                onChange={(e) => setSessionKey(e.target.value)}
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
            </AccordionDetails>
            </Accordion>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            
            <Accordion>
            <AccordionSummary>
                <Typography>Save Drivers to DB</Typography>
            </AccordionSummary>
            <AccordionDetails>
                    <Typography>
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
                </Typography>
            </AccordionDetails>
            </Accordion>

            
            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />


            <Accordion>
            <AccordionSummary>
                <Typography>Get Drivers from DB</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                <Button
                onClick={handleGetDriversFromDB}
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
            >
                Get Drivers from DB
            </Button>
                </Typography>
            </AccordionDetails>
            </Accordion>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />


            <Accordion>
            <AccordionSummary>
                <Typography>save new session to DB</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
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
                </Typography>
            </AccordionDetails>
            </Accordion>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />

            <Accordion>
            <AccordionSummary>
                <Typography>Get next session from DB</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
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
                </Typography>
            </AccordionDetails>
            </Accordion>

            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />


            <Accordion>
            <AccordionSummary>
                <Typography>Update Final Score for Prediction</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
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
                </Typography>
            </AccordionDetails>
            </Accordion>



            <Divider sx={{ margin: '10px 0', color: 'white', border: '2px solid'}} />
            <Typography>
                Save Race Results
            </Typography>
            <Typography style={{ margin: '10px 40px' }}>
                
            <TextField
                label="Session Key"
                variant="outlined"
                value={sessionKey}
                sx={{
                    marginBottom: '20px',
                    input: { color: 'white' },
                    label: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                  }}
                onChange={(e) => setSessionKey(e.target.value)}
                inputProps={{ maxLength: 4 }} // Ensures only a 4-digit key can be entered
                />
                
                <Button
                      onClick={handleSaveFinalRaceResultFromAdminToDB}
                      sx={{
                        width: '100%',
                        backgroundColor: '#FDCA40',
                        color: '#3772FF',
                        display: 'block',
                        '&:hover': {
                          backgroundColor: '#FDCA40',
                        },
                        ...(nextRaceSession.session_key === 0 ? { opacity: 0.5, cursor: 'not-allowed' } 
                          : {}),
                      }}
                    >
                      Save Final Race Results Order <i style={{ marginLeft: '5px' }} className="bi bi-floppy"></i>
                </Button>
            </Typography>

                      <Typography>
                        <Reorder.Group
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0)',
                            marginBottom: '1000px',
                            listStyle: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            marginLeft: '40px',
                            marginRight: '40px',
                            borderRadius: '15px',
                            padding: '0px',
                            position: 'relative',
                          }}
                          values={localDrivers}
                          onReorder={setLocalDrivers}
                          dragConstraints={{ top: 0, bottom: scrollOffset }}
                        >
                          {localDrivers.map((driver, index) => (
                            <Reorder.Item style={{ marginLeft: '0px' }} value={driver} key={driver.name_acronym}>
                              <Card
                                style={{
                                  display: 'flex',
                                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                  borderRadius: '8px',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  boxShadow: 'none',
                                  // borderBottom: '1px solid #ccc',
                                  marginLeft: '0px',
                                  marginTop: '5px',
                                  position: 'relative',
                                  padding: ' 0px 0px 0px 10px',
                                }}
                              >
                                <CardActions
                                  style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    padding: '0',
                                    position: 'relative',
                                  }}
                                >
                                  <Typography
                                    variant="h7"
                                    sx={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      backgroundColor: 'rgba(255, 255, 255, 0)',
                                      color: 'white',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      // marginLeft: '10px',
                                      // marginBottom: '10px',
                                      margin: '5px 0px 5px 0px',
                                      fontSize: '16px',
                                      fontWeight: 'bold',
                                      border: '1px solid #ccc',
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                
                                  <img
                                    src={driver.headshot_url || `${unknownProfileIMG}`}
                                    alt={`${driver.name_acronym} driver`}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      padding: '0px 0px 0px 10px',
                                    }}
                                  />
                                  <Typography
                                    color="white"
                                    style={{
                                      fontSize: driver.full_name.length > 20 ? '14px' : '16px',
                                      marginBottom: '10px',
                                      marginLeft: '10px',
                                    }}
                                  >
                                    {driver.full_name}
                                  </Typography>
                
                                </CardActions>
                              </Card>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </Typography>    
            </Typography>
        </Typography>
    );
};

export default Admin;
