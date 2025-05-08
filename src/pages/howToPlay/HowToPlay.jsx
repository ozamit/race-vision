import React from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


const HowToPlay = () => {
  
  const navigate = useNavigate();

  const handleBack = () => {
    console.log('Back button clicked');
    // navigate('/');
  }
  
  return (
    <Box sx={{ marginBottom: '80px', padding: "25px 30px 100px 30px" }}>
      {/* <Typography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '-50px 0 40px 0' }}> */}
      <Button 
  variant="contained" 
  startIcon={<ArrowBackIosIcon />} 
  sx={{ 
    backgroundColor: '#FDCA40', 
    color: '#3a86ff', 
    position: 'relative', 
    left: '-120px',  
    top: '-50px',  
    marginBottom: '40px', 
    // padding: '10px 16px',  // Ensure good spacing
    minWidth: '80px', // Avoids shrinking
    display: 'inline-flex', // Ensures proper alignment
    alignItems: 'center', // Ensures icon + text align properly
    justifyContent: 'center', // Centers the content
    zIndex: 10 // Ensures it's above overlapping elements
  }} 
  onClick={() => navigate(-1)}
>
  Back
</Button>


      {/* </Typography> */}
      {/* Title */}
      <Typography variant="h4" gutterBottom align="center" sx={{ fontSize: 24 }} color="white">
        How to Play
      </Typography>

      {/* Common Accordion Styles */}
      {[
        {
          title: 'Objective of the game',
          details: (
          <>
            <Typography variant="h6"       sx={{
        fontWeight: 'bold',
        color: 'white',
        boxShadow: 'none', // Remove any shadow
        border: 'none', // Remove any border
        background: 'transparent' // Ensures no background effect
      }}>Predict the finishing positions of the drivers in an upcoming race as accurately as possible.</Typography>
          </>
        ),
        },
        {
          title: 'How to Submit Predictions',
          details: (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Reordering Drivers</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                To predict the final result for the next race, reorder the drivers on the "Play" page by dragging them up and down.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Saving Predictions</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                After adjusting the drivers as you wish, click the "Save" button to save your prediction.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Updating Predictions</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You can reorder the drivers again and click the "Save" button. Your latest prediction will be the one that counts, and any previous predictions will be deleted.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>"Verifying Your Prediction</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                Once you have submitted your prediction, you can view it in the "My Predictions" page. This serves as confirmation that your prediction has been successfully saved.
              </Typography>
            </>
          ),
        },
        {
          title: 'Game Rules and Deadlines',
          details: (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Race Prediction Only</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                Your prediction is for the race result only. Other sessions, such as practice, qualifying, sprint qualifying, and sprint races, are not part of the game.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Deadline for Predictions</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You must submit your prediction at least 10 minutes before the scheduled start of the race.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>One Prediction Per Race</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You are allowed only one prediction per race. Make sure to finalize your prediction before the deadline.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>No Points for Replaced Drivers</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
              If you predict a position for a driver who did not participate in the race (and was replaced by another driver), no points will be awarded for that prediction.
              </Typography>
            </>
          ),
        },
        {
          title: 'Point System',
          details: (
            <>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You earn <strong style={{ color: '#FDCA40' }}>20 points</strong> for each driver you predict in the exact position they finish.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                For every position your prediction is off, you lose <strong style={{ color: '#FDCA40' }}>1 point</strong>.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                For example, if you predict Hamilton to finish 3rd, but he actually finishes 7th in the race, that’s 4 positions off, resulting in 16 points.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                Your total score for a race is the sum of points for all predicted drivers.
              </Typography>
            </>
          ),
        },
        {
          title: 'Race Results and Scoring',
          details: (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Viewing Your Results</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                After the race, the results will be calculated and displayed on the "My Predictions" page.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>"My Predictions" page</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                In the "My Predictions" page, you will find a section for each race where you submitted a prediction. This section will display your prediction score.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#FDCA40' }}>Driver's Position and Score</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                For each race, you will find your fredicted results and beside each driver you will see:
                The position you predicted for them to finish, 
                their actual finish position in the race, 
                and The score you earned for that driver based on the accuracy of your prediction.
              </Typography>
            </>
          ),
        },
      ].map((accordion, index) => (
        <Accordion
          key={index}
          sx={{
            marginBottom: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0)', // Transparent
            borderRadius: '10px',
            boxShadow: 'none', // Remove any shadow
            border: 'none', // Remove any border
          }}
        >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index + 1}-content`}
          id={`panel${index + 1}-header`}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent
            color: 'white',
            borderRadius: '10px',
            '& .MuiSvgIcon-root': {
              color: 'white', // Change icon color to white
            },
          }}
        >
          <Typography variant="h6">{accordion.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>{accordion.details}</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default HowToPlay;
