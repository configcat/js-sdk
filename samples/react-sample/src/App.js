import React, { Component } from 'react';
import './App.css';
import * as configcat from 'configcat-js';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.client = configcat.createClient("PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A");
  }

  handleClick() {
    var myUser = { identifier: "435170f4-8a8b-4b67-a723-505ac7cdea92"};
    this.client.getValue("keySampleText", "default value", (value) => {
      console.log("keySampleText: " + value);
    }, myUser);
  }

  render() {
    return (
      <div className="App">
      <button onClick={this.handleClick}>
        ClickMe!
      </button>
      </div>
    );
  }
}

export default App;
