import styled from "styled-components";
interface ThemeInterface {
  blue: {
    default: string;
    hover: string;
  };
  pink: {
    default: string;
    hover: string;
  };
}

const theme: ThemeInterface = {
  blue: {
    default: "#3f51b5",
    hover: "#283593",
  },
  pink: {
    default: "#e91e63",
    hover: "#ad1457",
  },
};

const Button = styled.button`
  background-color: ${(props) => props.theme.default};
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  outline: 0;
  border: 0;
  text-transform: uppercase;
  margin: 10px 0px;
  cursor: pointer;
  box-shadow: 0px 2px 2px lightgray;
  transition: ease background-color 250ms;
`;

Button.defaultProps = {
  theme: theme.blue,
};

export default Button;
