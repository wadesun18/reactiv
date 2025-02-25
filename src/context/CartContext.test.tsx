import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import { act, render, waitFor } from "@testing-library/react-native";
import React, { useContext } from "react";
import { Text } from "react-native";

import { CartContext, CartProvider } from "./CartContext";
import { Product, ProductVariant } from "./ProductContext";

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

const dummyProduct: Product = {
  id: "p1",
  title: "Test Product",
  description: "Description of Test Product",
  descriptionHtml: "",
  images: [{ id: "img1", url: "http://example.com/img1.png" }],
  variants: [
    {
      id: "v1",
      title: "Variant 1",
      price: { amount: "10.00", currencyCode: "CAD" },
      availableForSale: true,
      quantityAvailable: 5,
      image: { id: "img1", url: "http://example.com/img1.png" },
    },
  ],
};

const testVariant: ProductVariant = {
  id: "testVariant",
  title: "testVariant 1",
  price: { amount: "10.55", currencyCode: "CAD" },
  availableForSale: true,
  quantityAvailable: 5,
  image: { id: "img1", url: "http://example.com/img1.png" },
};

const testVariant2: ProductVariant = {
  id: "testVariant 2",
  title: "testVariant 2",
  price: { amount: "100.55", currencyCode: "CAD" },
  availableForSale: true,
  quantityAvailable: 1,
  image: { id: "img1", url: "http://example.com/img1.png" },
};

const TestComponent: React.FC = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, getTotalPrice } =
    useContext(CartContext);
  return (
    <>
      <Text testID="cart-length">{cartItems.length}</Text>
      <Text testID="total-price">{getTotalPrice()}</Text>
      <Text
        testID="addToCart"
        onPress={() => addToCart(dummyProduct, dummyProduct.variants[0])}
      >
        Add
      </Text>
      <Text
        testID="addToCartVariant1"
        onPress={() => addToCart(dummyProduct, testVariant)}
      >
        Add Variant 1
      </Text>
      <Text
        testID="addToCartVariant2"
        onPress={() => addToCart(dummyProduct, testVariant2)}
      >
        Add Variant 1
      </Text>
      <Text
        testID="removeFromCart"
        onPress={() =>
          removeFromCart(dummyProduct.id, dummyProduct.variants[0].id)
        }
      >
        Remove
      </Text>
      <Text testID="clearCart" onPress={() => clearCart()}>
        Clear
      </Text>
    </>
  );
};

describe("CartContext", () => {
  const renderWithCartProvider = () => {
    return render(
      <CartProvider>
        <TestComponent />
      </CartProvider>,
    );
  };

  it('should start with an empty cart and total price "0.00"', async () => {
    const { getByTestId } = renderWithCartProvider();
    await waitFor(() => {
      expect(getByTestId("cart-length").props.children).toBe(0);
    });
    expect(getByTestId("total-price").props.children).toBe("0.00");
  });

  it("should add a product to the cart", async () => {
    const { getByTestId } = renderWithCartProvider();

    act(() => {
      getByTestId("addToCart").props.onPress();
    });
    expect(getByTestId("cart-length").props.children).toBe(1);
    expect(getByTestId("total-price").props.children).toBe("10.00");

    act(() => {
      getByTestId("addToCart").props.onPress();
    });

    // The number of cart items stays 1 because the quantity increases.
    expect(getByTestId("cart-length").props.children).toBe(1);
    expect(getByTestId("total-price").props.children).toBe("20.00");
  });

  it("should remove a product from the cart", () => {
    const { getByTestId } = renderWithCartProvider();

    act(() => {
      getByTestId("addToCart").props.onPress();
    });
    expect(getByTestId("cart-length").props.children).toBe(1);

    act(() => {
      getByTestId("removeFromCart").props.onPress();
    });
    expect(getByTestId("cart-length").props.children).toBe(0);
    expect(getByTestId("total-price").props.children).toBe("0.00");
  });

  // requirement: test basic cart calculation
  it("should return correct cart total calculation", () => {
    const { getByTestId } = renderWithCartProvider();

    act(() => {
      getByTestId("addToCart").props.onPress();
    });
    expect(getByTestId("cart-length").props.children).toBe(1);

    act(() => {
      getByTestId("addToCartVariant1").props.onPress();
    });
    expect(getByTestId("cart-length").props.children).toBe(2);
    expect(getByTestId("total-price").props.children).toBe("20.55");

    act(() => {
      getByTestId("addToCartVariant2").props.onPress();
    });
    expect(getByTestId("cart-length").props.children).toBe(3);
    expect(getByTestId("total-price").props.children).toBe("121.10");
  });
});
