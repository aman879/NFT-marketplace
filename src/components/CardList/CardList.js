import React from "react";
import Card from "../Card/Card";

const CardList = ({ flowers, onBuyFlower, onRemoveFlower }) => {
    const cardComponents = flowers.map((flower) => {
        return (
            <Card
                key={flower.id}
                id={flower.id}
                name={flower.name}
                price={flower.price}
                photo={flower.photo}
                onBuyFlower={onBuyFlower}
                onRemoveFlower={onRemoveFlower}
            />
        );
    });

    return <div>{cardComponents}</div>;
};

export default CardList;
