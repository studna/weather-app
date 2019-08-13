import React from "react";
import PropTypes from "prop-types";
import { createComponent } from "react-fela";
import Flex from "./Flex";
import Label from "./Label";

const Group = createComponent({}, Flex);

const InputControl = createComponent(
  {
    display: "block",
    width: "100%",
    height: "calc(1.5em + 1.3rem + 2px)",
    padding: ".65rem 1rem",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    border: "1px solid #e2e5ec",
    borderRadius: "4px",
    transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    ":focus": {
      color: "#495057",
      backgroundColor: "#fff",
      borderColor: "#9c97da",
      outline: "0"
    }
  },
  "input",
  Object.keys
);

const Input = ({ label, inline, extend, ...props }) => (
  <Group column={!inline} extend={extend}>
    {label && <Label>{label}</Label>}
    <InputControl {...props} />
  </Group>
);

Input.propTypes = {
  inline: PropTypes.bool,
  label: PropTypes.string,
  extend: PropTypes.object
};

export default Input;
