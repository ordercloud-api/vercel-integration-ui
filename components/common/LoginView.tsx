import {
    createStyles,
    Theme,
    makeStyles,
    Typography,
    Button, 
    TextField,
    Link
  } from '@material-ui/core';
import { Auth } from '@ordercloud/portal-javascript-sdk';
import React, { useState } from 'react';
import { Alert } from '../ordercloud-ui/AlertContainer';
import AuthContainer from '../ordercloud-ui/AuthContainer';
import PasswordField from '../ordercloud-ui/PasswordField';
import ProgressLoader from '../ordercloud-ui/ProgressLoader';
import sharedStyles from '../ordercloud-ui/SharedStyles';
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      ...sharedStyles(theme),
      accountButtons: {
        marginTop: theme.spacing(2),
        '& > .MuiButton-root': {
          margin: `0px ${theme.spacing(1)}px`,
        },
      },
      test: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    })
  );
  
  const LoginView = (props) => {
    const { setView, onAuthenticate, doneLoading } = props;
    const classes = useStyles(props);
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async event => {
      event.preventDefault();
      setLoading(true);
      try {
        var resp = await Auth.Login(username, password);
        await onAuthenticate(resp);
      } catch (e) {
        Alert.error(e?.response?.data?.Errors[0]?.Message || "Login failed");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <AuthContainer>
        <form onSubmit={handleSubmit}>
          <TextField
            className={classes.textFields}
            type="text"
            label="Username or Email"
            value={username}
            required={true}
            autoFocus={true}
            onChange={e => setUsername(e.target.value)}
          />
          <PasswordField
            className={classes.textFields}
            value={password}
            label="Password"
            required={true}
            onChange={e => setPassword(e.target.value)}
          />
          <div className={classes.test}>
            <Link color="secondary" style={{cursor: "pointer"}} onClick={() => setView('FORGOT_PASS')}>
              Forgot Password?
            </Link>
          </div>
          <ProgressLoader loading={loading}>
            <Button
              className={classes.formButtons}
              variant="contained"
              color="secondary"
              type="submit"
              size="large"
            >
              Login
            </Button>
          </ProgressLoader>
          <Link color="inherit" style={{cursor: "pointer"}} onClick={() => setView('REGISTER')}>
            Sign Up For Free
          </Link>
        </form>
      </AuthContainer>
    );
  };
  
  export default LoginView;
  