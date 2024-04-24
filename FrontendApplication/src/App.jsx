import TimeConverter from "./TimeConverter"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import { Switch } from "@mui/material"

function App() {
  const date = new Date();
  const showTime = date.getHours()

  const [toggleDarkMode, setToggleDarkMode] = useState(true);
  useEffect(() => {
    if (showTime <= 18 && showTime >= 8) {
      setToggleDarkMode(false);
    }
  }, [])

  function switchtoDark() {

    setToggleDarkMode(true);
  }
  function switchtoLight() {
    setToggleDarkMode(false);
  }

  // function to toggle the dark mode as true or false
  const toggleDarkTheme = () => {
    setToggleDarkMode(!toggleDarkMode);
  };
  const darkTheme = createTheme({
    palette: {
      mode: toggleDarkMode ? 'dark' : 'light', // handle the dark mode state on toggle
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#131052',

      },
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <h2>Toggle Dark mode</h2>
      <Switch checked={toggleDarkMode} onChange={toggleDarkTheme} />
      <TimeConverter switchToDark={switchtoDark} switchToLight={switchtoLight}></TimeConverter>
    </ThemeProvider>
  );

};


export default App

