import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HowToPlay = () => {
  return (
    <Box sx={{ marginBottom: '80px', padding: 3 }}>
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Predict the finishing positions of the drivers in an upcoming race as accurately as possible.</Typography>
          </>
        ),
        },
        {
          title: 'How to Submit Predictions',
          details: (
            <>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Reordering Drivers</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                To predict the final result for the next race, reorder the drivers on the "Play" page by dragging them up and down.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Saving Predictions</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                After adjusting the drivers as you wish, click the "Save" button to save your prediction.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Updating Predictions</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You can reorder the drivers again and click the "Save" button. Your latest prediction will be the one that counts, and any previous predictions will be deleted.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>"Verifying Your Prediction</Typography>
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
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Race Prediction Only</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                Your prediction is for the race result only. Other sessions, such as practice, qualifying, sprint qualifying, and sprint races, are not part of the game.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Deadline for Predictions</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You must submit your prediction at least 1 hour before the scheduled start of the race.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>One Prediction Per Race</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You are allowed only one prediction per race. Make sure to finalize your prediction before the deadline.
              </Typography>
            </>
          ),
        },
        {
          title: 'Point System',
          details: (
            <>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                You earn <strong>20 points</strong> for each driver you predict in the exact position they finish.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                For every position your prediction is off, you lose <strong>1 point</strong>.
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                <strong>For example,</strong> if you predict Hamilton to finish 3rd, but he actually finishes 7th in the race, that’s 4 positions off, resulting in 16 points.
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
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Viewing Your Results</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                After the race, the results will be calculated and displayed on the "My Predictions" page.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>"My Predictions" page</Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                In the "My Predictions" page, you will find a section for each race where you submitted a prediction. This section will display your prediction score.
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>Driver's Position and Score</Typography>
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
