import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Snackbar, Alert } from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import AssistantIcon from '@mui/icons-material/Assistant';// import { CircularProgress } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import LinearProgress from '@mui/material/LinearProgress';
import { host } from '../../utils/host';

const Home = ({ userInfo, simplifiedDate, userLocalTime, nextRaceSession, startNextRaceSession }) => {

  // const [nextRaceSession, setNextRaceSession] = useState([]); // for testing CircularProgress

  const [progress, setProgress] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [trackInsight, setTrackInsight] = useState("Click to generate an AI track insight");
  const [aitatistic, setaitatistic] = useState("Click to generate an AI track insight");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');



  // Different durations for each cycle (in milliseconds)
  const cycleDurations = [4000, 99, 7000, 99, 3000, 99, 4000, 99, 9000, 99, 3000]; // Adjust as needed
  const totalCycles = cycleDurations.length;

  // Step texts to be shown for each cycle
  const stepTexts = [
    "Initializing...🏎️",
    "Initializing...", // Code skip this text
    "Connecting to F1 data center...", 
    "Connecting to F1 data center...", // Code skip this text
    "Loading Drivers...",
    "Loading Drivers...", // Code skip this text
    "Processing Race control data...",
    "Almost done...", // Code skip this text
    "Finalizing...", 
    "Finalizing...", // Code skip this text
    "🏁 Lights Out and Away We Go! 🏁", 
  ];

  const [currentStepText, setCurrentStepText] = useState(stepTexts[cycle]); // Track current step text

  useEffect(() => {
    if (cycle >= totalCycles) {
      setProgress(100); // Ensure it stays at 100% after the last cycle
      return;
    }

    const cycleDuration = cycleDurations[cycle]; // Get current cycle duration
    const step = 100 / (cycleDuration / 100); // Number of updates to reach 100%

    // Update current step text based on cycle
    setCurrentStepText(stepTexts[cycle]);

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCycle((prevCycle) => prevCycle + 1); // Move to the next cycle
          return 0; // Reset progress for next run
        }
        return prev + step; // Increase progress dynamically
      });
    }, 100); // Update every 100ms for smooth progress

    return () => {
      clearInterval(interval); // Clear the interval properly when the cycle changes
    };
  }, [cycle]); // Runs when cycle changes

  const navigate = useNavigate();

  const handleClickGoToRules = () => {
    navigate("/howtoplay");
  };

  const handleAiTrackInsight = () => {
    console.log("handleAiTrackInsight");
    const prompt = `The next F1 race is in ${nextRaceSession.circuit_short_name}. Share one short (max 20 words) insight about the track focus on what typs of cars/teams will have advantage this weekand.`; // Define prompt here
    const fetchAiTrackInsight = async () => {
        try {
            const response = await fetch(`${host}ai/trackInsight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }), // Send the prompt in the request body
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = `HTTP error! Status: ${response.status}`;
                if (errorData && errorData.message) {
                    errorMessage += ` - ${errorData.message}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('trackInsight:', data);
            if (data.success) {
                console.log("AI response: ", data.data);
                setTrackInsight(data.data);
            } else {
                console.error("Error from backend: ", data.message);
            }

        } catch (error) {
            console.error('Error fetching AI insight:', error);
        }
    };
    fetchAiTrackInsight();
};

const handleAiStatistic = () => {
  console.log("handleAiTrackInsight");
  const prompt = "please provide one interesting statistic insight about F1, keep your answer short - max 20 words.";

  const fetchAiTrackInsight = async () => {
    try {
      const response = await fetch(`${host}ai/trackInsight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = `HTTP error! Status: ${response.status}`;
        if (errorData?.message) {
          errorMessage += ` - ${errorData.message}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('AI statistic:', data);

      if (data.success) {
        console.log("AI response: ", data.data);
        setaitatistic(data.data); // Keep your existing state update if needed
        setSnackbarMessage(data.data);
        setSnackbarOpen(true);
      } else {
        console.error("Error from backend: ", data.message);
        setSnackbarMessage("Failed to fetch insight.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching AI insight:', error);
      setSnackbarMessage("Something went wrong.");
      setSnackbarOpen(true);
    }
  };

  fetchAiTrackInsight();
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

  return (
    <Typography>
            <Snackbar
        open={snackbarOpen}
        // autoHideDuration={15000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)}
          severity="info"
          icon={<InsightsIcon fontSize="inherit" />}
          sx={{ width: '100%' }}> {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Welcome Message */}
      <Box sx={{ margin: '10px', textAlign: 'center' }}>
  <Typography component="span" sx={{ fontSize: 30 }} color="white">
    {userInfo?.name ? `Hi ${userInfo.name}!` : ''}
  </Typography>
  <br /> {/* This adds a line break */}
  <Typography component="span" sx={{ fontSize: 26 }} color="white">
    Welcome to{' '}
    <Typography component="span" sx={{ color: "#FDCA40", fontSize: 26 }}>
      Race-vision
    </Typography>
  </Typography>
</Box>


      {/* Main Content Boxes */}
      <Box sx={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

        {/* Next Race Details */}
        <Box
          sx={{
            width: '80%',
            borderRadius: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            height: '110px',
            display: 'flex',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
            alignItems: 'center',
          }}
        >
          {Object.keys(nextRaceSession).length === 0 ? (
            <Box sx={{ width: "100%", textAlign: "center", marginTop: 2 }}>
              <Typography sx={{ marginBottom: 1, color: "white" }}>
                {currentStepText || "🏁 Lights Out and Away We Go! 🏁"}
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          ) : (
            <Box >
              <Typography color="white" style={{ fontSize: '18px', marginBottom: '10px' }}>
                <i className="bi bi-geo-fill" style={{ marginRight: '10px' }}></i> {nextRaceSession.circuit_short_name}
              </Typography>
              <Typography color="white" style={{ fontSize: '18px', marginBottom: '10px' }}>
                <i className="bi bi-globe-americas" style={{ marginRight: '10px' }}></i> {nextRaceSession.country_name} {nextRaceSession.location}
              </Typography>
              <Typography color="white" style={{ fontSize: '18px' }}>
                <i className="bi bi-calendar-date" style={{ marginRight: '10px' }}></i> {userLocalTime}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Countdown Box */}
        <Box
          sx={{
            width: '80%',
            borderRadius: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(4px)',
            height: '50px',
          }}
        >
          {Object.keys(nextRaceSession).length === 0 ? (
            <Box sx={{ width: '90%' }}>
              <Skeleton sx={{ bgcolor: 'grey.800' }} />
              <Skeleton sx={{ bgcolor: 'grey.800' }} />
            </Box>
          ) : (
            <Box sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
            }}>
              <Typography color="white" style={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}>
                <i className="bi bi-hourglass-split" style={{ fontSize: '20px', marginRight: '10px' }}></i>
                 Time left to submit prediction for the next race
              </Typography>
              <Typography color="white" style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>
                {countdown}
              </Typography>
            </Box>
          )}
        </Box>

        {/* How To Play Box */}
        {/* <Box
          sx={{
            width: '80%',
            borderRadius: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '30px',
          }}
          onClick={handleClickGoToRules}
        >
          <Typography color="white" style={{ fontSize: '18px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            How To Play <i className="bi bi-info-circle" style={{ fontSize: '20px', marginLeft: '10px' }}></i>
          </Typography>
        </Box> */}

{/* Two Side-by-Side Boxes */}
<Box sx={{ display: 'flex', width: '90%', justifyContent: 'space-between', gap: '20px' }}>
          <Box
            sx={{
              width: '80%',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(4px)',
              height: '100px',
            }}
            onClick={handleClickGoToRules}
            >
            <Typography color="white" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <i className="bi bi-info-circle" style={{ fontSize: '40px', marginLeft: '10px' }}></i>
              <span style={{ fontSize: '20px',marginTop: '8px' }}>How To Play</span>

            </Typography>
          </Box>

          {/* Video Collection Box */}
          <Box
            sx={{
              width: '45%',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(4px)',
              height: '100px',
            }}
            onClick={handleAiStatistic}
          >
            <Typography color="white" align="center">
              <Typography style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* <i className="bi bi-stars" style={{ fontSize: '40px' }}></i> */}
                <InsightsIcon style={{ fontSize: '40px', marginLeft: '10px' }} />
                <span style={{ fontSize: '14px' }}>Quick Stat (click)</span>
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '90%', justifyContent: 'space-between', gap: '20px', marginBottom: '120px' }}>
          {/* Insights Box */}
          <Box
            sx={{
              display: 'flex', flexDirection: 'column',
              width: '90%',
              borderRadius: '20px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backdropFilter: 'blur(4px)',
              height: '300px',
            }}
          >
            <Typography color="white">
              <Typography style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* <InsightsIcon style={{ fontSize: '40px' }} /> */}
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>Meet AI Racer 🏎️ ✨ </span>
                <span style={{ marginTop: '8px' }}>Our AI buddy using AI analysis to predict results and try to beat you. Check its scores in the league table.</span>
              </Typography>
            </Typography>

            <Box sx={{ marginTop: '10px',
                       alignItems: 'center',
                       backgroundColor: 'rgba(255, 255, 255, 0.2)',
                       width: '100%',
                       borderRadius: '20px',
                       padding: '10px',
                       backgroundColor: 'rgba(255, 255, 255, 0.1)',
                       textAlign: 'center',
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                        }}
                      onClick={handleAiTrackInsight}
            >
            <Typography color="white">
              <Typography style={{ display: 'flex', flexDirection: 'column' ,alignItems: 'center' }}>
                <AssistantIcon style={{ fontSize: '30px', margin: '5px 0px' }} />
                <span style={{ margin: '4px 0px', fontSize: '16px' }}>{trackInsight}</span>
              </Typography>
            </Typography>
              

            </Box>
          </Box>
        </Box>
      </Box>



    </Typography>
  );
};

export default Home;
