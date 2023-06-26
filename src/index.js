import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const container = document.getElementById("root");
const root = createRoot(container);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


root.render(
  <HashRouter>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </HashRouter>
);

serviceWorker.unregister();
