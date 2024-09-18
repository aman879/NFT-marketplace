import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import flowersData from "./flowers.json";
import { WalletNotDetected } from './components/WalletNotDetected/WalletNotDetected';
import { ethers } from "ethers";
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: "home",
      bought: [],
      cart: [],
      flowers: flowersData.flowerlist,
      wallet: false,
      connected: false,
      walletAddress: "",
      txStatus: "",
      txMessage: ""
    };
  }

  componentDidMount() {
    if (window.ethereum === undefined) {
      this.setState({ wallet: false });
      console.log("Wallet not detected");
    } else {
      this.setState({ wallet: true });
      this.switchNetwork();
    }
  }

  switchNetwork = async () => {
    const chainIdHex = `0xaa36a7`;
    
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
      console.log("Network switched successfully");
    } catch (error) {
      console.error("Error switching network:", error);
    }
  };

  onRouteChange = (route) => {
    this.setState({ route });
  };

  onConnectWallet = async () => {
    if (!this.state.connected) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const _walletAddress = await signer.getAddress();
        this.setState({ connected: true, walletAddress: _walletAddress });
      } catch (error) {
        console.error("Connection Error:", error);
        this.setState({ txStatus: "error", txMessage: "Wallet connection failed. Please try again." });
        this.clearNotification();
      }
    }
  };

  onBuyFlower = (id) => {
    this.setState((prevState) => ({
      cart: [...prevState.cart, id],
    }));
  };

  onPayFlower = async (id, price) => {
    this.setState({ txStatus: "", txMessage: "" }); // Reset transaction status and message

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xa5C025Dd12a3A7cd403De2E532C7d01417630804", // Replace with your actual testnet wallet address
        value: ethers.parseEther(price.toString()) // Correct method for parsing Ether
      });

      const receipt = await tx.wait(); // Await the receipt to confirm the transaction

      this.setState({
        bought: [...this.state.bought, id],
        cart: this.state.cart.filter(item => item !== id),
        txStatus: "success",
        txMessage: "Payment successful!"
      });

      console.log(receipt);
    } catch (error) {
      console.error("Payment failed:", error);
      this.setState({ txStatus: "error", txMessage: "Payment failed. Please try again." });
    } finally {
      this.clearNotification();
    }
  };

  onRemoveFlower = (id) => {
    this.setState((prevState) => ({
      cart: prevState.cart.filter(item => item !== id),
    }));
  };

  clearNotification = () => {
    setTimeout(() => {
      this.setState({ txStatus: "", txMessage: "" });
    }, 2000);
  };

  render() {
    const { flowers, bought, cart, connected, walletAddress, txStatus, txMessage } = this.state;
    const filteredFlowers = flowers.filter(flower => !bought.includes(flower.id));
    const cartFlowers = flowers.filter(flower => cart.includes(flower.id));

    return (
      <>
        {this.state.wallet ? (
          <div>
            <Navbar 
              onRouteChange={this.onRouteChange} 
              onConnectWallet={this.onConnectWallet}
              connected={connected}
              walletAddress={walletAddress}
            />
            {this.state.route === "home" ? (
              <Home flowers={filteredFlowers} onBuyFlower={this.onBuyFlower} />
            ) : (
              <Cart 
                flowers={cartFlowers} 
                onBuyFlower={this.onPayFlower} 
                onRemoveFlower={this.onRemoveFlower}
              />
            )}
            {txMessage && (
              <div className={`tx-notification ${txStatus}`}>
                {txMessage}
              </div>
            )}
          </div>
        ) : (
          <WalletNotDetected />
        )}
      </>
    );
  }
}

export default App;
