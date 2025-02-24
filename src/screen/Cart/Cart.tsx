import React, { useContext } from "react";
import { Alert, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import CustomText from "../../components/CustomText";
import { Colors, FontSize, Spacing } from "../../constants";
import { CartContext, CartItem } from "../../context/CartContext";

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.lightGray};
`;

const CartContainer = styled.View`
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

const RemoveButton = styled.TouchableOpacity`
  padding: ${Spacing.small}px;
  background-color: ${Colors.red};
  border-radius: 4px;
`;

const TotalPriceContainer = styled.View`
  padding: ${Spacing.medium}px;
  align-items: flex-end;
  border-top-width: 1px;
  border-top-color: ${Colors.gray};
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const EmptyCartContainer = styled.View`
  justify-content: center;
  align-items: center;
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

  const renderItem = ({ item }: { item: CartItem }) => (
    <CartItemContainer>
      <ProductImage source={{ uri: item.variant.image.url }} />
      <ItemInfo>
        <CustomText fontWeight="bold" color={Colors.darkGray}>
          {item.product.title}
        </CustomText>
        <CustomText color={Colors.gray} marginTop={Spacing.xs}>
          {item.variant.title}
        </CustomText>
        <CustomText color={Colors.green} marginTop={Spacing.xs}>
          {item.variant.price.amount} {item.variant.price.currencyCode}
        </CustomText>
        <CustomText marginTop={Spacing.xs}>
          Quantity: {item.quantity}
        </CustomText>
      </ItemInfo>
      <RemoveButton
        onPress={() => handleRemoveItem(item.product.id, item.variant.id)}
      >
        <CustomText size={FontSize.small} color={Colors.white}>
          Remove
        </CustomText>
      </RemoveButton>
    </CartItemContainer>
  );

  return (
    <SafeContainer>
      <CartContainer>
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.product.id}-${item.variant.id}`}
          ListEmptyComponent={
            <EmptyCartContainer>
              <CustomText size={FontSize.large} color={Colors.darkGray}>
                Your cart is empty.
              </CustomText>
            </EmptyCartContainer>
          }
        />
      </CartContainer>
      <TotalPriceContainer>
        <CustomText
          size={FontSize.large}
          color={Colors.darkGray}
          fontWeight="bold"
        >
          Subtotal: ${getTotalPrice()}
        </CustomText>
        {/* //TODO: add taxes and total */}
      </TotalPriceContainer>
    </SafeContainer>
  );
};

export default CartScreen;
