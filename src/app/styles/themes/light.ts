import { DefaultTheme } from "styled-components";

const light: DefaultTheme = {
  primary: "#3CC96B",
  secundary: "#FFFFFF",
  background: "#F5F4F4",
  icon: {
    color: "#8F8F8F",
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
    orange: "#303130",
    green: "#3CC96B ",
    ocean: "#318AFF",
    blue: "#0056C8",
    yellow: "#fbcb04"
  },
  card: {
    color: "#3C3C3C",
    border: "#CCCCCC",
    background: "#FFFFFF"
  },
  border: {
    color: "rgba(0, 0, 0, 0.2)",
    width: "1px"
  },
  button: {
    background: "#303130",
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
      color: '#3C3C3C',
      fontWeight: 500,
      fontFamily: 'Proxima-Bold',
      fontSize: '16px'
    },
    subhead: {
      color: '#515151',
      fontSize: '12px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 400
    },
    body1: {
      color: '#515151',
      fontSize: '14.5px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 400
    },
    body2: {
      color: '#8F8F8F',
      fontSize: '14.5px',
      fontFamily: 'Proxima-Semibold',
      fontWeight: 600
    },
    caption: {
      color: '#8F8F8F',
      fontSize: '12px',
      fontFamily: 'Proxima-Light',
      fontWeight: 300
    },
    button: {
      color: '#FFFFFF',
      fontSize: '14px',
      fontFamily: 'Proxima-Bold',
      fontWeight: 900
    },
    input: {
      color: '#3C3C3C',
      background: '#FFFFFF',
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
    background: "#3CC96B "
  }
}

export default light;