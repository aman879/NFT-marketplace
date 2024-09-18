import React from "react";
import "./Navbar.css";

const Navbar = ({ onRouteChange, onConnectWallet, connected, walletAddress }) => {
  return (
    <nav>
      <div className="nav-left">
        <p>Flower Marketplace</p>
      </div>
      <div className="nav-right">
        <p onClick={() => onRouteChange("home")}>Home</p>
        <p onClick={() => onRouteChange("cart")}>Cart</p>
        <button
         onClick={onConnectWallet}
         disabled={connected}
         >
          {connected ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
