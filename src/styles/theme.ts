import { createMuiTheme } from '@material-ui/core/styles';
import tailwindConfig from '../../tailwind.config';

const fontFamily = ['Roboto', 'sans-serif'].join(',');
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: tailwindConfig.theme.colors.indigo[300],
      main: tailwindConfig.theme.colors.indigo[500],
      dark: tailwindConfig.theme.colors.indigo[900],
      contrastText: tailwindConfig.theme.colors.white,
    },

    secondary: {
      light: tailwindConfig.theme.colors.teal[300],
      main: tailwindConfig.theme.colors.teal[500],
      dark: tailwindConfig.theme.colors.teal[900],
      contrastText: tailwindConfig.theme.colors.white,
    },
  },
  typography: {
    fontFamily,
    allVariants: {
      color: tailwindConfig.theme.colors.white,
    },
  },
  overrides: {
    /** 
    MuiTypography: {
      root: {
        color: tailwindConfig.theme.colors.gray[100],
      },
    },    
    */
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: tailwindConfig.theme.colors.black,
      },
    },
    MuiTab: {
      root: {
        outline: 'none !important',
      },
    },
    MuiButton: {
      text: {
        fontSize: '0.75rem',
      },
      label: {
        transform: 'translateX(1px)',
      },
      root: {
        cursor: 'pointer !important',
        outline: 'none !important',
        fontWeight: 600,
        letterSpacing: 1,
      },
    },

    MuiBadge: {
      anchorOriginTopRightRectangle: {
        fontWeight: 600,
        top: 8,
        right: 10,
      },
    },
  },
});

export default theme;
