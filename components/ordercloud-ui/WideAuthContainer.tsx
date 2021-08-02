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
      margin: 'auto',
      width: '50%',
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
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
      width: 600,
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

interface WideAuthContainer {
  children: any;
}
const WideAuthContainer = (props: WideAuthContainer) => {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <div className={classes.form}>
          <div className={classes.brand}>
            <div className={classes.logo}>
              <img src={'/storefront.gif'} alt="Storefront" />
            </div>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default WideAuthContainer;
