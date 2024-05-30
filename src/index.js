import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: { main: '#f08a4c' },
        }
      : {
          // palette values for dark mode
          primary: { main: '#f9c468' },
        }),
  },
});

const ThemedApp = () => {
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IconButton
        sx={{ position: 'absolute', top: 16, right: 16 }}
        onClick={toggleMode}
        color="inherit"
      >
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
      <App />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>
);

reportWebVitals();
