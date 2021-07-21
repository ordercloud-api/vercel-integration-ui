import { Theme } from '@material-ui/core';

const sharedStyles = (theme: Theme) => ({
  textFields: {
    width: '100%',
    marginBottom: theme.spacing(2),
    // '& *': {
    //   color: sherpablue[50],
    // },
    // '& .Mui-focused': {
    //   color: seafoam[100],
    // },
    // '& .MuiInput-underline': {
    //   borderBottom: `1px solid ${sherpablue[100]}`,
    // },
  },
  formButtons: {
    // background:
    //   'linear-gradient(-120deg, ' +
    //   seafoam[500] +
    //   ' 30%, ' +
    //   seafoam[300] +
    //   ' 90%)',
    width: '100%',
    margin: theme.spacing(3, 0, 2, 0),
    padding: theme.spacing(1.5),
  },
  successWrapper: {
    '& > *': {
      marginTop: theme.spacing(1),
    },
  },
  successBtnGroup: {
    marginTop: theme.spacing(4),
    '& button:first-of-type': {
      marginRight: theme.spacing(1),
    },
  },
});

export default sharedStyles;
