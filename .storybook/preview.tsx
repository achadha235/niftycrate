import { addDecorator } from "@storybook/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import NextNprogress from "nextjs-progressbar";
import React from "react";
import { ApolloProvider } from "react-apollo";
import tailwindConfig from "../tailwind.config";
import theme from "../src/styles/theme";
import "../src/styles/main.scss";

import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";

// Instantiate required constructor fields
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: "https://zerodwn.co/graphql",
});

const client = new ApolloClient({
  cache: cache,
  link: link,
});

addDecorator((storyFn) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ApolloProvider client={client}>
      <NextNprogress
        color={tailwindConfig.theme.colors.blue[500]}
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      {storyFn()}
    </ApolloProvider>
  </ThemeProvider>
));
