import React from "react";
import "./Navbar.css";

const Navbar = ({onRouteChange}) => {
    return (
        <nav>
            <div>
                <p>Flower Marketplace</p>
            </div>
            <div>
                <p
                    onClick={() => onRouteChange("home")}
                >home</p>
                <p
                    onClick={() => onRouteChange("cart")}
                >cart</p>
            </div>
        </nav>
    );
};

export default Navbar;