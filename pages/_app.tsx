import type { AppProps } from "next/app";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ProgressBar from "@badrap/bar-of-progress";
import Router from "next/router";

import "@fontsource/open-sans";

/* Custom Button Styles */
const Button = {
  baseStyle: {
    w: "100%",
    fontWeight: "normal",
    borderRadius: "0",
    fontSize: "14px",
    border: "1px",
    transition: "0.3s ease-out",
  },
  variants: {
    secondary: {
      border: "0px",
      size: "sm",
      fontSize: "14px",
      p: [1, 1, 2],
      minH: "auto",
      h: "auto",
      w: "full",
      justifyContent: "flex-start",
      _hover: { bg: "gray.100" },
    },
  },
};

const theme = extendTheme({
  fonts: {
    heading: "Open Sans",
    body: "Open Sans",
  },
  components: {
    Button,
  },
});

/* Loading Page Progress Bar */
const progress = new ProgressBar({ size: 5, color: "black", delay: 100 });

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
