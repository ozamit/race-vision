import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const HowToPlay = () => {
  return (
    <Box sx={{ marginBottom: '80px',padding: 1 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom align="center">
        How to Play
      </Typography>


        {/* Accordion for PReordering Drivers */}
        <Accordion sx={{ marginBottom: '5px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography variant="h6">How to Submit Predictions</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Reordering Drivers</Typography>
          <Typography variant="body1" paragraph>
          To predict the final result for the next race, reorder the drivers on the "Play" page by dragging them up and down.
          </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Saving Predictions</Typography>
          <Typography variant="body1" paragraph>
          After adjusting the drivers as you wish, click the "Save" button to save your prediction.
          </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Updating Predictions</Typography>
          <Typography variant="body1" paragraph>
          You can reorder the drivers again and click the "Save" button. Your latest prediction will be the one that counts, and any previous predictions will be deleted.</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>One Prediction Per Race</Typography>
          <Typography variant="body1" paragraph>
          You are allowed only one prediction per race. Make sure to finalize your prediction before the deadline.
          </Typography>
        </AccordionDetails>
      </Accordion>

        {/* Accordion for Game Rules and Deadlines */}
        <Accordion sx={{ marginBottom: '5px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography variant="h6">Game Rules and Deadlines</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Race Prediction Only</Typography>
          <Typography variant="body1" paragraph>
          Your prediction is for the race result only. Other sessions, such as practice, qualifying, sprint qualifying, and sprint races, are not part of the game.          </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Deadline for Predictions</Typography>
          <Typography variant="body1" paragraph>
          You must submit your prediction at least 1 hour before the scheduled start of the race.
          </Typography>
        </AccordionDetails>
      </Accordion>

      
        {/* Accordion for Game Rules and Deadlines */}
        <Accordion sx={{ marginBottom: '5px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography variant="h6">Verifying Your Prediction</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>"My Predictions" Page</Typography>
          <Typography variant="body1" paragraph>
          Once you have submitted your prediction, you can view it in the "My Predictions" page. This serves as confirmation that your prediction has been successfully saved.          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Accordion for Point System */}
      <Accordion sx={{ marginBottom: '5px' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="h6">Point System</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            You earn <strong>20 points</strong> for each driver you predict in the exact position they finish.
          </Typography>
          <Typography variant="body1" paragraph>
            For every position your prediction is off, you lose <strong>1 point</strong>.
          </Typography>
          <Typography variant="body1" paragraph>
          <strong>For example,</strong> if you predict Hamilton to finish 3rd, but he actually finishes 7th in the race, that’s 4 positions off, resulting in 16 points.</Typography>
          <Typography variant="body1" paragraph>
            Your total score for a race is the sum of points for all predicted drivers.
          </Typography>
        </AccordionDetails>
      </Accordion>
        {/* Accordion for Race Results and Scoring */}
        <Accordion sx={{ marginBottom: '5px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Typography variant="h6">Race Results and Scoring</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Viewing Your Results</Typography>
          <Typography variant="body1" paragraph>
          After the race, we will compute the results and display them in the "My Predictions" page.
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Race Prediction Score</Typography>
          <Typography variant="body1" paragraph>
          In the "My Predictions" page, you will find a section for each race where you submitted a prediction. This section will display your prediction score.          </Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Driver's Position and Score</Typography>
        <Typography variant="body1" paragraph>
          Beside each driver, you will find:
        </Typography>
        <Typography variant="body1" paragraph>
          The position you predicted for them to finish.
        </Typography>
        <Typography variant="body1" paragraph>
          Their actual finish position in the race.
        </Typography>
        <Typography variant="body1" paragraph>
          The score you earned for that driver based on the accuracy of your prediction.
        </Typography>
        </AccordionDetails>
      </Accordion>

    </Box>
  );
};

export default HowToPlay;
