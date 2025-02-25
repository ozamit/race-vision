import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Import createRoot
import App from "./App";
import { createTheme, ThemeProvider, } from "@mui/material/styles";
import Typography from '@mui/material/Typography';

// Define a custom MUI theme with the "Funnel Display" font
const theme = createTheme({
  typography: {
    fontFamily: "'Funnel Display', sans-serif",
  },
});

// Check screen size before rendering the app
const isMobile = window.innerWidth < 768; // Adjust the breakpoint as needed

if (!isMobile) {
  // Apply styles to the body to ensure no extra margin or padding
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.height = "100vh"; // Ensure full height

  // Replace body content with the "not supported" message
  document.body.innerHTML = `
    <div style="text-align: center; padding: 20px; font-size: 20px; color: red; font-family: 'Funnel Display', sans-serif;">
      Sorry, this app is only available on mobile devices.
    </div>
  `;

  // Load the "Funnel Display" font for the fallback message
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
} else {
  // If the user is on a mobile device, render the app using createRoot
  const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
