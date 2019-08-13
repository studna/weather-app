import { unstable_createResource } from "react-cache";
import { assoc, values } from "ramda";

const fetchWeather = latlng => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${
      latlng.lat
    }&lon=${latlng.lng}&appid=0ca4839e19cbf9dafd6f6688d1e95626`
  ).then(res => res.json());
};

export default unstable_createResource(fetchWeather, latlng =>
  values(latlng).join("_")
);
