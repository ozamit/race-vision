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
    Button 
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
    Button 
};

const RaceResult = () => {
    const [driversForPositions, setDriversForPositions] = useState([]);
    const [raceSessions, setRaceSessions] = useState([]); // State for race sessions
    const [selectedSession, setSelectedSession] = useState(''); // State for selected session
    const [loading, setLoading] = useState(false); // Loading state for fetching drivers
    const sessionKey = 9606; // Default session key (for fallback or initial state)
    const year = 2024; // Year for fetching race sessions

    // New functionality: Fetch race sessions for a year
    useEffect(() => {
        const fetchRaceSessions = async () => {
            try {
                const response = await fetch(`${host}sessions/getracesessionsforyear?year=${year}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setRaceSessions(data);
                console.log('Race Sessions:', data); // Log the sessions to the console
            } catch (error) {
                console.error('Error fetching race sessions:', error);
            }
        };

        fetchRaceSessions();
    }, []);

    // Function to fetch drivers for positions
    const fetchDriversForPositions = async () => {
        if (!selectedSession) return; // Don't fetch unless a session is selected

        try {
            setLoading(true); // Set loading to true when request starts
            const response = await fetch(`${host}positions/getAllPositions?sessionKey=${selectedSession}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setDriversForPositions(data); // Store the fetched data
            setLoading(false); // Set loading to false after receiving data
        } catch (error) {
            console.error('Error fetching drivers for positions:', error);
            setLoading(false); // Ensure loading is false on error
        }
    };

    // Handle session change in the dropdown
    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
        console.log('Selected Session:', event.target.value);
    };

    // Handle the button click to fetch the drivers for the selected session
    const handleFetchDrivers = () => {
        if (!selectedSession) {
            alert('Please select a session first!');
            return;
        }

        // Trigger the fetch drivers request when the button is clicked
        setLoading(true);
        fetchDriversForPositions(); // Call fetchDriversForPositions when the button is clicked
    };

    return (
        <div>
            {/* Dropdown for selecting race sessions */}
            <FormControl fullWidth>
                <InputLabel>Choose a Race Session</InputLabel>
                <Select
                    value={selectedSession}
                    onChange={handleSessionChange}
                    label="Choose a Race Session"
                >
                    {raceSessions.map((session) => (
                        <MenuItem 
                            key={session.session_key} 
                            value={session.session_key}
                        >
                            {session.circuit_short_name} - {session.country_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Button to fetch drivers */}
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleFetchDrivers}
                style={{ marginTop: '10px' }}
            >
                Fetch Drivers for Selected Session
            </Button>

            {/* Loading state */}
            {loading && <p>Loading...</p>}

            {/* Original Table for Drivers */}
            <h2>Race Results for Session {selectedSession}</h2>
            {driversForPositions.length > 0 ? (
                <MUI.TableContainer component={MUI.Paper}>
                    <MUI.Table aria-label="race results table">
                        <MUI.TableHead>
                            <MUI.TableRow>
                                <MUI.TableCell><strong>Position</strong></MUI.TableCell>
                                <MUI.TableCell><strong>Driver Number</strong></MUI.TableCell>
                            </MUI.TableRow>
                        </MUI.TableHead>
                        <MUI.TableBody>
                            {driversForPositions.map((driver) => (
                                <MUI.TableRow key={driver.position}>
                                    <MUI.TableCell>{driver.position}</MUI.TableCell>
                                    <MUI.TableCell>{driver.driverNumber}</MUI.TableCell>
                                </MUI.TableRow>
                            ))}
                        </MUI.TableBody>
                    </MUI.Table>
                </MUI.TableContainer>
            ) : (
                !loading && <p>No race results available. Please fetch data.</p>
            )}
        </div>
    );
};

export default RaceResult;
