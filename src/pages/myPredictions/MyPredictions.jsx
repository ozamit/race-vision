import React, { useEffect, useState } from 'react';
import { host } from '../../utils/host';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardActions,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { unknownProfileIMG } from '../../utils/img';


const MyPredictions = ({ userInfo, raceSessions }) => {
  const [userPredictions, setUserPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch race result for a given sessionKey
  const fetchRaceResult = async (sessionKey) => {
    try {
      const response = await fetch(`${host}positions/getRaceResultFromDB?sessionKey=${sessionKey}`);

      if (!response.ok) {
        throw new Error('Failed to fetch race result');
      }

      const data = await response.json();
      return data.raceResult; // Assuming the response contains the 'raceResult'
    } catch (error) {
      console.error('Error fetching race result:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch(`${host}predictions/getPredictionsByUserId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userInfo._id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch predictions');
        }

        const data = await response.json();
        return data.predictions;
      } catch (error) {
        console.error('Error fetching predictions:', error);
        return [];
      }
    };

    const initializeData = async () => {
      if (userInfo && userInfo._id) {
        setLoading(true);
        try {
          const predictions = await fetchPredictions();
          setUserPredictions(predictions);

          // Fetch race results for each session
          const raceResultsData = {};
          for (const prediction of predictions) {
            const sessionKey = prediction.sessionKey;
            if (!raceResultsData[sessionKey]) {
              const raceResult = await fetchRaceResult(sessionKey);
              if (raceResult) {
                raceResultsData[sessionKey] = raceResult;
              }
            }
          }
          setRaceResults(raceResultsData);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeData();
  }, [userInfo]);

  const getCircuitShortName = (sessionKey) => {
    const matchingSession = raceSessions.find((session) => session.session_key === sessionKey);
    return matchingSession ? matchingSession.circuit_short_name : 'Unknown Circuit';
  };

  if (!userInfo || !userInfo._id) {
    return <Typography color='white' style={{ marginTop: '40px' }}>Please log in to view your predictions and score.</Typography>;
  }

  return (
    <div style={{ marginBottom: '60px', overflow: 'auto' }}>
      <Box sx={{ padding: 1 }}>
        <Typography sx={{ color: 'white', margin: '15px', fontSize: '24px' }}>
          My Predictions
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress />
          </Box>
        ) : userPredictions.length > 0 ? (
          <Box>
            {userPredictions.map((userPrediction, index) => {
              const raceResult = raceResults[userPrediction.sessionKey];
              let totalPoints = 0;

              if (raceResult) {
                totalPoints = userPrediction.predictedOrder.reduce((sum, driver, positionIndex) => {
                  const actualDriver = raceResult.raceResultOrder.find(d => d.driver_number === driver.driver_number);
                  const actualPosition = actualDriver ? actualDriver.position : null;

                  if (actualPosition !== null) {
                    const predictedPosition = positionIndex + 1;
                    const gap = Math.abs(predictedPosition - actualPosition);
                    const points = 20 - gap;
                    return sum + points;
                  }

                  return sum;
                }, 0);
              }

              return (
                <Accordion
                  key={index}
                  sx={{
                    marginBottom: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent background
                    borderRadius: '10px', // Rounded corners
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`panel-${userPrediction.sessionKey}`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent background
                      color: 'white', // Text color
                      borderRadius: '50px', // Rounded corners for the summary
                      '& .MuiSvgIcon-root': {
                        color: 'white', // Change icon color to white
                      },
                    }}
                  >
                    <Typography variant="h6">
                      {getCircuitShortName(userPrediction.sessionKey)} | Score: {totalPoints}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '15px',
                      margin: '20px 10px 20px 10px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      listStyle: 'none',
                      flexDirection: 'column',
                      padding: '0px',
                      position: 'relative',
                    }}>
                    {userPrediction.predictedOrder.length > 0 ? (
                      userPrediction.predictedOrder.map((driver, positionIndex) => {
                        const actualDriver = raceResult ? raceResult.raceResultOrder.find(d => d.driver_number === driver.driver_number) : null;
                        const actualPosition = actualDriver ? actualDriver.position : 'N/A';

                        // Calculate gap and points
                        const predictedPosition = positionIndex + 1;
                        const gap = actualPosition !== 'N/A' ? Math.abs(predictedPosition - actualPosition) : 'N/A';
                        const points = gap !== 'N/A' ? 20 - gap : 'N/A';

                  return (

                        <Card key={driver._id}
                        style={{
                          display: 'flex',
                          width: '100%',
                          height: 70, // Ensure the Card has a fixed or dynamic height
                          backgroundColor: 'transparent',
                          alignItems: 'stretch', // Allows children to stretch and fill the height
                          boxShadow: 'none',
                          borderBottom: '1px solid #ccc',
                          marginLeft: '0px',
                          marginTop: '0px',
                          position: 'relative',
                          padding: '0px',
                        }}
                        >
                      <img
                        src={driver.headshot_url || `${unknownProfileIMG}`}
                        alt={`${driver.name_acronym} driver`}
                        style={{
                          width: '65px',
                          height: '65px',
                          padding: '5px 10px 0px 0px',
                        }}
                      />
                      
                      {/* <Typography color="white" sx={{ fontSize: '12px' }}>{driver.last_name}</Typography> */}

                      <Typography sx={{display: 'flex', flexDirection: 'column' ,alignItems: 'center', justifyContent: 'center', lineHeight: '0.5'}}>
                      <Typography sx={{display: 'flex', flexDirection: 'row' ,alignItems: 'center', justifyContent: 'center'}}>
                        <Typography sx={{ fontSize:'12px', color: 'white', display: 'flex'}}>Prediction</Typography>
                        {/* <SwapHorizIcon style={{ fontSize:'36px', color: 'white', padding: '0px 10px'}}/> */}
                        <i class="bi bi-arrows-expand-vertical" style={{ fontSize:'26px', color: 'white', padding: '0px 10px'}}></i>
                        <Typography sx={{fontSize:'12px',color: 'white', display: 'flex'}}>Actual</Typography>
                      </Typography>
                      <Typography sx={{display: 'flex', flexDirection: 'row' ,alignItems: 'center', justifyContent: 'center', paddingLeft: '20px'}}>
                      <Typography //prediction positon
                                sx={{
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  backgroundColor: '#3772FF',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  border: '1px solid #3772FF',
                                  marginRight: '10px',
                                }}
                              >
                                {predictedPosition}
                              </Typography>
                              <Typography //prediction positon
                                sx={{
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  backgroundColor: '#FDCA40',
                                  color: 'black',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  border: '1px solid #FDCA40',
                                  marginLeft: '10px',
                                }}
                              >
                                {actualPosition}
                              </Typography>
                      </Typography>
                      </Typography>

                          {/* <Typography sx={{display: 'flex', flexDirection: 'column' ,alignItems: 'center', justifyContent: 'center'}}> */}
                          {/* <Typography sx={{ fontSize:'12px', color: 'white', display: 'flex', margin: '5px'}}>Prediction</Typography> */}
                          {/* <Typography //prediction positon
                                sx={{
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(255, 255, 255, 0)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginLeft: '0px',
                                  marginBottom: '10px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: '1px solid #ccc',
                                }}
                              >
                                {predictedPosition}
                              </Typography> */}
                              {/* </Typography> */}
                          {/* <i class="bi bi-arrows-expand-vertical" style={{ fontSize:'26px', color: 'white', margin: '5px' }}></i> */}
                          {/* <Typography sx={{display: 'flex', flexDirection: 'column' ,alignItems: 'center', justifyContent: 'center'}}> */}
                          {/* <Typography sx={{fontSize:'12px',color: 'white', display: 'flex', margin: '5px'}}>Actual</Typography> */}
                          {/* <Typography //prediction positon
                                sx={{
                                  width: '25px',
                                  height: '25px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(255, 255, 255, 0)',
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginLeft: '0px',
                                  marginBottom: '10px',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  border: '1px solid #ccc',
                                }}
                              >
                                {actualPosition}
                              </Typography> */}
                              {/* </Typography> */}
                            {/* <Typography //Actual positon
                                          sx={{
                                            width: '25px',
                                            height: '25px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 255, 255, 0)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginLeft: '0px',
                                            marginBottom: '10px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            border: '1px solid #ccc',
                                          }}
                                        >
                                          {actualPosition}
                                        </Typography> */}
                              {/* <Typography color="white">Actual: {actualPosition}</Typography> */}
                              <Typography color="white"
                                style={{
                                  margin: '0px 0px 0px 30px',
                                  height: '100%', // Take full height of the Card
                                  width: '100%', // Optionally make it take full width
                                  display: 'flex', // Ensure content alignment works properly
                                  alignItems: 'center', // Center content vertically
                                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                  padding: '0px 10px 0px 20px', // Optional padding
                                }}                             
                              >Points: {points}</Typography>
                          </Card>
                        );
                      })
                    ) : (
                      <Typography>No drivers predicted for this session.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ) : (
          <Typography>No predictions found.</Typography>
        )}
      </Box>
    </div>
  );
};

export default MyPredictions;
