/**
 * @format
 */
import React from "react";
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

import { name as appName } from "./app.json";
import { ProductProvider } from "./src/context/ProductContext";
import Navigation from "./src/navigation/index";

const App = () => {
  return (
    <ProductProvider>
      <Navigation />
    </ProductProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
