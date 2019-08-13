/*

credit goes to https://codepen.io/pbmchc/pen/byxPzz

*/
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";
import ct from "countries-and-timezones";

import { head } from "ramda";
import "./WeatherCard.css";

const TIME_OF_DAY = {
  DAY: "DAY",
  NIGHT: "NIGHT"
};

const WEATHER_CONDITIONS = {
  CLEAR: "Clear",
  CLOUDS: "Clouds",
  RAIN: "Rain",
  SNOW: "Snow"
};

const TEMPERATURE_UNIT = {
  CELSIUS: "CELSIUS",
  FAHRENHEIT: "FAHRENHEIT"
};

const ThemeContext = React.createContext();

const WeatherMainScreen = props => {
  const { details, localTime } = props;
  const {
    main: { temp, temp_min, temp_max }
  } = details;
  const {
    sys: { sunrise, sunset, country }
  } = details;
  const city = `${details.name}, ${country}`;

  const theme = useContext(ThemeContext);

  return (
    <div
      className="weather-main-screen"
      style={{ backgroundColor: theme.skyMain }}
    >
      <WeatherAnimatedView />
      <WeatherBasicInfo
        city={city}
        description={details.weather[0].description}
        localTime={localTime}
      />
      <WeatherTemperature current={temp} min={temp_min} max={temp_max} />
      <WeatherIcon
        sunrise={sunrise}
        sunset={sunset}
        conditions={details.weather[0].main}
      />
    </div>
  );
};

const WeatherAnimatedView = props => {
  const { skyLight, hillLight, hillMid, hillMain } = useContext(ThemeContext);
  return (
    <div className="weather-animated-view">
      <div className="cloud" />
      <div className="cloud" />
      <div className="cloud" />
      <div>
        <div className="hill" style={{ backgroundColor: skyLight }} />
        <div className="hill" style={{ backgroundColor: hillLight }} />
        <div className="hill" style={{ backgroundColor: hillMid }}>
          <div className="house" style={{ borderColor: hillMid }}>
            <div className="window" />
          </div>
          <div className="tree" style={{ borderColor: hillMid }} />
          <div className="tree" style={{ borderColor: hillMid }} />
        </div>
        <div className="hill" style={{ backgroundColor: hillMain }} />
      </div>
    </div>
  );
};

const WeatherBasicInfo = props => {
  const { city, description, localTime } = props;

  return (
    <div className="weather-basic-info">
      <p>{city}</p>
      <p>{localTime.format("DD. MMM. HH:mm")}</p>
      <p>{description}</p>
    </div>
  );
};

const WeatherTemperature = props => {
  const [unit, setUnit] = useState(TEMPERATURE_UNIT.CELSIUS);
  const { current, ...boundaries } = Object.entries(props).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        [TEMPERATURE_UNIT.CELSIUS]: value.toFixed(),
        [TEMPERATURE_UNIT.FAHRENHEIT]: convertToFahrenheit(value).toFixed()
      }
    }),
    {}
  );
  const onUnitChange = () =>
    setUnit(
      unit === TEMPERATURE_UNIT.CELSIUS
        ? TEMPERATURE_UNIT.FAHRENHEIT
        : TEMPERATURE_UNIT.CELSIUS
    );

  return (
    <div onClick={onUnitChange} className="weather-temperature">
      <span className="wi wi-thermometer" />
      {current[unit]}
      <span className={`wi wi-${unit.toLowerCase()}`} />
      <div className="temperature-boundaries-container">
        <div className="temperature-boundaries">
          {Object.keys(boundaries).map(key => (
            <div className="temperature-boundary" key={key}>
              <span
                className={`wi wi-direction-${key === "min" ? "down" : "up"}`}
              />
              {boundaries[key][unit]}
              <span className={`wi wi-${unit.toLowerCase()}`} />
            </div>
          ))}
        </div>
      </div>
      <ClickAwareWeatherTemperatureOptions unit={unit} />
    </div>
  );
};

class WeatherTemperatureOptions extends React.Component {
  state = {
    settingsOpen: false
  };

  constructor(props) {
    super(props);

    this.updateSettingsVisibility = this.updateSettingsVisibility.bind(this);
    this.onSettingsChange = this.onSettingsChange.bind(this);
  }

  onClickedOutside() {
    this.updateSettingsVisibility({ settingsOpen: false });
  }

  onSettingsChange() {
    this.updateSettingsVisibility({ settingsOpen: false });
    this.props.onUnitChange();
  }

  updateSettingsVisibility(state) {
    const { settingsOpen } = state || this.state;

    this.setState({ settingsOpen });
  }

  render() {
    const { unit } = this.props;
    const unitClass =
      unit === TEMPERATURE_UNIT.CELSIUS
        ? TEMPERATURE_UNIT.FAHRENHEIT
        : TEMPERATURE_UNIT.CELSIUS;
    const settingsOpen = !this.state.settingsOpen;

    return (
      <div className="weather-temperature-options">
        {this.state.settingsOpen && (
          <div className="temperature-settings" onClick={this.onSettingsChange}>
            Switch to {<span className={`wi wi-${unitClass.toLowerCase()}`} />}
          </div>
        )}
        <i
          className="fas fa-cog"
          onClick={() => this.updateSettingsVisibility({ settingsOpen })}
        />
      </div>
    );
  }
}

const withClickedOutsideHandler = WrappedComponent => props => {
  const wrapperElement = React.useRef(null);
  const component = React.useRef(null);
  const clickListener = e => {
    if (wrapperElement.current.contains(e.target)) {
      return;
    }

    component.current.onClickedOutside();
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", clickListener);

    return () => {
      document.removeEventListener("mousedown", clickListener);
    };
  }, []);

  return (
    <div ref={wrapperElement}>
      <WrappedComponent ref={component} {...props} />
    </div>
  );
};

const ClickAwareWeatherTemperatureOptions = withClickedOutsideHandler(
  WeatherTemperatureOptions
);

const WeatherIcon = props => {
  const { conditions, ...otherProps } = props;
  const iconClass = getWeatherIcon(conditions);

  return (
    <div className="weather-icon">
      <div className={`weather-icon-main wi ${iconClass}`} />
      <WeatherDayLength {...otherProps} />
    </div>
  );
};

const WeatherDayLength = props => {
  const dayBoundaries = Object.values(props).map(ts =>
    moment.unix(ts).format("HH:mm")
  );

  return (
    <div className="weather-day-length">
      {dayBoundaries.map((boundary, index) => (
        <div key={boundary}>
          <div className="weather-day-length-icon">
            <i className={`wi wi-${index ? "moonrise" : "sunrise"}`} />
          </div>
          <span>{boundary}</span>
        </div>
      ))}
    </div>
  );
};

const WeatherInfoPanel = props => {
  const { clouds, humidity, pressure, wind } = props;
  const windSpeed = (wind.speed * 3.6).toFixed(1);

  const { hillMain } = useContext(ThemeContext);
  return (
    <div className="weather-info-panel" style={{ backgroundColor: hillMain }}>
      <div className="info-tiles-container">
        <div className="info-tiles-row">
          <WeatherInfoPanelTile
            title="Clouds"
            icon="wi-cloudy"
            value={`${clouds}%`}
          />
          <WeatherInfoPanelTile
            title="Humidity"
            icon="wi-raindrop"
            value={`${humidity}%`}
          />
          <WeatherInfoPanelTile
            title="Pressure"
            icon="wi-barometer"
            value={`${pressure}hPa`}
          />
          <WeatherInfoPanelTile
            title="Wind"
            icon="wi-strong-wind"
            value={`${windSpeed}kph`}
          />
        </div>
      </div>
    </div>
  );
};

const WeatherInfoPanelTile = ({ title, icon, value }) => (
  <div>
    <p>{title}</p>
    <i className={`wi ${icon}`} />
    <span>{value}</span>
  </div>
);

const WeatherCard = ({ details, location }) => {
  const tz = head(
    ct.getTimezonesForCountry(location.countryCode.toUpperCase())
  );

  moment.tz.setDefault((tz && tz.name) || "Europe/Prague");

  const theme = getApplicationTheme(head(details.weather).main);

  return (
    <div>
      {details && (
        <div className="weather-app">
          <ThemeContext.Provider value={theme}>
            <WeatherMainScreen details={details} localTime={moment()} />
            <WeatherInfoPanel
              clouds={details.clouds.all}
              wind={details.wind}
              pressure={details.main.pressure}
              humidity={details.main.humidity}
            />
          </ThemeContext.Provider>
        </div>
      )}
    </div>
  );
};

WeatherCard.propTypes = {
  details: PropTypes.object.isRequired
};

export default WeatherCard;

function getWeatherIcon(conditions) {
  const timeOfDay = getCurrentTimeOfDay();

  switch (conditions) {
    case WEATHER_CONDITIONS.CLOUDS:
      return `wi-${timeOfDay.toLowerCase()}-cloudy`;
    case WEATHER_CONDITIONS.RAIN:
      return `wi-${timeOfDay.toLowerCase()}-rain`;
    case WEATHER_CONDITIONS.SNOW:
      return `wi-${timeOfDay.toLowerCase()}-snow`;
    default:
      return `wi-${timeOfDay.toLowerCase()}-${
        timeOfDay === TIME_OF_DAY.DAY ? "sunny" : "clear"
      }`;
  }
}

function getCurrentTimeOfDay() {
  const currentTime = moment().hours();
  const isNight = time => time >= 20 || time <= 4;

  return isNight(currentTime) ? TIME_OF_DAY.NIGHT : TIME_OF_DAY.DAY;
}

function convertToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

function getApplicationTheme(conditions) {
  const timeOfDay = getCurrentTimeOfDay();

  if (timeOfDay === TIME_OF_DAY.NIGHT) {
    return {
      skyMain: "#051223",
      skyLight: "#1d2938",
      hillMain: "#111a27",
      hillMid: "#131d2b",
      hillLight: "#111d2d"
    };
  }

  switch (conditions) {
    case WEATHER_CONDITIONS.CLEAR:
      return {
        skyMain: "#f8a057",
        skyLight: "#fbb274",
        hillMain: "#a13c22",
        hillMid: "#c94a27",
        hillLight: "#e3612c"
      };
    case WEATHER_CONDITIONS.CLOUDS:
      return {
        skyMain: "#5eb5c9",
        skyLight: "#80c1d2",
        hillMain: "#0a3354",
        hillMid: "#11436c",
        hillLight: "#155181"
      };
    default:
      return {
        skyMain: "#738e97",
        skyLight: "#8a9fa8",
        hillMain: "#4c4c4d",
        hillMid: "#616161",
        hillLight: "#727374"
      };
  }
}
