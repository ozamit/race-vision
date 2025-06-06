import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import {
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { host } from "../../utils/host";

const League = ({ raceSessions }) => {
  const [users, setUsers] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    console.log("User clicked: ", userId);
    navigate('/userpredictions', { state: { userId, raceSessions } });
    }

  const fetchPredictionsByUserId = async (userId) => {
    try {
      const response = await fetch(`${host}predictions/getPredictionsByUserId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      return data.predictions || []; // Ensure predictions are always an array
    } catch (error) {
      console.log(`Error fetching predictions for user ${userId}:`, error);
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const usersResponse = await fetch(`${host}users/getAllUsers`);
        if (!usersResponse.ok) {
          const errorData = await usersResponse.json();
          throw new Error(errorData.message || usersResponse.statusText);
        }
        const usersData = await usersResponse.json();

        // Fetch predictions for each user
        const allPredictions = {};
        await Promise.all(
          usersData.map(async (user) => {
            const userPredictions = await fetchPredictionsByUserId(user._id);
            allPredictions[user._id] = userPredictions.reduce((acc, pred) => {
              if (pred && pred.sessionKey) {
                acc[pred.sessionKey] = pred;
              }
              return acc;
            }, {});
          })
        );

        setPredictions(allPredictions);

        // Attach total scores to users and sort
        const usersWithScores = usersData.map((user) => {
          const userPredictions = allPredictions[user._id] || {};
          const totalScore = raceSessions.reduce((total, race) => {
            const racePrediction = userPredictions[race.session_key];
            return total + (racePrediction?.finalScore || 0);
          }, 0);

          return { ...user, totalScore };
        });

        // Sort users by total score in descending order
        const sortedUsers = usersWithScores.sort(
          (a, b) => b.totalScore - a.totalScore
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [raceSessions]);

  const sortedRaceSessions = [...raceSessions]
  .filter((race) => new Date(race.date_start) < new Date()) // Only include past races
  .sort((a, b) => new Date(b.date_start) - new Date(a.date_start)); // Sort by most recent


  return (
    <Box sx={{ padding: 2, color: "white" }}>
      <Typography variant="h4" gutterBottom>
      Friends League
      </Typography>
      <Typography
        sx={{fontSize: 12, marginBottom: "10px", color: "white"}}>
          New: Tap on a friend's name to view their predictions.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "5px",
            overflowX: "auto", // <-- allows horizontal scroll
            maxWidth: "100%", // optional, limit table width
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{display: "flex", width: "max-content"}}>
                  <TableCell
                    style={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: '10px 15px 10px 10px', // (top, right, bottom, left)
                      backdropFilter: "blur(15px)",
                      border: "none",
                      width: 10,
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",

                    }}
                  >
                    #
                  </TableCell>

                  <TableCell
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: '10px 15px 10px 10px', // (top, right, bottom, left)
                      backdropFilter: "blur(15px)",
                      border: "none",
                      width: 120,
                      position: "sticky",
                      left: 30,
                      zIndex: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Name
                  </TableCell>

                <TableCell
                  sx={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    padding: '10px 15px 10px 10px', // (top, right, bottom, left)
                    backdropFilter: "blur(15px)",
                    border: "none",
                    width: 40,
                    position: "sticky",
                    left: 160,
                    zIndex: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  Total
                </TableCell>
                {/* </Typography> */}
                {sortedRaceSessions.map((race) => (
                  <TableCell
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      fontFamily: "monospace",
                      fontVariantNumeric: "tabular-nums", // optional, improves alignment
                      letterSpacing: "normal", // ensures no extra spacing
                      border: "none",
                      width: 30,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      padding: '15px 13px 15px 13px'
                    }}
                    key={race.sessionKey}
                  >
                    {race.country_code}
                  </TableCell>
                ))}

              </TableRow>
            </TableHead>


            <TableBody>
                {users.map((user, index) => (
                  <TableRow sx={{ display: "flex", width: "max-content" }} key={user._id}>

                  <TableCell
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: '10px 15px 10px 10px', // (top, right, bottom, left)
                      backdropFilter: "blur(15px)",
                      border: "none",
                      width: 10,
                      position: "sticky",
                      left: 0,
                      zIndex: 2,
                      backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                  >
                    {index + 1}
                  </TableCell>
                
                  <TableCell
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      padding: '10px 15px 10px 10px', // (top, right, bottom, left)
                      backdropFilter: "blur(15px)",
                      border: "none",
                      width: 120,
                      position: "sticky",
                      left: 30,
                      zIndex: 2,
                      backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                  >
                    <Box
                    onClick={() => handleUserClick(user._id)} // Pass user._id here
                      sx={{
                        maxHeight: "40px", // Adjust as needed for visible height
                        overflowY: "auto",
                        overflowX: "auto",
                        whiteSpace: "normal",
                        maxWidth: 115, // Adjust as needed for visible height
                        // wordBreak: "break-word",
                        pr: 1,
                      }}
                      title={user.name}
                    >
                      {user.name}
                    </Box>

                  </TableCell>

                
                  <TableCell
                      sx={{
                        fontFamily: "monospace", // Ensures consistent digit width
                        fontVariantNumeric: "tabular-nums", // Aligns numbers nicely (optional extra step)
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        padding: '10px 15px 10px 10px', // (top, right, bottom, left)
                        backdropFilter: "blur(15px)",
                        border: "none",
                        width: 10,
                        position: "sticky",
                        left: 160,
                        zIndex: 2,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        width: 40, // Fixed width to ensure alignment

                        textAlign: "right"
                      }}
                    >
                      {user.totalScore}
                    </TableCell>

                  {/* </Typography> */}
                
                  {sortedRaceSessions.map((race) => {
                    const racePrediction = predictions[user._id]?.[race.session_key];
                    return (
                      <TableCell
                        sx={{ 
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          fontFamily: "monospace",
                          fontVariantNumeric: "tabular-nums", // optional, improves alignment
                          letterSpacing: "normal", // ensures no extra spacing
                          border: "none",
                          width: 30,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          padding: '15px 13px 15px 13px'
                        }}
                        key={race.sessionKey}
                      >
                        {racePrediction?.finalScore !== undefined
                          ? racePrediction.finalScore
                          : "---"}
                      </TableCell>
                    );
                  })}
                </TableRow>
                
                ))}
                </TableBody>

          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default League;
