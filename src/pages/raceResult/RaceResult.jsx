import React, { useState, useEffect } from 'react';
import { host } from '../../utils/host';
import { unknownProfileIMG } from '../../utils/img';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Box, Button, CircularProgress, Typography, Card, CardActions,FormControl,InputLabel,Select,MenuItem } from '@mui/material';

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
          <FormControl fullWidth color="white">
            <InputLabel sx={{ color: 'white' }}>Select Year</InputLabel>
            <Select
              value={year}
              onChange={handleYearChange}
              label="Year"
              sx={{
                '& .MuiInputBase-root': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#FFFFFF' },
                '& .MuiFormLabel-root.Mui-focused': { color: '#FFFFFF' },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiSelect-icon': { color: '#FFFFFF' },
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
                '& .MuiInputBase-root': { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#FFFFFF' },
                '& .MuiFormLabel-root.Mui-focused': { color: '#FFFFFF' },
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiSelect-icon': { color: '#FFFFFF' },
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
          width: '90%',
          backgroundColor: '#FDCA40',
          color: '#3772FF',
          margin: '10px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        <Box sx={{ width: '90%', margin: '20px auto', paddingBottom: '150px' }}>
          {driversForPositions.map((driver, index) => {
            const { full_name, headshot_url } = getDriverDetailsByNumber(driver.driver_number);
            return (
              <Card
                key={driver.position}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                //   borderBottom: '1px solid white',
                  borderRadius: '8px',
                  marginBottom: '5px',
                }}
              >
                <CardActions sx={{ display: 'flex', alignItems: 'center', padding: '10px 10px 0px 10px',}}>
                  <Typography
                    sx={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'transparent',
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
                    src={headshot_url || `${unknownProfileIMG}`}
                    alt={full_name}
                    style={{ width: '60px', height: '60px', marginBottom: '-10px',}}
                  />

                  <Typography sx={{ marginLeft: '10px', color: 'white',marginBottom: '10px', }}>{full_name}</Typography>
                </CardActions>
              </Card>
            );
          })}
        </Box>
      ) : (
        !loading && (
          <Typography sx={{ color: 'white', margin: '15px' }}>
            To view results, select a race and click the yellow button.
          </Typography>
        )
      )}
    </div>
  );
};

export default RaceResult;
