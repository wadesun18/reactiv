import { NavigationContainer } from "@react-navigation/native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

import ProductListScreen from "./ProductListScreen";
import { ProductContext } from "../../context/ProductContext";

jest.mock("react-native-config");
jest.mock("@shopify/flash-list", () => {
  const ActualFlashList = jest.requireActual("@shopify/flash-list").FlashList;
  return {
    ...jest.requireActual("@shopify/flash-list"),
    FlashList: (props) => (
      <ActualFlashList
        {...props}
        estimatedListSize={{ height: 1000, width: 400 }}
        horizontal={false}
      />
    ),
  };
});
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  const actualNavigation = jest.requireActual("@react-navigation/native");
  return {
    ...actualNavigation,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

const productsMock = [
  {
    id: "1",
    title: "Test Product 1",
    description: "A test product",
    descriptionHtml: "",
    availableForSale: true,
    handle: "test-product-1",
    productType: "Hoodie",
    tags: ["tag1", "tag2"],
    vendor: "Vendor Name",
    priceRange: {
      maxVariantPrice: { amount: "10.00", currencyCode: "USD" },
      minVariantPrice: { amount: "10.00", currencyCode: "USD" },
    },
    compareAtPriceRange: {
      maxVariantPrice: { amount: "15.00", currencyCode: "USD" },
      minVariantPrice: { amount: "15.00", currencyCode: "USD" },
    },
    images: [{ id: "img1", url: "http://example.com/image1.png" }],
    options: [],
    requiresSellingPlan: false,
    onlineStoreUrl: "http://example.com/product",
    media: [],
    variants: [
      {
        id: "var1",
        title: "Variant 1",
        quantityAvailable: 10,
        availableForSale: true,
        currentlyNotInStock: false,
        price: { amount: "10.00", currencyCode: "USD" },
        compareAtPrice: null,
        sku: "sku1",
        selectedOptions: [],
        image: { id: "img1", url: "http://example.com/image1.png" },
      },
    ],
    metafields: [],
    collections: [],
  },
];

describe("ProductListScreen", () => {
  it("displays a loading indicator when isLoading is true", () => {
    const contextValue = {
      products: [],
      isLoading: true,
      error: null,
      refreshProducts: jest.fn(),
    };

    const { getByTestId } = render(
      <ProductContext.Provider value={contextValue}>
        <NavigationContainer>
          <ProductListScreen />
        </NavigationContainer>
      </ProductContext.Provider>,
    );

    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("displays an error message when error exists", () => {
    const contextValue = {
      products: [],
      isLoading: false,
      error: "Test error message",
      refreshProducts: jest.fn(),
    };

    const { getByText } = render(
      <ProductContext.Provider value={contextValue}>
        <NavigationContainer>
          <ProductListScreen />
        </NavigationContainer>
      </ProductContext.Provider>,
    );

    expect(getByText(/Error: Test error message/i)).toBeTruthy();
  });

  it("renders the product list when products exist", async () => {
    const contextValue = {
      products: productsMock,
      isLoading: false,
      error: null,
      refreshProducts: jest.fn(),
    };

    const { getByText, queryByTestId } = render(
      <ProductContext.Provider value={contextValue}>
        <NavigationContainer>
          <ProductListScreen />
        </NavigationContainer>
      </ProductContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText("Test Product 1")).toBeTruthy();
    });
    expect(queryByTestId("loading-indicator")).toBeNull();
  });

  it("navigates to ProductDetailsScreen on product press", async () => {
    const contextValue = {
      products: productsMock,
      isLoading: false,
      error: null,
      refreshProducts: jest.fn(),
    };

    const { getByText } = render(
      <ProductContext.Provider value={contextValue}>
        <NavigationContainer>
          <ProductListScreen />
        </NavigationContainer>
      </ProductContext.Provider>,
    );

    await waitFor(() => {
      expect(getByText("Test Product 1")).toBeTruthy();
    });

    const productCard = getByText("Test Product 1");
    fireEvent.press(productCard);

    expect(mockNavigate).toHaveBeenCalledWith("ProductDetails", {
      product: productsMock[0],
    });
  });
});
