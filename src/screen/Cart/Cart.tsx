import React, { useContext } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { Colors, FontSize, Spacing } from "../../constants";
import { CartContext } from "../../context/CartContext";

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.lightGray};
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
  padding: ${Spacing.medium}px;
`;

const CartItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.white};
  border-radius: 8px;
  padding: ${Spacing.small}px;
  margin-bottom: ${Spacing.medium}px;
  elevation: 2;
  shadow-color: ${Colors.black};
  shadow-opacity: 0.1;
  shadow-radius: 2px;
`;

const ProductImage = styled.Image`
  width: 80px;
  height: 80px;
  resize-mode: cover;
  border-radius: 8px;
  margin-right: ${Spacing.small}px;
`;

const ItemInfo = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: ${FontSize.regular}px;
  font-weight: bold;
  color: ${Colors.darkGray};
`;

const VariantTitle = styled.Text`
  font-size: ${FontSize.regular}px;
  color: ${Colors.darkGray};
  margin-top: ${Spacing.xs}px;
`;

const Price = styled.Text`
  font-size: ${FontSize.regular}px;
  color: ${Colors.green};
  margin-top: ${Spacing.xs}px;
`;

const Quantity = styled.Text`
  font-size: ${FontSize.regular}px;
  color: ${Colors.darkGray};
  margin-top: ${Spacing.xs}px;
`;

const RemoveButton = styled.TouchableOpacity`
  padding: ${Spacing.small}px;
  background-color: ${Colors.errorRed};
  border-radius: 4px;
`;

const RemoveButtonText = styled.Text`
  color: ${Colors.white};
  font-size: ${FontSize.small}px;
`;

const TotalPriceContainer = styled.View`
  padding: ${Spacing.medium}px;
  align-items: flex-end;
  border-top-width: 1px;
  border-color: ${Colors.gray};
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const TotalPriceText = styled.Text`
  font-size: ${FontSize.large}px;
  font-weight: bold;
  color: ${Colors.darkGray};
`;

const EmptyCartText = styled.Text`
  font-size: ${FontSize.regular}px;
  color: ${Colors.darkGray};
  text-align: center;
  margin-top: ${Spacing.large}px;
`;

const CartScreen: React.FC = () => {
  const { cartItems, removeFromCart, getTotalPrice } = useContext(CartContext);

  const handleRemoveItem = (productId: string, variantId: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", onPress: () => removeFromCart(productId, variantId) },
      ],
    );
  };

  return (
    <SafeContainer edges={["top", "bottom"]}>
      <ScrollContainer>
        {cartItems.length === 0 ? (
          <EmptyCartText>Your cart is empty.</EmptyCartText>
        ) : (
          cartItems.map((item) => (
            <CartItemContainer key={`${item.product.id}-${item.variant.id}`}>
              <ProductImage source={{ uri: item.variant.image.url }} />
              <ItemInfo>
                <Title>{item.product.title}</Title>
                <VariantTitle>{item.variant.title}</VariantTitle>
                <Price>
                  {item.variant.price.amount} {item.variant.price.currencyCode}
                </Price>
                <Quantity>Quantity: {item.quantity}</Quantity>
              </ItemInfo>
              <RemoveButton
                onPress={() =>
                  handleRemoveItem(item.product.id, item.variant.id)
                }
              >
                <RemoveButtonText>Remove</RemoveButtonText>
              </RemoveButton>
            </CartItemContainer>
          ))
        )}
      </ScrollContainer>
      <TotalPriceContainer>
        <TotalPriceText>Subtotal: ${getTotalPrice()}</TotalPriceText>
      </TotalPriceContainer>
    </SafeContainer>
  );
};

export default CartScreen;
