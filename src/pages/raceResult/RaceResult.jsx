import React, { useState, useEffect } from 'react';
import { host } from '../../utils/host';
import { unknownProfileIMG } from '../../utils/img';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

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
    Typography,
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

// RaceResult component
const RaceResult = ({ drivers, driversLocalDB, fetchStatus }) => {
    const [driversForPositions, setDriversForPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [raceSessions, setRaceSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [year, setYear] = useState(2024); // Default year is 2024

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
            const response = await fetch(`${host}positions/getRaceResultFromDB?sessionKey=${selectedSession}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDriversForPositions(data.raceResult.raceResultOrder);
        } catch (error) {
            console.error('Error fetching drivers for positions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
        setRaceSessions([]); // Clear sessions when year changes
        setSelectedSession(''); // Reset selected session
    };

    const handleFetchDrivers = () => {
        if (!selectedSession) {
            alert('Please select a session first!');
            return;
        }
        fetchDriversForPositions();
    };

    const getDriverDetailsByNumber = (driverNumber) => {
        const driver = driversLocalDB.find((d) => d.driver_number === driverNumber);
        return driver || { full_name: 'Unknown Driver', headshot_url: '', team_colour: '000000' };
    };

    return (
        <div>
<div style={{ display: 'flex', margin: '20px' }}>
    {/* Year Selector */}
    <div style={{ flex: 0.3, marginRight: '20px' }}>
        <FormControl fullWidth color='white'>
            <InputLabel sx={{ color: 'white' }}>Select Year</InputLabel>
            <Select
                value={year}
                onChange={handleYearChange}
                label="Year"
                sx={{
                    '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
                        borderRadius: '4px',       // Rounded corners
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF',    // Border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF',    // Hover border color
                    },
                    '& .MuiFormLabel-root': {
                        color: '#FFFFFF',          // Label color
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: '#FFFFFF',          // Focused label color
                    },
                    '& .MuiInputBase-input': {
                        color: '#FFFFFF',             // Text color
                    },
                    '& .MuiSelect-icon': {
                        color: '#FFFFFF', // Color the dropdown arrow white
                    },
                }}
            >
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
            </Select>
        </FormControl>
    </div>

    {/* Race Selector */}
    <div style={{ flex: 0.7 }}>
        <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Select Race</InputLabel>
            <Select
                value={selectedSession}
                onChange={handleSessionChange}
                label="Choose Race"
                sx={{
                    '& .MuiInputBase-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color
                        borderRadius: '4px',       // Rounded corners
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF',    // Border color
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#FFFFFF',    // Hover border color
                    },
                    '& .MuiFormLabel-root': {
                        color: '#FFFFFF',          // Label color
                    },
                    '& .MuiFormLabel-root.Mui-focused': {
                        color: '#FFFFFF',          // Focused label color
                    },
                    '& .MuiInputBase-input': {
                        color: '#FFFFFF',             // Text color
                    },
                    '& .MuiSelect-icon': {
                        color: '#FFFFFF', // Color the dropdown arrow white
                    },
                }}
            >
                {raceSessions.map((session) => (
                    <MenuItem key={session.session_key} value={session.session_key}>
                        {session.circuit_short_name} - {session.country_name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </div>
</div>



<Button
    variant="contained"
    onClick={handleFetchDrivers}
    sx={{
        width: '90%', // 90% width of the container
        backgroundColor: '#FDCA40', // Button color
        color: '#3772FF', // Text color
        margin: '10px auto', // Margin to center the button horizontally and spacing on top
        display: 'flex', // Use flexbox to align text and icon
        alignItems: 'center', // Vertically center the text and icon
        justifyContent: 'center', // Horizontally center the text and icon
        '&:hover': {
            backgroundColor: '#FDCA40', // Slightly lighter black on hover
        },
    }}
>
    See Race Results <ArrowCircleRightIcon sx={{ marginLeft: '8px' }} />
</Button>



            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </Box>
            )}

{driversForPositions.length > 0 ? (
    <Box
        sx={{
            width: '90%',
            margin: '20px auto', // Center horizontally
            paddingBottom: '150px', // Ensure 50px space from bottom
        }}
    >
        <MUI.TableContainer
            component={Paper}
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
            }}
        >
            <MUI.Table
    sx={{
        width: '100%', // Ensures table spans the full width of the container
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }}
>
    <MUI.TableHead>
        <MUI.TableRow
            sx={{
                borderBottom: '2px solid white', // Thicker border for header
            }}
        >
            <MUI.TableCell
                sx={{ color: 'white', borderColor: 'white', textAlign: 'center' }}
            >
                Position
            </MUI.TableCell>
            <MUI.TableCell
                sx={{ color: 'white', borderColor: 'white', textAlign: 'center' }}
            >
                Driver
            </MUI.TableCell>
            <MUI.TableCell
                sx={{ color: 'white', borderColor: 'white', textAlign: 'center' }}
            >
                
            </MUI.TableCell>
        </MUI.TableRow>
    </MUI.TableHead>
    <MUI.TableBody>
        {driversForPositions.map((driver) => {
            const { full_name, headshot_url } = getDriverDetailsByNumber(driver.driver_number);
            return (
                <MUI.TableRow
                    key={driver.position}
                    sx={{
                        borderBottom: '1px solid white', // Divider line between rows
                    }}
                >
                    <MUI.TableCell
                        sx={{
                            width: '10px', // Diameter of the circle
                            height: '10px', // Diameter of the circle
                            borderRadius: '50%', // Makes it a perfect circle
                            backgroundColor: 'rgba(255, 255, 255, 0)', // Background color of the circle
                            color: 'white', // Text color
                            display: 'flex', // Enables flexbox
                            alignItems: 'center', // Vertically centers the text
                            justifyContent: 'center', // Horizontally centers the text
                            // marginRight: '10px', // Spacing from other elements
                            marginLeft: '10px', // Spacing from other elements
                            // marginBottom: '-10px', // Spacing from other elements
                            marginTop: '15px', // Spacing from other elements
                            fontSize: '16px', // Text size
                            fontWeight: 'bold', // Text weight
                            border: '1px solid #ccc', // Border around the circle
                        }}
                    >
                        {driver.position}
                    </MUI.TableCell>
                    <MUI.TableCell
                        sx={{
                            // display: 'flex', // Enables flexbox
                            textAlign: 'center', // Aligns image in the center
                        }}
                    >
                        <img
                            src={headshot_url || `${unknownProfileIMG}`}
                            alt={full_name}
                            style={{
                                width: '40px',
                                height: '40px',
                            }}
                        />
                    </MUI.TableCell>
                    <MUI.TableCell
                        sx={{
                            color: 'white',
                            textAlign: 'center', // Centers the name text
                        }}
                    >
                        {full_name}
                    </MUI.TableCell>
                </MUI.TableRow>
            );
        })}
    </MUI.TableBody>
</MUI.Table>

        </MUI.TableContainer>
    </Box>
) : (
    !loading && (
        <Typography sx={{ color: 'white', margin: '15px 15px 15px 15px', fontSize: '20px' }}>
            To view results select a race and click the yellow button 
        </Typography>
    )
)}

        </div>
    );
};

export default RaceResult;
