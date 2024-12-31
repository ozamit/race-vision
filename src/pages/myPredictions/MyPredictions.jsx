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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyPredictions = ({ userInfo, raceSessions }) => {
  const [userPredictions, setUserPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

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

    const fetchResultsForAllSessions = async (predictions) => {
      const sessionKeys = predictions.map((p) => p.sessionKey);
      const results = {};

      try {
        for (const sessionKey of sessionKeys) {
        //   const response = await fetch(`${host}positions/getAllPositions?sessionKey=${sessionKey}`);
        //   if (!response.ok) {
        //     throw new Error(`Failed to fetch results for session ${sessionKey}`);
        //   }

        //   const data = await response.json();
        //   results[sessionKey] = data;
        }

        return results;
      } catch (error) {
        console.error('Error fetching results:', error);
        return {};
      }
    };

    const mergeResultsIntoPredictions = (predictions, results) => {
        return predictions.map((prediction) => {
          const sessionResults = results[prediction.sessionKey] || [];
          if (!sessionResults.length) {
            // console.error(`No results found for sessionKey: ${prediction.sessionKey}`);
          }
      
          const predictedOrderWithActual = prediction.predictedOrder.map((driver) => {
            const actualDriver = sessionResults.find((d) => String(d.driver_number) === String(driver.driver_number));
            if (!actualDriver) {
            //   console.error(`No matching driver found: ${driver.driver_number} in session: ${prediction.sessionKey}`);
            //   console.log("sessionResults:" ,sessionResults);

            }
            return {
              ...driver,
              actualPosition: actualDriver ? actualDriver.position : 'N/A',
            };
          });
      
          return { ...prediction, predictedOrder: predictedOrderWithActual };
        });
      };
      

    const initializeData = async () => {
      if (userInfo && userInfo._id) {
        setLoading(true);
        try {
          const predictions = await fetchPredictions();
          const results = await fetchResultsForAllSessions(predictions);
          const mergedData = mergeResultsIntoPredictions(predictions, results);
          setUserPredictions(mergedData);
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
    return <Typography>Please log in to view your predictions.</Typography>;
  }

  return (
    <div style={{ marginBottom: '60px', overflow: 'auto' }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          My Predictions
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : userPredictions.length > 0 ? (
          <Box>
            {userPredictions.map((userPrediction, index) => (
              <Accordion key={index} sx={{ marginBottom: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`panel-${userPrediction.sessionKey}`}>
                  <Typography variant="h6">
                    {getCircuitShortName(userPrediction.sessionKey)}
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
                        userPrediction.predictedOrder.map((driver, index) => (
                          <TableRow key={driver._id}>
                            <TableCell> {index + 1} - {driver.broadcast_name}</TableCell>
                            <TableCell>{driver.actualPosition}</TableCell>
                            <TableCell></TableCell> {/* Points logic not implemented yet */}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4}>No drivers predicted for this session.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Typography>No predictions found.</Typography>
        )}
      </Box>
    </div>
  );
};

export default MyPredictions;
