import { extendTheme } from "@chakra-ui/react";

const colors = {
  lummy: {
    pink: {
      50: "#FFF5F9",
      100: "#FFE6F0",
      200: "#FFC5D9",
      300: "#FFA3C4",
      400: "#FF80AF",
      500: "#FF5C9A",
      600: "#F03D7A",
      700: "#D42A65",
      800: "#B01F50",
      900: "#8D1A3F",
    },
    purple: {
      50: "#F6F4FF",
      100: "#EDE9FF",
      200: "#D9CFFF",
      300: "#C5B6FF",
      400: "#A48BFA",
      500: "#8A6EF7",
      600: "#7455E9",
      700: "#5C3CDB",
      800: "#482BBD",
      900: "#38219E",
    },
    mint: {
      50: "#F0FFF6",
      100: "#E0FFED",
      200: "#D5FFE4",
      300: "#A8F2CA",
      400: "#88D7B0",
      500: "#6AC094",
      600: "#54A97E",
      700: "#3F9168",
      800: "#2F7853",
      900: "#1F5F3F",
    },
    blue: {
      50: "#F0F9FF",
      100: "#E0F2FE",
      200: "#A8E7FF",
      300: "#7CD5F5",
      400: "#55C2EC",
      500: "#3AA8D2",
      600: "#278CB7",
      700: "#17719C",
      800: "#0D5780",
      900: "#054266",
    },
    gray: {
      50: "#F7F7FB",
      100: "#EEEEF5",
      200: "#E8E8F8",
      300: "#D1D1E0",
      400: "#ADADC2",
      500: "#8A8AA3",
      600: "#666683",
      700: "#4D4D63",
      800: "#333342",
      900: "#1A1A22",
    },
    dark: "#333333",
  },
};

// Typography
const fonts = {
  heading: '"Poppins", sans-serif',
  body: '"Inter", sans-serif',
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: "medium",
      borderRadius: "md",
      _focus: {
        boxShadow: "none",
      },
    },
    variants: {
      primary: {
        bg: "lummy.purple.500",
        color: "white",
        _hover: {
          bg: "lummy.purple.600",
          transform: "translateY(-1px)",
          boxShadow: "sm",
        },
      },
      secondary: {
        bg: "lummy.pink.200",
        color: "lummy.purple.700",
        _hover: {
          bg: "lummy.pink.300",
        },
      },
      outline: {
        borderColor: "lummy.purple.500",
        color: "lummy.purple.500",
        _hover: {
          bg: "lummy.purple.50",
        },
      },
      ghost: {
        color: "lummy.gray.600",
        _hover: {
          bg: "lummy.gray.100",
        },
      },
    },
    defaultProps: {
      variant: "primary",
    },
  },
  Card: {
    baseStyle: {
      p: 4,
      borderRadius: "md",
      bg: "white",
      boxShadow: "sm",
      borderWidth: "1px",
      borderColor: "gray.100",
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: "full",
      px: 2,
      py: 0.5,
      fontWeight: "medium",
      fontSize: "xs",
    },
    variants: {
      subtle: (props: { colorScheme: string }) => ({
        bg: `${props.colorScheme}.100`,
        color: `${props.colorScheme}.700`,
      }),
    },
    defaultProps: {
      variant: "subtle",
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "semibold",
    },
  },
};

// Create the theme
const theme = extendTheme({
  colors,
  fonts,
  components,
  styles: {
    global: {
      body: {
        bg: "white",
        color: "lummy.gray.800",
      },
    },
  },
});

export default theme;
