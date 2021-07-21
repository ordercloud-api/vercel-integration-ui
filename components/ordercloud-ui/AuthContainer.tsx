import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      overflow: 'hidden',
    },
    wrapper: {
      position: 'relative',
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center center',
      textAlign: 'center',
      padding: theme.spacing(1),
      boxSizing: 'border-box',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    logo: {
      width: 200,
      display: 'flex',
      placeItems: 'center',
      '& > img': {
        width: '100%',
      },
    },
    form: {
      zIndex: 1,
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 340,
      maxWidth: '100%',
      padding: theme.spacing(4),
      borderRadius: theme.spacing(2),
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      border: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.up('lg')]: {
        minHeight: theme.spacing(48),
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  })
);

interface AuthContainer {
  children: any;
}
const AuthContainer = (props: AuthContainer) => {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.form}>
          <div className={classes.brand}>
            <div className={classes.logo}>
              <img src={'/oc_sc_logo.svg'} alt="Sitecore OrderCloud" />
            </div>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
