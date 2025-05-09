import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Reorder } from 'framer-motion';
import { host } from '../../utils/host';
import { unknownProfileIMG } from '../../utils/img';

const Play = ({ drivers, userInfo, nextRaceSession, userLocalTime }) => {
  const [localDrivers, setLocalDrivers] = useState(drivers);
  const [savedOrder, setSavedOrder] = useState([]);
  const [simplifiedDate, setSimplifiedDate] = useState('');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Function to simplify the date format
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const simplifiedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const simplifiedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${simplifiedDate} ${simplifiedTime}`; // Example: 12/08/2024 01:00 PM
  };

    // State to store the countdown time
    const [countdown, setCountdown] = useState("");
  
    useEffect(() => {
      if (!userLocalTime) return;
  
      // Convert userLocalTime (formatted as dd/mm/yyyy HH:mm) to a Date object
      const [datePart, timePart] = userLocalTime.split(" ");
      const [day, month, year] = datePart.split("/").map(Number);
      const [hours, minutes] = timePart.split(":").map(Number);
      
      const raceTime = new Date(year, month - 1, day, hours, minutes); // Month is zero-based in JS Dates
  
      const updateCountdown = () => {
        const now = new Date();
        const tenMinutesBeforeRace = new Date(raceTime.getTime() - 10 * 60 * 1000); // Subtract 10 minutes
      
        const diffMs = tenMinutesBeforeRace - now;
      
        if (diffMs <= 0) {
          setCountdown("Predictions are closed!");
          return;
        }
      
        const daysLeft = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diffMs % (1000 * 60)) / 1000);
      
        setCountdown(`${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`);
      };    
      
      // Initial call
      updateCountdown();
  
      // Update countdown every second
      const interval = setInterval(updateCountdown, 1000);
  
      return () => clearInterval(interval);
    }, [userLocalTime]);


  useEffect(() => {
    setLocalDrivers(drivers);
  }, [drivers]);

  useEffect(() => {
    if (nextRaceSession?.date_start) {
      setSimplifiedDate(formatDate(nextRaceSession.date_start));
      console.log(simplifiedDate)
    }
  }, [nextRaceSession]);

  const handleSaveOrder = async () => {
    console.log('Saving order:', localDrivers);
    console.log('URL:', `${host}predictions/savePredictions`);

    try {
      const body = {
        user: userInfo?._id,
        sessionKey: nextRaceSession?.session_key,
        meetingKey: nextRaceSession?.meeting_key,
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

      const response = await fetch(`${host}predictions/savePredictions`, {
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

  useEffect(() => {
    // console.log('userInfo:', userInfo);
    console.log('nextRaceSession:', nextRaceSession);

    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Typography style={{ marginTop: '0px', overflow: 'auto' }}>
{nextRaceSession.session_key === 0 ? (
  <Typography color="white" style={{ fontWeight: 'bold', margin: '15px' }}>
    We're experiencing a technical issue retrieving the next race. Please check back later.
  </Typography>
) : (
  <Typography>
    <Typography color="white" style={{ fontWeight: 'bold', marginTop: '20px' }}>
    Submit your prediction before the deadline:
    </Typography>
    <Typography color="white" style={{ fontWeight: 'bold' }}>
      {countdown}
    </Typography>


  </Typography>
  
)}
      <Typography style={{ margin: '10px 40px' }}>
        <Button
          onClick={handleSaveOrder}
          disabled={nextRaceSession.session_key === 0 || countdown === "Predictions are closed!"} // Disable if session_key is 0 OR countdown has ended
          sx={{
            width: '100%',
            backgroundColor: '#FDCA40',
            color: '#3772FF',
            display: 'block',
            '&:hover': {
              backgroundColor: '#FDCA40',
            },
            ...(nextRaceSession.session_key === 0 || countdown === "Predictions are closed!" 
              ? { opacity: 0.5, cursor: 'not-allowed' } 
              : {}),
          }}
        >
          Save Order <i style={{ marginLeft: '5px' }} className="bi bi-floppy"></i>
        </Button>
      </Typography>
      
      <Typography color="white" style={{ margin: '15px' }}>
        Reorder drivers by dragging them up or down to create your predicted race results
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
            <Reorder.Item
            value={driver}
            key={driver.name_acronym}
            style={{ marginLeft: '0px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
          
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Typography>
  );
};

export default Play;
