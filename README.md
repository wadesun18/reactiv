# Shopify Storefront Product Browser

## Overview 

This React Native application simulates a Shopify storefront, allowing users to browse products, view detailed product information—including variant selection—and manage a shopping cart. The app fetches product data from a static JSON file (mimicking the Shopify Storefront API) and persists cart data using AsyncStorage.

## Technology Stack

- React Native with TypeScript
- React Navigation (Bottom Tab Navigator and Stack Navigator)
- React Context API for state management (ProductContext and CartContext)
- styled-components for styling
- @react-native-async-storage/async-storage for persisting cart data
- react-native-config for environment variables
- @shopify/flash-list for efficient list rendering
- Jest and @testing-library/react-native for unit testing

## Run the project locally

### Prerequisties

- Node.js (v14+ recommended)
- Yarn
- Java Development Kit (JDK) 17 for Android development
- Android Studio (for Android)
- Xcode (for iOS)

### Step 1: Create a .env file from root 

Create a .env file from root directory and add the following line to the file. In the production app, this url should be private and will not appear in the README file.

```
API_URL=https://gist.githubusercontent.com/tsopin/22b7b6b32cef24dbf3dd98ffcfb63b1a/raw/6f379a4730ceb3c625afbcb0427ca9db7f7f3b8b/testProducts.json
```

### Step 2: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
yarn start
```

### Step 3: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
yarn android
```

### iOS

For iOS, run pod install inside the ios folder

```sh
pod install
```

then

```sh
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

## Testing

Run unit test with 

```
yarn test
```

## Notes 
1. In the API, we might run into an issue where availableForSale is true but quantity is 0. In ProductListScreen and ProductDetailsScreen, the default image/price are pointing to the first variant that is availableForSale but that does not mean the variant has any stocks.
2. After the user adds an item to the cart, the quantity does not decrease. This only happens in this exercise. In real live app, we would call/refresh the API to update the quantity

## Demos

### iOS 

[![Demo](./iOS%20Demo.gif)](./iOS%20Demo.gif)

### Android
[![Demo](./Android%20Demo.gif)](./Android%20Demo.gif)

## Roadmap
- Accessibility improvements
- Observability enhancements
- Localization support
- Update quantity directly from the cart


