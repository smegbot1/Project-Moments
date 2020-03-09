import React, { Component, createContext } from "react";

export const ThemeContext = createContext();

class ThemeContextProvider extends Component {
  state = {
    height: this.props.height,
    width: this.props.width
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    return (
      <ThemeContext.Provider value={{ ...this.state }}>{this.props.children}</ThemeContext.Provider>
    );
  }
}

export default ThemeContextProvider;
