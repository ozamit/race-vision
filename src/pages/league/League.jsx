import React, { useEffect, useState } from "react";
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

  const fetchPredictionsByUserId = async (userId) => {
    try {
      const response = await fetch(`${host}predictions/getPredictionsByUserId`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(
          `Error fetching predictions for user ${userId}:`,
          data.message || response.statusText
        );
        return [];
      }
      return data.predictions || []; // Ensure predictions are always an array
    } catch (error) {
      console.error(`Error fetching predictions for user ${userId}:`, error);
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

  const sortedRaceSessions = [...raceSessions].sort(
    (a, b) => new Date(b.date_start) - new Date(a.date_start)
  );

  return (
    <Box sx={{ padding: 2, color: "white" }}>
      <Typography variant="h4" gutterBottom>
      Friends League
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
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
              <TableCell
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    position: "sticky",
                    width: 40,
                    left: 0,
                    zIndex: 2,
                    backdropFilter: "blur(30px)",
                    border: "none",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    position: "sticky",
                    left: 32,
                    width: 70,
                    zIndex: 2,
                    backdropFilter: "blur(30px)",
                    border: "none",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    position: "sticky",
                    left: 120,
                    zIndex: 2,
                    backdropFilter: "blur(30px)",
                    border: "none",
                  }}
                >
                  Total
                </TableCell>
                {sortedRaceSessions.map((race) => (
                  <TableCell
                    sx={{ color: "white", border: "none" }}
                    key={race.sessionKey}
                  >
                    {race.country_code}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user, index) => (
                    <TableRow key={user._id}>
                    <TableCell
                        sx={{
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        position: "sticky",
                        width: 40,
                        left: 0,
                        zIndex: 2,
                        backdropFilter: "blur(15px)",
                        border: "none",
                        }}
                    >
                        {index + 1}
                    </TableCell>
                    <TableCell
                        sx={{
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        position: "sticky",
                        width: 70,
                        left: 32,
                        zIndex: 2,
                        backdropFilter: "blur(15px)",
                        border: "none",
                        display: "flex", // To align the icon and text together
                        alignItems: "center",
                        }}
                    >
                        {user.name}
                        {index === 0 && <MilitaryTechIcon style={{ color: 'gold'}}/>}
                        {index === 1 && <MilitaryTechIcon style={{ color: 'silver'}}/>}
                        {index === 2 && <MilitaryTechIcon style={{ color: '#CD7F32'}}/>}
                    </TableCell>
                    <TableCell
                        sx={{
                        color: "white",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        position: "sticky",
                        left: 120,
                        zIndex: 2,
                        backdropFilter: "blur(15px)",
                        border: "none",
                        }}
                    >
                        {user.totalScore}
                    </TableCell>
                    {sortedRaceSessions.map((race) => {
                        const racePrediction = predictions[user._id]?.[race.session_key];
                        return (
                        <TableCell
                            sx={{ color: "white", border: "none" }}
                            key={race.sessionKey}
                        >
                            {racePrediction && racePrediction.finalScore !== undefined
                            ? racePrediction.finalScore
                            : "-"}
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
