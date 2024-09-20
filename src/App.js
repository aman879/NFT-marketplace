import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import { WalletNotDetected } from './components/WalletNotDetected/WalletNotDetected';
import Mint from './components/Mint/Mint';
import { PinataSDK } from 'pinata-web3';
import { ethers } from "ethers";
import './App.css';

import { contractAddress } from './address';
import NFTArtiface from "./contracts/NFT.json";



const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINATA_JWT,
  pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: "home",
      bought: [],
      cart: [],
      wallet: false,
      connected: false,
      walletAddress: "",
      txStatus: "",
      txMessage: "",
      contract: undefined,
      id: 0
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
    // const chainIdHex = `0x7a69`;
    
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

        const _contract = new ethers.Contract(
          contractAddress.NFT,
          NFTArtiface.abi,
          await provider.getSigner(0)
        )
        
        this.setState({ connected: true, walletAddress: _walletAddress, contract: _contract });
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
    this.setState({ txStatus: "", txMessage: "" }); 

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0xa5C025Dd12a3A7cd403De2E532C7d01417630804", 
        value: ethers.parseEther(price.toString()) 
      });

      const receipt = await tx.wait(); 

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
  
  uploadToPinata = async (file, name, description) => {
    if(this.state.connected) {
      this.setState({ txStatus: "loading", txMessage: "Uploading to Pinata..." });
      
      try {
        const uploadImage = await pinata.upload
        .file(file);
        const metadata = await pinata.upload
        .json({
          name: name,
          description: description,
          image: `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
        })
  
      this.setState({ txStatus: "success", txMessage: "Upload to Pinata successful!" });
      return metadata.IpfsHash;
      } catch (error) {
        console.log("Error uploading to Pinata:", error);
        this.setState({ txStatus: "error", txMessage: "Upload to Pinata failed." });
      } finally {
        this.clearNotification();
      }
    } else {
      this.setState({txStatus: "error", txMessage: "Connect wallet please"})
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


  mintNFT = async(price, uri) => {
    this.setState({ txStatus: "loading", txMessage: "Minting" });
    try {
      const priceTowei = ethers.parseEther(price.toString());
      const tokenId = await this.state.contract.mint(this.state.walletAddress, priceTowei, uri);
      const response =await tokenId.wait();

      const _id = response.logs[2].topics[1]

      this.setState({id: _id});
      this.setState({ txStatus: "success", txMessage: "Minting successful!" });

      this.onRouteChange("home");
    } catch(e) {
      console.log("cannot mint", e);
      this.setState({ txStatus: "error", txMessage: "Minting NFT failed." });
    } finally {
      this.clearNotification();
    }
  }

  fetchUserNFTs = async() => {
    console.log("here");
    if (this.state.connected && this.state.contract) {
      try {
        console.log("here2");
        const nfts = await this.state.contract.getUserNFTs(this.state.walletAddress);
        const nftData = await Promise.all(nfts.map(async (id) => {
          const price = await this.state.contract.getNFtPrice(id);
          const uri = await this.state.contract.getUri(id);
          const data = await pinata.gateways.get(uri);
          return { id, price: ethers.formatEther(price), uri, data };
        }));
        console.log(nfts);
        return nftData;
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }
  }
  
  render() {
    const { bought, cart, connected, walletAddress, txStatus, txMessage, userNFTs } = this.state;
    // const filteredFlowers = flowers.filter(flower => !bought.includes(flower.id));
    // const cartFlowers = flowers.filter(flower => cart.includes(flower.id));


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
              <Home  fetchUserNFTs={this.fetchUserNFTs} isConnected={connected}/>
            ) : this.state.route === "mint" ? (
              <Mint uploadToPinata={this.uploadToPinata} mintNFT={this.mintNFT}/>
            ) :(
              <Cart 
                // flowers={cartFlowers} 
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
