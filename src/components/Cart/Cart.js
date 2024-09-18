import React from "react";
import CardList from "../CardList/CardList";

const Cart = ({ flowers, onBuyFlower, onRemoveFlower }) => {
    return (
        <div>
            <CardList flowers={flowers} onBuyFlower={onBuyFlower} onRemoveFlower={onRemoveFlower} />
        </div>
    );
}

export default Cart;
