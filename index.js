/**
 * @format
 */
import React from "react";
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import { CartProvider } from "./src/context/CartContext";
import { ProductProvider } from "./src/context/ProductContext";
import Navigation from "./src/navigation/index";

const App = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <Navigation />
      </CartProvider>
    </ProductProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
