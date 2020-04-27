import React from 'react';
import './App.css';
import { createMuiTheme, makeStyles, createStyles, Theme ,ThemeProvider } from '@material-ui/core';
import {orange, yellow} from '@material-ui/core/colors';
import {Layout} from "./Components/Layout";
import { ImageProvider } from './Store';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: yellow[500]
    },
    secondary: {
      main: orange[500]
    }
  }
});

function App() {
  return (
      <ThemeProvider theme={theme}>
        <ImageProvider>
          <Layout />
        </ImageProvider>
      </ThemeProvider>
  );
}

export default App;
