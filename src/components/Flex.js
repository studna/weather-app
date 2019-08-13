import { createComponent } from "react-fela";

const Component = createComponent(({ column }) => ({
  display: "flex",
  flexDirection: column ? "column" : "row"
}));

export default Component;
