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


const Play = ({ drivers, fetchStatus, userInfo, nextRaceSession }) => {
  const [localDrivers, setLocalDrivers] = useState(drivers);
  const [savedOrder, setSavedOrder] = useState([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setLocalDrivers(drivers);
  }, [drivers]);

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
    console.log('userInfo:', userInfo);
    console.log('nextRaceSession:', nextRaceSession);
    
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

    
  }, []);

  return (
    <div style={{ marginTop: '0px', overflow: 'auto' }}>
      <div style={{ margin: '20px 40px' }}>
        <Button variant="contained" color="primary" onClick={handleSaveOrder}>
          Save Order <i style={{ marginLeft: '15px' }} class="bi bi-floppy"></i>
        </Button>
      </div>
      <Typography color="white">Reorder drivers by dragging them up or down to create your predicted race results</Typography>

      <div>
        {/* <div>{fetchStatus}</div> */}
        <Reorder.Group
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
            marginBottom: '1000px',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: '40px',
            marginRight: '40px',
            // border: '1px solid #ccc',
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
                  backgroundColor: 'rgba(255, 255, 255, 0)', // Semi-transparent background
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'none',
                  borderBottom: '1px solid #ccc',
                  marginLeft: '0px',
                  marginTop: '10px',
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
        width: '40px', // Diameter of the circle
        height: '40px', // Diameter of the circle
        borderRadius: '50%', // Makes it a perfect circle
        backgroundColor: 'rgba(255, 255, 255, 0)', // Background color of the circle
        color: 'white', // Text color
        display: 'flex', // Enables flexbox
        alignItems: 'center', // Vertically centers the text
        justifyContent: 'center', // Horizontally centers the text
        marginLeft: '10px', // Spacing from other elements
        marginBottom: '10px', // Spacing from other elements
        fontSize: '16px', // Text size
        fontWeight: 'bold', // Text weight
        border: '1px solid #ccc', // Border around the circle
    }}
>
    #{index + 1}
</Typography>

                  <img
                    src={
                      driver.headshot_url ||
                      `${unknownProfileIMG}`
                    }
                    alt={`${driver.name_acronym} driver`}
                    style={{
                      width: '50px',
                      height: '50px',
                      padding: '0px 0px 0px 10px',
                    }}
                  />
                  <Typography color='white' style={{
                    marginBottom: '10px',
                    marginLeft: '10px',
                  }}>{driver.full_name}</Typography>
                </CardActions>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>

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
    </div>
  );
};

export default Play;
