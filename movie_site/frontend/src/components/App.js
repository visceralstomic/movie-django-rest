import React, { Component } from "react";
import { render } from "react-dom";
import { HomePage } from "./homePage";

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return  (
      <React.Fragment>
        
        <HomePage />
      </React.Fragment>
    )
  }
}


export default App;

const app = document.getElementById('app');
render(<App />, app);
