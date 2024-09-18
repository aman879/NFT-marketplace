import React, { Component } from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Cart from './components/Cart/Cart';
import flowersData from "./flowers.json";
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      route: "home",
      bought: [],
      cart: [],
      flowers: flowersData.flowerlist,
    };
  }

  onRouteChange = (route) => {
    this.setState({ route });
  };

  onBuyFlower = (id) => {
    this.setState((prevState) => ({
      cart: [...prevState.cart, id],
    }));
  };

  onPayFlower = (id) => {
    this.setState((prevState) => ({
      bought: [...prevState.bought, id],
      cart: prevState.cart.filter(item => item !== id),
    }));
  };

  onRemoveFlower = (id) => {
    this.setState((prevState) => ({
      cart: prevState.cart.filter(item => item !== id),
    }));
  };

  render() {
    const { flowers, bought, cart } = this.state;
    const filteredFlowers = flowers.filter(flower => !bought.includes(flower.id));
    const cartFlowers = flowers.filter(flower => cart.includes(flower.id));

    return (
      <div>
        <Navbar onRouteChange={this.onRouteChange} />
        {this.state.route === "home" ? (
          <Home flowers={filteredFlowers} onBuyFlower={this.onBuyFlower} />
        ) : (
          <Cart flowers={cartFlowers} onBuyFlower={this.onPayFlower} onRemoveFlower={this.onRemoveFlower} />
        )}
      </div>
    );
  }
}

export default App;
