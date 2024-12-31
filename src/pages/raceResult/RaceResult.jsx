import React, { useState, useEffect } from 'react';
import { host } from '../../utils/host';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';

const MUI = {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
};


// Im already fetching raceSessions in App, can pass it and delete the fetch here 
const RaceResult = ({ drivers, fetchStatus }) => {
    const [driversForPositions, setDriversForPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [raceSessions, setRaceSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const year = 2024;

    useEffect(() => {
        const fetchRaceSessions = async () => {
            try {
                const response = await fetch(`${host}sessions/getracesessionsforyear?year=${year}`);
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
    }, [year]);

    const fetchDriversForPositions = async () => {
        if (!selectedSession) return;

        try {
            setLoading(true);
            const response = await fetch(`${host}positions/getAllPositions?sessionKey=${selectedSession}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDriversForPositions(data);
        } catch (error) {
            console.error('Error fetching drivers for positions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const handleFetchDrivers = () => {
        if (!selectedSession) {
            alert('Please select a session first!');
            return;
        }
        fetchDriversForPositions();
    };

    // Helper function to get driver details by number
    const getDriverDetailsByNumber = (driverNumber) => {
        const driver = drivers.find((d) => d.driver_number === driverNumber);
        return driver || { full_name: 'Unknown Driver', headshot_url: '', team_colour: '000000' };
    };

    return (
        <div>
            <div style={{ marginTop: '20px', marginRight: '10px', marginLeft: '10px' }}>
                <FormControl fullWidth>
                    <InputLabel>Choose Race</InputLabel>
                    <Select
                        value={selectedSession}
                        onChange={handleSessionChange}
                        label="Choose Race"
                    >
                        {raceSessions.map((session) => (
                            <MenuItem key={session.session_key} value={session.session_key}>
                                {session.circuit_short_name} - {session.country_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleFetchDrivers}
                style={{ marginTop: '10px' }}
            >
                Get Selected Race Results
            </Button>

            {loading && <Box sx={{ display: 'flex',justifyContent: 'center', marginTop: '20px' }}> 
                            <CircularProgress />
                        </Box> }

            {driversForPositions.length > 0 ? (
                <MUI.TableContainer component={MUI.Paper}>
                    {/* <h2> Race Results</h2> */}
                    <MUI.Table
                        aria-label="race results table"
                        sx={{
                            '& .MuiTableCell-root': {
                                padding: '5px 10px 0px 10px',
                                height: '50px',
                                lineHeight: '1.5',
                                fontSize: '0.875rem',
                            },
                            '& .MuiTableRow-root': {
                                height: '30px',
                            },
                        }}
                    >
                        <MUI.TableHead>
                            <MUI.TableRow>
                            </MUI.TableRow>
                        </MUI.TableHead>
                        <MUI.TableBody>
                            {driversForPositions.map((driver) => {
                                const { full_name, headshot_url } = getDriverDetailsByNumber(driver.driverNumber);
                                return (
                                    <MUI.TableRow key={driver.position}>
                                        <MUI.TableCell>{driver.position}</MUI.TableCell>
                                        <MUI.TableCell>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                }}
                                            >
                                                <img
                                                    src={
                                                        headshot_url ||
                                                        'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png'
                                                    }
                                                    alt={full_name}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                    //     border: `3px solid #${team_colour}`,
                                                    //     borderRadius: '50%',
                                                    //     objectFit: 'cover',
                                                    }}
                                                />
                                            </div>
                                        </MUI.TableCell>
                                        <MUI.TableCell>{full_name}</MUI.TableCell>
                                    </MUI.TableRow>
                                );
                            })}
                        </MUI.TableBody>
                    </MUI.Table>
                </MUI.TableContainer>
            ) : (
                !loading && <p>To view the race results, please select a race</p>
            )}
        </div>
    );
};

export default RaceResult;
