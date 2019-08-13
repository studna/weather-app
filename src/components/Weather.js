import React from "react";
import PropTypes from "prop-types";
import WeatherResource from "../resources/weather";
import WeatherCard from "./WeatherCard";

const Weather = ({ location }) => {
  const weather = WeatherResource.read(location.latlng);

  return <WeatherCard details={weather} location={location} />;
};

Weather.propTypes = {
  location: PropTypes.object.isRequired
};

export default Weather;
