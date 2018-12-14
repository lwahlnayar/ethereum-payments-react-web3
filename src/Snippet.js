import React from "react";
import ReactDOM from "react-dom";
import Web3 from "web3";

import "./styles.css";
//Note: In the future I would use a HOC to pass the web3
//instance to child components. For contingeny reasons
//I just created a new web3 instance in several occasions

export default class Snippet extends React.Component {
  constructor() {
    super();
    this.state = {
      account: "",
      gasDefault: 85000
    };
    this.update = this.update.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.send = this.send.bind(this);
  }

  async componentDidMount() {
    this.update();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.changeFlag !== nextProps.changeFlag) {
      this.props.removeFlag();
      this.update();
    }
  }

  async update() {
    const web3js = new Web3(web3.currentProvider);
    let balanceWei = await web3js.eth.getBalance(this.props.account);
    let balance = web3.fromWei(balanceWei, "ether");
    this.setState({
      account: this.props.account,
      receiver: this.props.receiver,
      balance,
      balanceWei
    });
  }

  checkTransaction(tx) {
    const web3js = new Web3(web3.currentProvider);
    setTimeout(async () => {
      const checker = await web3js.eth.getTransactionReceipt(tx);
      if (checker) {
        this.props.setFlag();
        this.setState({ loading: false });
        return checker;
      } else {
        this.checkTransaction(tx);
      }
    }, 15 * 1000);
  }

  send() {
    if (
      !this.state.loading &&
      this.state.input > 0 &&
      this.state.input < this.state.balance
    ) {
      let obj = {
        to: this.state.receiver,
        from: this.state.account,
        value: web3.toWei(this.state.input, "ether"),
        gas: this.state.gasDefault,
        gasLimit: "100000"
      };
      web3.eth.sendTransaction(obj, async (e, tx) => {
        if (e) {
          alert(`Something went wrong! Try switching accounts - ${e}`);
          console.log("ERROR->", e);
        } else {
          this.setState({ loading: true });
          this.checkTransaction(tx);
        }
      });
    } else {
      this.state.input > this.state.balance &&
        alert("You have exceeded your balance!");
      this.state.input <= 0 && alert("Please add an appropriate value.");
      !this.state.input && alert("Please add an Ether value.");
    }
  }

  handleChange(e) {
    let input = e.target.value;
    this.setState({ input });
  }

  render() {
    let { balance, account, receiver, loading } = this.state;
    let { style } = this.props;

    //DYNAMIC CSS
    let headerCss, sendCss, linkCss, divCss, inputCss;
    !style ? (headerCss = "header") : (headerCss = "header-fr");
    !style ? (linkCss = "acc-link") : (linkCss = "acc-link-fr");
    !style ? (divCss = "input-cont") : (divCss = "input-cont-fr");
    !style ? (inputCss = "eth-input") : (inputCss = "eth-input-fr");
    !style ? (sendCss = "send") : (sendCss = "send-fr");
    //CLOSE CSS

    let bodyHtml = (
      <div className="middle">
        <div>
          <div className="address">
            <span className="small"> User Address:</span> {account}
          </div>
          <div className="balance">
            <span className="small"> Account Balance:</span> {balance}
          </div>
          <a
            target="_blank"
            href={`https://ropsten.etherscan.io/address/${account}`}
            className={linkCss}
          >
            View account on Etherscan
          </a>
        </div>
        <div className="separator" />
        <p className="sf">Send to Friend</p>
        <div className={divCss}>
          <div className="input-center">
            <input
              className={inputCss}
              onChange={this.handleChange}
              placeholder="0.00"
              defaultValue=""
              name="input"
              type="number"
              autoComplete="off"
              step="0.01"
              max={balance}
              min="0"
            />
            <label htmlFor="input">Ether</label>
          </div>
        </div>
      </div>
    );

    let loadingHtml = (
      <div className="loading">
        <img src="/loading.gif" />
      </div>
    );

    return (
      <div className="snippet-component">
        <div className={`header ${headerCss}`}>
          <img className="burger " src="/burger_menu.png" />
        </div>
        {!loading ? bodyHtml : loadingHtml}
        <div className={sendCss} onClick={this.send}>
          Send
        </div>
      </div>
    );
  }
}
