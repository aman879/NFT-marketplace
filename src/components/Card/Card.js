import React, { useState } from "react";
import "./Card.css";

const Card = ({ id, name, price, photo, onBuyFlower, onRemoveFlower }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayClick = async () => {
    setIsProcessing(true);
    try {
      await onBuyFlower(id, price);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="card-container">
      <img className="card-image" alt="flower" src={photo} />
      <div className="card-details">
        <p>{name}</p>
        <p>Price: {price} ETH</p>
      </div>
      {onRemoveFlower ? (
        <>
          <button
            className="card-button"
            onClick={handlePayClick}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay"}
          </button>
          <button
            className="card-button"
            onClick={() => onRemoveFlower(id)}
          >
            Remove
          </button>
        </>
      ) : (
        <button
          className="card-button"
          onClick={() => onBuyFlower(id)}
        >
          Buy
        </button>
      )}
    </div>
  );
};

export default Card;
