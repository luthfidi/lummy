import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import theme from "./styles/theme";
import { WalletProvider } from "./context/WalletContext";
import "./index.css";

/**
 * Application entry point.
 * Sets up:
 * - React strict mode
 * - Light color mode with Chakra UI
 * - Wallet context for blockchain integration
 * - Browser routing for navigation
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Force light mode */}
    <ColorModeScript initialColorMode="light" />
    <ChakraProvider
      theme={theme}
      colorModeManager={{
        get: () => "light",
        set: () => {},
        type: "localStorage",
      }}
    >
      <WalletProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WalletProvider>
    </ChakraProvider>
  </React.StrictMode>
);
