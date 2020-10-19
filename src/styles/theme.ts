import { createMuiTheme } from '@material-ui/core/styles';
import tailwindConfig from '../../tailwind.config';

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
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    allVariants: {
      color: tailwindConfig.theme.colors.white,
    },
  },
  overrides: {
    // MuiTypography: {
    //   root: {
    //     color: tailwindConfig.theme.colors.gray[100],
    //   },
    // },

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
      // outlinedPrimary: {
      //   color: tailwindConfig.theme.colors.indigo[300],
      //   borderColor: tailwindConfig.theme.colors.indigo[300],
      // },
      text: {
        fontSize: '0.75rem',
      },
      root: {
        outline: 'none !important',
      },
    },
  },
});

export default theme;
