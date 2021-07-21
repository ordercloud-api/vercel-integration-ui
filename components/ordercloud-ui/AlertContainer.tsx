import React from 'react';

import {
  IconButton,
  Snackbar,
  SnackbarContent,
  withStyles,
} from '@material-ui/core';
import classNames from 'classnames';

import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';

import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';

let openSnackbarFn;

const styles = theme => ({
  success: {
    backgroundColor: green[700],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warn: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  margin: {
    margin: theme.spacing(1),
  },
});

interface AlertContainerProps {
  classes: any;
}

class AlertContainer extends React.Component<AlertContainerProps> {
  public state = {
    open: false,
    message: '',
    type: '',
  };

  public componentDidMount() {
    openSnackbarFn = this.openSnackbar;
  }

  public openSnackbar = (type: string, message: string) => {
    console.log("here", type)
    this.setState({
      open: true,
      message,
      type,
    });
  };

  public handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: '',
      type: '',
    });
  };

  public render() {
    const { classes } = this.props;
    const { type, message } = this.state;
    return (
      <Snackbar
        onClose={this.handleSnackbarClose}
        open={this.state.open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <SnackbarContent
          className={classNames(classes[type], classes.margin)}
          message={
            <span id="client-snackbar" className={classes.message}>
              <ErrorIcon
                className={classNames(classes.icon, classes.iconVariant)}
              />
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    );
  }
}

export const Alert = {
  success: (message: string) => {
    console.log("here 3", message);
    openSnackbarFn('success', message);
  },
  info: (message: string) => {
    openSnackbarFn('info', message);
  },
  warn: (message: string) => {
    openSnackbarFn('warn', message);
  },
  error: (message: string) => {
    openSnackbarFn('error', message);
  },
};

export default withStyles(styles)(AlertContainer);
