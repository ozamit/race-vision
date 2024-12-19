import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import { Reorder } from 'framer-motion';

const Play = ({ drivers, fetchStatus }) => {
  // Local state for managing drivers
  const [localDrivers, setLocalDrivers] = useState(drivers);

  // Sync local state when the drivers prop changes
  useEffect(() => {
    setLocalDrivers(drivers);
  }, [drivers]);

  return (
    <div style={{ margin: '0px' }}>
      <div>
        <div>{fetchStatus}</div>
        {/* Reorder.Group for drivers */}
        <Reorder.Group
          style={{
            marginBottom: '100px',
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: '0', // Ensure no margin on the left of the Reorder.Group
            paddingLeft: '0', // Ensure no padding on the left of the Reorder.Group
            marginRight: '40px', // Ensure no margin on the left of the Reorder.Group
            marginLeft: '40px', // Ensure no margin on the left of the Reorder.Group
            border: '1px solid #ccc', // Add border to the Reorder.Group
            borderRadius: '15px', // Add border radius to the Reorder.Group

          }}
          values={localDrivers}
          onReorder={setLocalDrivers} // Update local state when reordered
        >
          {localDrivers.map((driver, index) => (
            <Reorder.Item style={{ marginLeft: '0px' }} value={driver} key={driver.name_acronym}>
              <Card
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'none', // Remove box-shadow from the card
                  borderBottom: '1px solid #ccc', // Add border to the card
                  marginLeft: '0px', // Remove left margin from the card
                  marginTop: '10px', // 10px margin on top of the card
                  position: 'relative', // Ensure positioning for the image
                  padding: ' 0px 0px 0px 10px', // Add padding to the card
                }}
              >
                <CardActions
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'flex-end', // Align content to the bottom of the card
                    padding: '0', // Remove padding from the CardActions
                    position: 'relative', // Ensure the image aligns properly
                  }}
                >
                  <Typography variant="h7" style={{ marginRight: '10px' }}>
                    # {index + 1}
                  </Typography>
                  <img
                    src={
                      driver.headshot_url ||
                      'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png'
                    }
                    alt={`${driver.name_acronym} driver`}
                    style={{
                      width: '50px',
                      height: '50px', // Ensure image is square
                      padding: '0px 0px 0px 10px', // Remove padding to ensure it touches the bottom border
                    }}
                  />
                  <Typography>{driver.full_name}</Typography>
                </CardActions>
              </Card>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default Play;
