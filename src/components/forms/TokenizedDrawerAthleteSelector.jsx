import React from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import VendorDrawerAthleteSelector from './external/DrawerAthleteSelector'

function TokenizedDrawerAthleteSelector(props) {
  const theme = React.useMemo(() => {
    const root = document.documentElement
    const read = (name, fallback) => getComputedStyle(root).getPropertyValue(name).trim() || fallback
    const primary = read('--color-primary', '#3B4960')
    const bg = read('--color-background-primary', '#ffffff')
    const border = read('--color-border-primary', '#e0e0e0')
    const textPrimary = read('--color-text-primary', '#333333')
    const textSecondary = read('--color-text-secondary', '#666666')
    const btnBg = read('--button-primary-bg', primary)
    const btnHover = read('--button-primary-hover-bg', primary)
    const btnColor = read('--button-primary-color', '#ffffff')

    return createTheme({
      palette: {
        mode: 'light',
        primary: { main: primary, contrastText: btnColor },
        background: { default: bg, paper: bg },
        divider: border,
        text: { primary: textPrimary, secondary: textSecondary }
      },
      typography: {
        fontFamily: 'Open Sans, sans-serif'
      },
      components: {
        MuiTextField: {
          defaultProps: { variant: 'filled', size: 'small' }
        },
        MuiButton: {
          defaultProps: { variant: 'contained', size: 'small', disableElevation: true },
          styleOverrides: {
            containedPrimary: {
              backgroundColor: btnBg,
              color: btnColor,
              textTransform: 'none',
              '&:hover': { backgroundColor: btnHover }
            }
          }
        }
      }
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <VendorDrawerAthleteSelector {...props} />
    </ThemeProvider>
  )
}

export default TokenizedDrawerAthleteSelector


