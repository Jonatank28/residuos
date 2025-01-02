import { DefaultTheme } from "styled-components";

const dark: DefaultTheme = {
  primary: "#121212",
  secundary: "#121212",
  background: "#121212",
  icon: {
    color: "#FFFFFF", 
    size: {
      sm: "10px",
      lg: "12px",
      md: "14px",
      xl: "16px"
    }
  },
  colors: {
    accent: "#e84a5f",
    white: "#FFFFFF",
    orange: "#F8A66B",
    green: "#99b898",
    ocean: "#0066AD",
    blue: "#0016AD",
    yellow: "#fbcb04"
  },
  card: {
    color: "#FFFFFF",
    border: "#FFFFFF",
    background: "#3C3C3C"
  },
  border: {
    color: "rgba(0, 0, 0, 0.2)",
    width: "1px"
  },
  button: {
    background: "#6F9B97",
    color: "#FFFFFF",
    fontFamily: "Roboto-Medium",
    fontSize: "14px",
    fontWeight: 900
  },
  fontSizes: {
    sm: "10px",
    lg: "12px",
    md: "14px",
    xl: "16px"
  },
  marginSizes: {
    sm: "10px",
    lg: "12px",
    md: "14px",
    xl: "16px"
  },
  paddingSizes: {
    sm: "10px",
    lg: "12px",
    md: "14px",
    xl: "16px"
  },
  text: {
    headline: {
      color: '#FFFFFF',
      fontWeight: 500,
      fontFamily: 'Proxima-Bold',
      fontSize: '16px'
    },
    subhead: {
      color: '#FFFFFF',
      fontSize: '12px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 400
    },
    body1: {
      color: '#FFFFFF',
      fontSize: '14.5px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 400
    },
    body2: {
      color: '#FFFFFF',
      fontSize: '14.5px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 600
    },
    caption: {
      color: '#FFFFFF',
      fontSize: '12px',
      fontFamily: 'Proxima-Light',
      fontWeight: 300
    },
    button: {
      color: '#3C3C3C',
      fontSize: '14px',
      fontFamily: 'Proxima-Bold',
      fontWeight: 900
    },
    input: {
      color: '#FFFFFF',
      background: '#3C3C3C',
      placeholderColor: '#B7BCC3',
      fontSize: '14px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 400,
      borderRadius: "5px",
      padding: "5px"
    }
  },
  snackbar: {
    info: "#F8A66B",
    error: "#e84a5f",
    success: "#99b898",
    default: "#FFFFFF"
  },
  splashScreen: {
    background: "#121212"
  }
}

export default dark;