import React, { useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import places from "places.js";

import Input from "./Input";

const AlgoliaPlaces = ({ onClear, onChange, ...props }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const channel = places({
      appId: "pl4QUTZ0ENO0",
      apiKey: "1e6a2a8b596d84b5831d627da78eab30",
      container: inputRef.current,
      templates: {
        value: suggestion => suggestion.name
      }
    }).configure({
      type: "city",
      aroundLatLngViaIP: true
    });

    if (onChange) {
      channel.on("change", ({ suggestion }) => {
        onChange(suggestion);
        inputRef.current.blur();
      });

      const onClearDefault = () => onChange(null);
      channel.on("clear", onClear || onClearDefault);
    }

    return () => {
      channel.destroy();
    };
  }, [onChange, onClear]);

  return <Input innerRef={inputRef} {...props} />;
};

AlgoliaPlaces.propTypes = {
  onChange: PropTypes.func,
  onClear: PropTypes.func
};

export default memo(AlgoliaPlaces);
