import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1FC8B9", // Your custom light mode primary color
    },
    background: {
      default: "#FFFFFF", // Custom light mode background color
      paper: "#F5F5F5",
    },
    // Add other customizations here
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#1FC8B9 !important", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#1FC8B9 !important", // Hover border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1FC8B9 !important", // Focused border color
            },
          },
          "& .MuiInputLabel-root": {
            color: "black !important", // Default label color
          },
          "& .MuiInputBase-input": {
            color: "black !important", // Default input text color
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0a84ff", // Your custom dark mode primary color
    },
    background: {
      default: "#121212", // Custom dark mode background color
      paper: "#1E1E1E",
      //   paper: "#0a84ff",
    },
    // Add other customizations here
    // textField: "#0a84ff"
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#0a84ff !important", // Default border color
            },
            "&:hover fieldset": {
              borderColor: "#0a84ff !important", // Hover border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "#0a84ff !important", // Focused border color
            },
          },
          "& .MuiInputLabel-root": {
            color: "white !important", // Default label color
          },
          "& .MuiInputBase-input": {
            color: "white !important", // Default input text color
          },
        },
      },
    },
  },
});
