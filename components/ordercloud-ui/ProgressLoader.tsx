import React, { Fragment } from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    '@keyframes progress-animation': {
      '0%': {
        width: '0%',
      },
      '5%': {
        width: '0%',
      },
      '10%': {
        width: '15%',
      },
      '30%': {
        width: '40%',
      },
      '50%': {
        width: '55%',
      },
      '80%': {
        width: '100%',
      },
      '95%': {
        width: '100%',
      },
      '100%': {
        width: '100%',
      },
    },
    progressAnimation: {
      position: 'relative',
      '&:after': {
        content: "''",
        width: '100%',
        height: '100%',
        opacity: 1,
        zIndex: 5,
        background: '#D32F2F',
        backgroundColor: 'rgba(0,0,0,.4)',
        transition: 'all 0.3s ease',
        animation: '$progress-animation .75s linear 0s infinite',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
  })
);

interface ProgressLoader {
  loading: boolean;
  children: any;
}
const ProgressLoader = (props: ProgressLoader) => {
  const classes = useStyles(props);
  const { loading, children } = props;
  const modifiedChild = (child: any) => {
    if (!loading) {
      // don't modify, no class needs to be added
      return child;
    }
    // add progressAnimation class
    const className = `${child.props.className} ${classes.progressAnimation}`;
    return React.cloneElement(child, { className });
  };

  return <Fragment>{modifiedChild(children)}</Fragment>;
};

export default ProgressLoader;
