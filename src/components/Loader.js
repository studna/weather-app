import React from "react";
import { createComponent } from "react-fela";

const Svg = createComponent(
  {
    animation: "loader-turn 1s linear infinite",
    padding: "1rem",
    maxWidth: "60px",
    width: "100%"
  },
  "svg",
  ["viewBox"]
);

const Circle = createComponent(
  ({ stroke, delay }) => ({
    stroke,
    animationDelay: delay,
    animation: "loader-stroke 6s linear infinite",
    fill: "none",
    strokeDasharray: "63",
    strokeDashoffset: "63",
    strokeLinecap: "round",
    strokeWidth: "4"
  }),
  "circle",
  Object.keys
);

const Loader = props => (
  <Svg {...props} viewBox="0 0 24 24">
    <Circle delay="0s" stroke="dodgerblue" cx="12" cy="12" r="10" />
    <Circle delay="1s" stroke="mediumspringgreen" cx="12" cy="12" r="10" />
    <Circle delay="2s" stroke="crimson" cx="12" cy="12" r="10" />
    <Circle delay="3s" stroke="peachpuff" cx="12" cy="12" r="10" />
    <Circle delay="4s" stroke="chocolate" cx="12" cy="12" r="10" />
    <Circle delay="5s" stroke="pik" cx="12" cy="12" r="10" />
  </Svg>
);

export default Loader;
