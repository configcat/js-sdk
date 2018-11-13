import React, { Component } from 'react';
import './App.css';

class Demo extends Component {

  constructor(props) {
    super(props)
    this.checkAwesome = this.checkAwesome.bind(this);
    this.checkProofOfConcept = this.checkProofOfConcept.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.client = props.client;
    this.state = { userEmail: 'configcat@example.com' }
  }

  checkAwesome() {
    this.client.getValue('isAwesomeFeatureEnabled', false, (value) => {
      this.setState(() => ({ isAwesomeEnabled: value }))
    })
  }

  checkProofOfConcept() {
    const userObject = { identifier: '#SOME-USER-ID#', email: this.state.userEmail };
    this.client.getValue('isPOCFeatureEnabled', false, (value) => {
      this.setState({ isPOCEnabled: value })
    },
    userObject)
  }

  handleInputChange(event) {
    this.setState({ userEmail: event.target.value })
  }

  render() {
    return (
      <div>
        <h2>Simple feature flag.</h2>
        <button onClick={this.checkAwesome}>Check if Awesome Feature is turned ON</button>
        <p>Value returned from ConfigCat: <b>{this.state.isAwesomeEnabled !== undefined ? this.state.isAwesomeEnabled.toString() : ''}</b></p>
        <br />
        <h2>Feature with Targeting</h2>
        <p> Set up to be enabled only for users with an e-mail address that contains "@example.com"</p>
        <input type="text" value={this.state.userEmail} onChange={this.handleInputChange} />
        <button onClick={this.checkProofOfConcept}>Check POC feature with Email</button>
        <p>Value returned from ConfigCat: <b>{this.state.isPOCEnabled !== undefined ? this.state.isPOCEnabled.toString() : ''}</b></p>
        <br />
        <h2>ConfigCat Management Console</h2>
        <p>A screenshot to see how the ConfigCat Management Console looks like for this Sample Project.</p>
        <img alt="screenshot" src="mgmt_console.png" />
      </div>
    )
  }
}

export default Demo;