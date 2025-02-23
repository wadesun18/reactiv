import { faShop } from "@fortawesome/free-solid-svg-icons/faShop";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/faShoppingCart";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Colors } from "../constants";
import { Product } from "../context/ProductContext";
import CartScreen from "../screen/Cart/Cart";
import ProductDetailsScreen from "../screen/Collection/ProductDetailsScreen";
import ProductListScreen from "../screen/Collection/ProductListScreen";

export type RootStackParamList = {
  ProductList: undefined;
  ProductDetails: { product: Product };
};

const CollectionStack = createStackNavigator<RootStackParamList>();

const CollectionStackNavigator = () => (
  <CollectionStack.Navigator>
    <CollectionStack.Screen
      name="ProductList"
      component={ProductListScreen}
      options={{ headerShown: false }}
    />
    <CollectionStack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={{
        headerShown: true, // Show header for product details
        headerTitle: "",
      }}
    />
  </CollectionStack.Navigator>
);

const Tab = createBottomTabNavigator();

const Navigation = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let icon;
              if (route.name === "Collection") {
                icon = faShop;
              } else if (route.name === "Cart") {
                icon = faShoppingCart;
              }
              return <FontAwesomeIcon icon={icon} size={size} color={color} />;
            },
            tabBarActiveTintColor: Colors.purple,
            tabBarInactiveTintColor: Colors.gray,
            tabBarStyle: {
              paddingTop: 10, // Add top padding here
            },
          })}
        >
          <Tab.Screen
            name="Collection"
            component={CollectionStackNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Navigation;
