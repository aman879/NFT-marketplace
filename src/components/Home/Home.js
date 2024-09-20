import React, { useEffect, useState } from "react";
import CardList from "../CardList/CardList";

const Home = ({ fetchUserNFTs, isConnected }) => {
    const [userNFTs, setUserNFTs] = useState([]);

    const fetchNFTs = async () => {
        const nftData = await fetchUserNFTs();
        setUserNFTs(nftData);
    };

    if (isConnected && userNFTs.length === 0) {
        fetchNFTs();
    }

    return (
        <div>
            {isConnected ? (
                <CardList userNFTs={userNFTs} />
            ) : (
                <div>
                    <p>connect wallet </p>
                </div>
            )}
            {/* <button onClick={() => fetchUserNFTs()}>click me</button> */}
        </div>
    );
}

export default Home;
