import React from "react";
import "./Card.css";

const Card = ({ id, name, price, photo, onBuyFlower, onRemoveFlower  }) => {
  return (
    <div className="card-container">
      <img className="card-image" alt="flower" src={photo} />
      <div className="card-details">
        <p>{name}</p>
        <p>Price: {price} ETH</p>
      </div>
      {onRemoveFlower ? (
            <>
                <button className="card-button" onClick={() => onBuyFlower(id)}>
                    Buy
                </button>
                <button className="card-button" onClick={() => onRemoveFlower(id)}>
                    Remove
                </button>
            </>
        ) : (
            <button className="card-button" onClick={() => onBuyFlower(id)}>
                Buy
            </button>
        )}
    </div>
  );
};

export default Card;
