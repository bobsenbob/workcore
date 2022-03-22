import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { green } from '@mui/material/colors';

  const themeOne=createTheme({
    palette: {
      
      primary: {
        main: green[500],
        light: green[500],
        
      },
      secondary: {
        main: '#ffffff'
      }
    }
  });
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={themeOne}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
