import React from "react";
import CardList from "../CardList/CardList";

const Home = ({flowers, onBuyFlower}) => {
    return(
        <div>
            <CardList flowers={flowers} onBuyFlower={onBuyFlower}/>
        </div>
    );
}

export default Home;