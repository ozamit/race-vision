import React, { useState, useEffect } from 'react';
import { host } from '../../utils/host';
import { unknownProfileIMG } from '../../utils/img';
import { Box, CircularProgress, Typography, Card, CardActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';

const RaceResult = ({ driversLocalDB }) => {
  const [driversForPositions, setDriversForPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [raceSessions, setRaceSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [year, setYear] = useState(2025); // Default year is 2025

  useEffect(() => {
    const fetchRaceSessions = async () => {
      try {
        const response = await fetch(`${host}sessions/getRaceSessionsForYearFromDB?year=${year}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setRaceSessions(data);
      } catch (error) {
        console.error('Error fetching race sessions:', error);
      }
    };
    fetchRaceSessions();
  }, [year]);

  const fetchDriversForPositions = async (sessionKey) => {
    if (!sessionKey) return;
    try {
      setLoading(true);
      const response = await fetch(`${host}positions/getRaceResultFromDB?sessionKey=${sessionKey}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setDriversForPositions(data.raceResult.raceResultOrder);
    } catch (error) {
      console.error('Error fetching drivers for positions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionChange = (event) => {
    const sessionKey = event.target.value;
    setSelectedSession(sessionKey);
    fetchDriversForPositions(sessionKey);
  };

  const getDriverDetailsByNumber = (driverNumber) => {
    const driver = driversLocalDB.find((d) => d.driver_number === driverNumber);
    return driver || { full_name: 'Unknown Driver', headshot_url: '', team_colour: '000000' };
  };

  return (
    <Typography sx={{ padding: 2, color: "white" }}>
      <Typography variant="h4" gutterBottom>Past Race Results</Typography>

      {/* Race Selector */}
      <Typography style={{ display: 'flex', margin: '20px' }}>
        <Typography style={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'white' }}>Select Race</InputLabel>
            <Select
              value={selectedSession}
              onChange={handleSessionChange}
              label="Choose Race"
              sx={{
                '& .MuiInputBase-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFFFFF',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FFFFFF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FDCA40',
                },
                '& .MuiFormLabel-root': {
                  color: '#FFFFFF',
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: '#FDCA40',
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
                '& .MuiSelect-icon': {
                  color: '#FFFFFF',
                },
              }}
            >
              {raceSessions
                .filter((session) => new Date(session.date_start) < new Date())
                .map((session) => (
                  <MenuItem key={session.session_key} value={session.session_key}>
                    {session.circuit_short_name}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Typography>
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      {driversForPositions.length > 0 ? (
        <motion.div
          key={selectedSession}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '90%', margin: '20px auto', paddingBottom: '150px' }}
        >
          {driversForPositions.map((driver, index) => {
            const { full_name, headshot_url } = getDriverDetailsByNumber(driver.driver_number);
            return (
              <motion.div
                key={driver.position}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '8px',
                    backdropFilter: 'blur(3px)',
                    marginBottom: '5px',
                  }}
                >
                  <CardActions sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
                    <Typography
                      sx={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '1px solid white',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px',
                        marginBottom: '10px',
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </Typography>
                    <img
                      src={headshot_url || unknownProfileIMG}
                      alt={full_name}
                      style={{ width: '60px', height: '60px', marginBottom: '-10px' }}
                    />
                    <Typography sx={{ marginLeft: '10px', color: 'white', marginBottom: '10px' }}>
                      {full_name}
                    </Typography>
                  </CardActions>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        !loading && (
          <Typography sx={{ color: 'white', margin: '15px' }}>
            To view results, select a race from the dropdown.
          </Typography>
        )
      )}
    </Typography>
  );
};

export default RaceResult;
