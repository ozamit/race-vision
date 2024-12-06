import React, { useState, useEffect } from 'react';
import { host } from '../../utils/host';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper 
} from '@mui/material';

const MUI = { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper 
};

const RaceResult = () => {
    const [driversForPositions, setDriversForPositions] = useState([]);
    const sessionKey = 9606; // Provided session key

    useEffect(() => {
        const fetchDriversForPositions = async () => {
            try {
                const response = await fetch(`${host}positions/getAllPositions?sessionKey=${sessionKey}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setDriversForPositions(data);
            } catch (error) {
                console.error('Error fetching drivers for positions:', error);
            }
        };

        fetchDriversForPositions();
    }, []);

    return (
        <div>
            <h2>Race Results for Session {sessionKey} </h2>
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
                <p>Loading...</p>
            )}
        </div>
    );
};

export default RaceResult;
