import React, { useEffect, useState } from 'react';
import { host } from '../../utils/host';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    return <Typography style={{ marginTop: '40px' }}>Please log in to view your predictions and score.</Typography>;
  }

  return (
    <div style={{ marginBottom: '60px', overflow: 'auto' }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          My Predictions
        </Typography>
        {loading ? (
        //   <Typography>Loading...</Typography>
          <Box sx={{ display: 'flex',justifyContent: 'center', marginTop: '20px' }}> 
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
                <Accordion key={index} sx={{ marginBottom: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`panel-${userPrediction.sessionKey}`}>
                    <Typography variant="h6">
                      {getCircuitShortName(userPrediction.sessionKey)} | Score: {totalPoints}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>My Prediction</strong></TableCell>
                          <TableCell><strong>Actual</strong></TableCell>
                          <TableCell><strong>Points</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userPrediction.predictedOrder.length > 0 ? (
                          userPrediction.predictedOrder.map((driver, positionIndex) => {
                            const actualDriver = raceResult ? raceResult.raceResultOrder.find(d => d.driver_number === driver.driver_number) : null;
                            const actualPosition = actualDriver ? actualDriver.position : 'N/A';

                            // Calculate gap and points
                            const predictedPosition = positionIndex + 1;
                            const gap = actualPosition !== 'N/A' ? Math.abs(predictedPosition - actualPosition) : 'N/A';
                            const points = gap !== 'N/A' ? 20 - gap : 'N/A';

                            return (
                              <TableRow key={driver._id}>
                                <TableCell>{predictedPosition} - {driver.broadcast_name}</TableCell>
                                <TableCell>{actualPosition}</TableCell>
                                <TableCell>{points}</TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3}>No drivers predicted for this session.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
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
