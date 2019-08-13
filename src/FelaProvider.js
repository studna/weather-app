import { createRenderer } from "fela";

import React from "react";

import PropTypes from "prop-types";

import { RendererProvider, ThemeProvider } from "react-fela";
import extend from "fela-plugin-extend";
import prefixer from "fela-plugin-prefixer";
import namedKeys from "fela-plugin-named-keys";
import fallbackValue from "fela-plugin-fallback-value";

import theme from "./theme";

const namedKeysPlugin = namedKeys({
  mobile: "@media (max-width: 768px)",
  phablet: "@media (min-width: 768px) and (max-width: 1024px)",
  tablet: "@media (min-width: 1024px) and (max-width: 1200px)",
  desktop: "@media (min-width: 1200px)"
});

const renderer = createRenderer({
  plugins: [prefixer(), fallbackValue(), extend(), namedKeysPlugin]
});

const staticStyles = `
  @import url('https://fonts.googleapis.com/css?family=Poppins:500,600|Roboto:300,400&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/weather-icons/2.0.9/css/weather-icons.min.css');

  * {
    font-family: Roboto, sans-serif;
  }

  html, body {
    font-size: 14px;
  }

  *, ::after, ::before {
    box-sizing: border-box;
  }

  @keyframes loader-turn {
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(720deg);
    }
  }

  @keyframes loader-stroke {
    8.33333% {
      stroke-dashoffset: 0;
    }
    16.66667%, 100% {
      stroke-dashoffset: 63;
    }
  }
`;

renderer.renderStatic(staticStyles.toString());

class FelaProvider extends React.PureComponent {
  render() {
    return (
      <RendererProvider renderer={renderer}>
        <ThemeProvider theme={theme}>
          {React.Children.only(this.props.children)}
        </ThemeProvider>
      </RendererProvider>
    );
  }
}

FelaProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export default FelaProvider;
