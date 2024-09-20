import React, { useState } from "react";
import "./Card.css";

const Card = ({ id, name, price, photo, description}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // const handlePayClick = async () => {
  //   setIsProcessing(true);
  //   try {
  //     await onBuyFlower(id, price); // This will trigger the payment function
  //   } catch (error) {
  //     console.error("Transaction failed:", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // }

  return (
    <div className="card-container">
      <img className="card-image" alt="NFT" src={photo} />
      <div className="card-details">
        <p>{name}</p>
        <p>{description}</p>
        <p>Price: {price} ETH</p>
      </div>
      {/* <button
        className="card-button"
        onClick={handlePayClick}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Pay"}
      </button>
      {onRemoveFlower && (
        <button
          className="card-button"
          onClick={() => onRemoveFlower(id)}
        >
          Remove
        </button>
      )} */}
    </div>
  );
};

export default Card;
