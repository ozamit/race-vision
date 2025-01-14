import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

const HowToPlay = () => {
  return (
    <Box sx={{ padding: 3 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom align="center">
        How to Play
      </Typography>

      {/* Paper Component for the Explanation */}
      <Paper sx={{ padding: 3, backgroundColor: '#f9f9f9', boxShadow: 2 }}>
        <Typography variant="h6" paragraph>
          <strong>Point System Explained:</strong>
        </Typography>

        <Typography variant="body1" paragraph>
          You earn <strong>20 points</strong> for each driver you predict in the exact position they finish.
        </Typography>
        <Typography variant="body1" paragraph>
          For every position your prediction is off, you lose <strong>1 point</strong>.
        </Typography>
        <Typography variant="body1" paragraph>
          (e.g., 1 position off = 19 points, 2 positions off = 18 points, and so on).
        </Typography>
        <Typography variant="body1" paragraph>
          If the gap is too large, <strong>no points</strong> are awarded for that driver.
        </Typography>
        <Typography variant="body1" paragraph>
          Your total score for a race is the sum of points for all predicted drivers.
        </Typography>

        <Divider sx={{ marginY: 2 }} />

        {/* Additional Information */}
        <Typography variant="body2" color="textSecondary">
          Good luck, and may your predictions be as accurate as possible!
        </Typography>
      </Paper>
    </Box>
  );
};

export default HowToPlay;
