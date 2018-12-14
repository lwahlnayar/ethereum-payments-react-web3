import React from "react";
import ReactDOM from "react-dom";
import Web3 from "web3";

import Snippet from "./Snippet";
import "./styles.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      mainAcc: "0x45881CE139BC8a608d1EC48e55E32BA588643413",
      friendAcc: "0x4c97fa543F684d591153Af6e6ec1E251cf0204c0",
      changeFlag: false
    };
    this.setFlag = this.setFlag.bind(this);
    this.removeFlag = this.removeFlag.bind(this);
  }

  async componentDidMount() {
    if (typeof web3 !== "undefined") {
      this.setState({ web3Provider: true });
      web3.version.getNetwork((err, netId) => {
        switch (netId) {
          case "1":
            this.setState({ network: "Mainnet" });
            break;
          case "2":
            this.setState({ network: "Morden" });
            break;
          case "3":
            this.setState({ network: "Ropsten" });
            break;
          case "4":
            this.setState({ network: "Rinkeby" });
            break;
          case "42":
            this.setState({ network: "Kovan" });
            break;
          default:
            this.setState({ network: "Unknown" });
        }
      });
    } else {
      console.log("No web3 provider found.");
      this.setState({ web3Provider: false });
    }
  }

  setFlag() {
    this.setState({ changeFlag: true });
  }

  removeFlag() {
    this.setState({ changeFlag: false });
  }

  render() {
    let { mainAcc, friendAcc, network, changeFlag, web3Provider } = this.state;

    let mainHtml = (
      <div className="prov">
        <h1>Send and Receive Ether Below</h1>
        <h2>[Network: {network}]</h2>
        <div id="flex-container">
          <Snippet
            changeFlag={changeFlag}
            setFlag={this.setFlag}
            removeFlag={this.removeFlag}
            account={mainAcc}
            receiver={friendAcc}
          />
          <Snippet
            changeFlag={changeFlag}
            setFlag={this.setFlag}
            removeFlag={this.removeFlag}
            account={friendAcc}
            receiver={mainAcc}
            style={"friendCss"}
          />
        </div>
      </div>
    );

    let noProviderHtml = (
      <div className="prov">
        <h1>No Web3 provider found.</h1>
        <h2>
          We recommend using the <a href="https://metamask.io/">Metamask</a>{" "}
          browser extension. It only takes 2 minutes to set up!
        </h2>
      </div>
    );

    return (
      <div className="App">
        {mainAcc && friendAcc && web3Provider ? mainHtml : noProviderHtml}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
