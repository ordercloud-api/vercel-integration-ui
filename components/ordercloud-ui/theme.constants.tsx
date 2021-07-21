import {
  createMuiTheme,
  darken,
  fade,
  lighten,
} from '@material-ui/core/styles';

export const base_color_1 = '#4169E1';
export const base_color_2 = '#19a5a2';
export const base_color_3 = '#d4cbba';
export const base_color_4 = '#084c61';
export const base_color_5 = '#0085eb';
export const base_color_6 = '#0db2db';
export const base_color_7 = '#00f2c2';
export const base_color_8 = '#ffd505';
export const base_accent_color = base_color_3;
export const base_signature_color = '#fe2911';

export const brand_framework_x_light = '#e3e3e3';
export const brand_selection_bg_active = '#bfddf4';
export const brand_selection_text_active = '#11163e';
export const brand_selection_bg_active_hover = darken(
  brand_selection_bg_active,
  0.025
);
export const brand_selection_bg_hover = '#f0f0f0';
export const brand_signal_warning = '#fffa00';
export const brand_signal_warning_text = '#bfbc00';
export const brand_signal_success = '#11a31b';
export const brand_signal_error = '#ca241c';
export const brand_signal_info = '#0076d1';

const defaultTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
});
// defaultTheme.palette.type === 'dark' ? lightBlue : seafoam;

export default createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    MuiButton: {
      disableElevation: true,
    },
  },
  typography: {
    h1: {
      fontWeight: 600,
      fontSize: 48,
    },
    h2: {
      fontWeight: 600,
      fontSize: 36,
    },
    h3: {
      fontWeight: 600,
      fontSize: 24,
    },
    h4: {
      fontWeight: 700,
      fontSize: 18,
    },
    h5: {
      fontWeight: 600,
      fontSize: 16,
    },
    h6: {
      fontWeight: 600,
      fontSize: 14,
    },
    subtitle1: {
      fontWeight: 300,
      fontSize: 18,
    },
    subtitle2: {
      fontWeight: 300,
      fontSize: 16,
    },
    body1: {
      fontWeight: 400,
      fontSize: 14,
    },
    body2: {
      fontWeight: 400,
      fontSize: 12,
    },
    button: {
      fontWeight: 600,
      fontSize: 14,
    },
    fontSize: 14,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    type: 'light',
    primary: {
      main: base_color_1,
    },
    secondary: {
      main: base_color_1,
    },
    warning: {
      main: brand_signal_warning,
      contrastText: brand_signal_warning_text,
    },
    success: {
      main: brand_signal_success,
    },
    info: {
      main: brand_signal_info,
    },
    error: {
      main: brand_signal_error,
    },
    background: {
      default: defaultTheme.palette.grey[100],
    },
    action: {
      hover: brand_selection_bg_hover,
      hoverOpacity: 0.5,
    },
    divider: '#ccc',
  },
  shape: {
    borderRadius: 3,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          fontSize: 12,
          backgroundColor: 'white',
        },
        a: {
          color: base_color_1,
        },
        code: {
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        },
        pre: {
          whiteSpace: 'pre-wrap',
          workBreak: 'break-all',
        },
        mark: {
          padding: defaultTheme.spacing(0, 0.25),
          borderRadius: defaultTheme.shape.borderRadius,
          backgroundColor: lighten(base_color_2, 0.5),
          fontWeight: defaultTheme.typography.fontWeightMedium,
          color: defaultTheme.palette.getContrastText(
            defaultTheme.palette.background.paper
          ),
        },
      },
    },
    MuiCard: {
      root: {
        boxShadow: 'none',
        border: '1px solid #ccc',
      },
    },
    MuiOutlinedInput: {
      root: {
        background: defaultTheme.palette.background.paper,
      },
    },
    MuiTable: {
      root: {
        borderColor: defaultTheme.palette.divider,
      },
    },
    MuiTableBody: {
      root: {
        background: defaultTheme.palette.background.paper,
      },
    },
    MuiTableCell: {
      root: {
        fontSize: 14,
        borderBottomColor: '#ccc',
      },
      head: {
        fontWeight: 600,
        position: 'sticky',
        background: defaultTheme.palette.grey[100],
        top: 0,
        '&:after': {
          content: '""',
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 1,
          background: defaultTheme.palette.divider,
        },
      },
    },
    MuiTab: {
      root: {
        fontSize: 14,
      },
      wrapper: {
        textTransform: 'none',
      },
    },
    MuiTabs: {
      indicator: {
        height: 4,
      },
    },
    MuiListItem: {
      root: {
        '&.Mui-selected': {
          // background: brand_selection_bg_active,
          color: base_color_1,
          '&:hover': {
            // background: brand_selection_bg_active_hover,
          },
        },
      },
    },
    MuiIconButton: {
      root: {
        color: base_color_1,
        '&:hover': {
          backgroundColor: fade('#000', 0.1),
        },
      },
      colorSecondary: {
        '&:hover': {
          backgroundColor: fade('#000', 0.1),
        },
      },
    },
    MuiCheckbox: {
      root: {
        '&.Mui-checked.MuiIconButton-root:hover': {
          backgroundColor: fade('#000', 0.1),
        },
      },
      colorSecondary: {
        '&.Mui-checked.MuiIconButton-root:hover': {
          backgroundColor: fade('#000', 0.1),
        },
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
        paddingTop: undefined,
      },
      root: {
        borderRadius: defaultTheme.shape.borderRadius,
      },
    },
    MuiToolbar: {
      dense: {
        minHeight: 42,
      },
      regular: {
        minHeight: '0 !important',
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: defaultTheme.shape.borderRadius,
      },
    },
    MuiBadge: {
      anchorOriginTopRightRectangle: {
        top: 4,
        right: 4,
      },
    },
  },
});
