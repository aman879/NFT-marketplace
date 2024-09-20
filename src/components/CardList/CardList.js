import React from "react";
import Card from "../Card/Card";

const CardList = ({ userNFTs }) => {
    console.log(userNFTs)
    let cardComponents = [];
    if(userNFTs) {
        cardComponents = userNFTs.map((nft) => {
          return (
            <Card
              key={nft.id}
              id={nft.id}
              name={nft.data.data.name}
              price={nft.price}
              description={nft.data.data.description}
              photo={nft.data.data.image}
              // onBuyFlower={onPayFlower}
            />
          );
        });
    }

  return (
    <div>
      <h1>Your Minted NFTs</h1>
      {userNFTs.length === 0  ? (
        <p>No NFTs found.</p>
      ) : (
        <div className="card-list">
          {cardComponents}
        </div>
      )}
    </div>
  );
};

export default CardList;
