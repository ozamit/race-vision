import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { host } from '../../utils/host';
import { unknownProfileIMG } from '../../utils/img';

const UserPredictions = ({ raceSessions }) => {
  const location = useLocation();
  const { userId } = location.state || {};

  const [userInfo, setUserInfo] = useState(null);
  const [userPredictions, setUserPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUserInfo = async () => {
        if (!userId) return;
  
        try {
          const response = await fetch(`${host}users/getOneUser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });
  
          if (!response.ok) throw new Error('Failed to fetch user info');
  
          const user = await response.json(); // user is returned directly
          setUserInfo(user);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };
  
      fetchUserInfo();
  

    const fetchPredictions = async () => {
      try {
        const response = await fetch(`${host}predictions/getPredictionsByUserId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error('Failed to fetch predictions');
        const data = await response.json();
        return data.predictions;
      } catch (error) {
        console.error('Error fetching predictions:', error);
        return [];
      }
    };

    const fetchRaceResult = async (sessionKey) => {
      try {
        const res = await fetch(`${host}positions/getRaceResultFromDB?sessionKey=${sessionKey}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        return data.raceResult;
      } catch (e) {
        console.error('Error fetching race result:', e);
        return null;
      }
    };

    const init = async () => {
      if (!userId) return;
      setLoading(true);
      await fetchUserInfo();
      const predictions = await fetchPredictions();
      setUserPredictions(predictions);

      const results = {};
      for (const prediction of predictions) {
        const sessionKey = prediction.sessionKey;
        if (!results[sessionKey]) {
          const raceResult = await fetchRaceResult(sessionKey);
          if (raceResult) {
            results[sessionKey] = raceResult;
          }
        }
      }
      setRaceResults(results);
      setLoading(false);
    };

    init();
  }, [userId]);

  const getCircuitShortName = (sessionKey) => {
    const session = raceSessions.find((s) => s.session_key === sessionKey);
    return session ? session.circuit_short_name : 'Unknown Circuit';
  };

  if (!userId) {
    return <Typography color="white" style={{ marginTop: '40px' }}>No user selected.</Typography>;
  }

  return (
    <Box sx={{ padding: 1 }}>

<Button 
  variant="contained" 
  startIcon={<ArrowBackIosIcon />} 
  sx={{ 
    backgroundColor: '#FDCA40', 
    color: '#3a86ff', 
    position: 'relative', 
    left: '-80px',  
    top: '-40px',  
    minWidth: '80px', // Avoids shrinking
    display: 'inline-flex', // Ensures proper alignment
    alignItems: 'center', // Ensures icon + text align properly
    justifyContent: 'center', // Centers the content
    zIndex: 10 // Ensures it's above overlapping elements
  }} 
  onClick={() => navigate(-1)}
>
  Back To League Table
</Button>

      <Typography sx={{ color: 'white', margin: '15px', fontSize: '24px' }}>
        {userInfo ? `${userInfo.name}'s Predictions` : 'Loading Predictions...'}
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      ) : userPredictions.length > 0 ? (
        <Box>
          {userPredictions.map((prediction, index) => {
            const result = raceResults[prediction.sessionKey];
            let totalPoints = 0;

            if (result) {
              totalPoints = prediction.predictedOrder.reduce((sum, driver, idx) => {
                const actual = result.raceResultOrder.find(d => d.driver_number === driver.driver_number);
                const actualPos = actual ? actual.position : null;
                if (actualPos === null || actualPos === 0) return sum;
                return sum + (20 - Math.abs((idx + 1) - actualPos));
              }, 0);
            }

            return (
              <Accordion key={index} sx={{ mb: 1, backgroundColor: 'rgba(255,255,255,0)', borderRadius: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: 2,
                    '& .MuiSvgIcon-root': { color: 'white' },
                  }}
                >
                  <Typography sx={{ fontSize: '18px' }}>
                    {getCircuitShortName(prediction.sessionKey)} | Score: {totalPoints}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
  sx={{
    backgroundColor: 'transparent',
    borderRadius: '10px',
    margin: '20px 10px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    listStyle: 'none',
    flexDirection: 'column',
    padding: '0px',
    overflow: 'auto',
  }}
>
  <Card
    style={{
      display: 'flex',
      width: '100%',
      height: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '5px',
      alignItems: 'stretch',
      boxShadow: 'none',
      marginTop: '0px',
      padding: '0px',
      justifyContent: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backdropFilter: 'blur(30px)',
    }}
  >
    <Typography
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px 30px 0px 0px',
      }}
    >
      <Chip
        label="Prediction"
        sx={{
          fontSize: '12px',
          backgroundColor: '#3772FF',
          color: 'white',
        }}
      />
      <i
        className="bi bi-arrows-expand-vertical"
        style={{ fontSize: '26px', color: 'white', padding: '0px 10px' }}
      />
      <Chip
        label="Actual"
        sx={{
          fontSize: '12px',
          backgroundColor: '#FDCA40',
          color: 'black',
        }}
      />
    </Typography>
  </Card>

  {prediction.predictedOrder.map((driver, posIdx) => {
    const actualDriver = result?.raceResultOrder.find(
      d => d.driver_number === driver.driver_number
    );
    const actualPos = actualDriver ? actualDriver.position : 'N/A';
    const predictedPos = posIdx + 1;
    const gap =
      actualPos !== 'N/A' ? Math.abs(predictedPos - actualPos) : 'N/A';
    const points =
      actualPos === 0 ? 0 : gap !== 'N/A' ? 20 - gap : 'N/A';

    return (
      <Card
        key={driver._id}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          width: '100%',
          margin: '3px 0px',
          height: 70,
          alignItems: 'stretch',
          justifyContent: 'space-between',
          boxShadow: 'none',
          position: 'relative',
          padding: '0px',
        }}
      >
        <Typography
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 70,
          }}
        >
          <Typography
            sx={{
              color: 'black',
              transform: 'rotate(270deg)',
              transformOrigin: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              height: '30px',
              width: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0px 0px 0px -20px',
              padding: '0px',
            }}
          >
            {driver.name_acronym}
          </Typography>
          <img
            src={driver.headshot_url || unknownProfileIMG}
            alt={driver.name_acronym}
            style={{
              width: '65px',
              height: '65px',
              padding: '0px',
              margin: '0px 0px 0px -10px',
            }}
          />
        </Typography>

        <Typography
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '0.5',
          }}
        >
          <Typography
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '20px',
              margin: '0px 0px 0px -30px',
            }}
          >
            <Typography
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#3772FF',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                border: '1px solid #3772FF',
                marginRight: '10px',
              }}
            >
              {predictedPos}
            </Typography>
            <i
              className="bi bi-arrows-expand-vertical"
              style={{ fontSize: '14px', color: 'white' }}
            />
            <Typography
              sx={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FDCA40',
                color: 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                border: '1px solid #FDCA40',
                marginLeft: '10px',
              }}
            >
              {actualPos}
            </Typography>
          </Typography>
        </Typography>

        <Typography
          color="black"
          style={{
            margin: '0px',
            height: '100%',
            width: '100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            padding: '0px',
            textAlign: 'center',
          }}
        >
          <Typography>Score: {points}</Typography>
          {points > 18 && (
            <Typography style={{ fontSize: '20px', marginTop: '-5px' }}>
              🔥
            </Typography>
          )}
          {points >= 1 && points <= 6 && (
            <Typography style={{ fontSize: '20px', marginTop: '-5px' }}>
              🥶
            </Typography>
          )}
        </Typography>
      </Card>
    );
  })}
</AccordionDetails>

              </Accordion>
            );
          })}
        </Box>
      ) : (
        <Typography>No predictions found.</Typography>
      )}
    </Box>
  );
};

export default UserPredictions;
