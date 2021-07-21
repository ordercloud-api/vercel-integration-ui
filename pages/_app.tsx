import 'tailwindcss/tailwind.css'
import * as React from "react";
import { MuiThemeProvider } from '@material-ui/core';
import ORDERCLOUD_THEME from '../components/ordercloud-ui/theme.constants';
import AlertContainer from '../components/ordercloud-ui/AlertContainer';


function MyApp({ Component, pageProps }) {
  return <MuiThemeProvider theme={ORDERCLOUD_THEME}>
    <AlertContainer/>
    <Component {...pageProps} />
  </MuiThemeProvider>
}

export default MyApp