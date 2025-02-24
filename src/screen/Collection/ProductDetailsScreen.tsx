import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Alert } from "react-native";
import Collapsible from "react-native-collapsible";
import styled from "styled-components/native";

import { Colors, FontSize, Spacing } from "../../constants";
import { CartContext } from "../../context/CartContext";
import { ProductContext } from "../../context/ProductContext";
import { ProductVariant } from "../../context/ProductContext";
import { RootStackParamList } from "../../navigation/index";

type ProductDetailsRouteProp = RouteProp<RootStackParamList, "ProductDetails">;

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.white};
  padding: ${Spacing.medium}px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 300px;
  resize-mode: contain;
`;

const Title = styled.Text`
  font-size: ${FontSize.large}px;
  font-weight: bold;
  margin-vertical: ${Spacing.medium}px;
  color: ${Colors.darkGray};
`;

const Price = styled.Text`
  font-size: ${FontSize.regular}px;
  color: ${Colors.green};
  font-weight: 600;
  margin-bottom: ${Spacing.medium}px;
`;

const Description = styled.Text`
  font-size: ${FontSize.regular}px;
  margin-bottom: ${Spacing.large}px;
  color: ${Colors.darkGray};
`;

const VariantSectionHeader = styled.TouchableOpacity`
  border-width: 1px;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${Spacing.medium}px;
  padding-horizontal: ${Spacing.medium}px;
  margin-vertical: ${Spacing.medium}px;
  border-color: ${Colors.purple};
  flex-direction: row;
`;

const VariantSectionHeaderText = styled.Text`
  font-size: ${FontSize.regular}px;
  font-weight: bold;
  color: ${Colors.darkGray};
`;

const VariantList = styled.View`
  margin-vertical: ${Spacing.small}px;
`;

const VariantItem = styled.TouchableOpacity<{
  selected: boolean;
  available: boolean;
}>`
  padding: ${Spacing.small}px;
  background-color: ${({ selected }) =>
    selected ? Colors.darkGray : Colors.white};
  border-radius: 4px;
  margin-vertical: ${Spacing.xs}px;
  border: 1px solid ${Colors.gray};
  opacity: ${({ available }) => (available ? 1 : 0.5)};
`;

const VariantText = styled.Text<{ selected: boolean; available: boolean }>`
  font-size: ${FontSize.regular}px;
  color: ${({ selected }) => (selected ? Colors.white : Colors.darkGray)};
  text-decoration-line: ${({ available }) =>
    available ? "none" : "line-through"};
`;

const LowStockText = styled.Text`
  font-size: ${FontSize.small}px;
  color: ${Colors.errorRed};
  margin-top: ${Spacing.xs}px;
`;

const AddToCartButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? Colors.gray : Colors.purple};
  padding: ${Spacing.medium}px;
  border-radius: 8px;
  align-items: center;
  margin-vertical: ${Spacing.small}px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const ButtonText = styled.Text`
  color: ${Colors.white};
  font-size: ${FontSize.regular}px;
  font-weight: bold;
`;

const ProductDetailsScreen: React.FC = () => {
  const { params } = useRoute<ProductDetailsRouteProp>();
  // Get the product from navigation params.
  const initialProduct = params.product;
  const { addToCart } = useContext(CartContext);
  const { refreshProducts } = useContext(ProductContext);

  // Default to the first available variant, if one exists; otherwise, use the first variant.
  const initialAvailable =
    initialProduct.variants.find(
      (variant) => variant.availableForSale && variant.quantityAvailable > 0,
    ) || initialProduct.variants[0];
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(initialAvailable);
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(false);

  // Check if selected variant is available.
  const isSelectedVariantAvailable =
    selectedVariant.availableForSale && selectedVariant.quantityAvailable > 0;

  const toggleVariants = () => {
    setIsVariantsExpanded((prev) => !prev);
  };

  const handleSelectVariant = (variant: ProductVariant) => {
    if (!variant.availableForSale || variant.quantityAvailable === 0) {
      Alert.alert(
        "Variant Unavailable",
        "This variant is not available for sale.",
      );
      return;
    }
    setSelectedVariant(variant);
  };

  // When "Add to Cart" is pressed, call addToCart, show an alert,
  // then refresh product details (simulate API update).
  // If the variant is available, the user can keep on adding it to the cart. This won't happen
  // in the production env since the inventory will update
  const handleAddToCart = () => {
    if (!isSelectedVariantAvailable) {
      Alert.alert("Cannot Add to Cart", "Selected variant is not available.");
      return;
    }
    addToCart(initialProduct, selectedVariant);
    Alert.alert(
      "Added to Cart",
      `${initialProduct.title} - ${selectedVariant.title} has been added to your cart!`,
    );
    // call the API to update quantity and then refresh.
    refreshProducts();
  };

  return (
    <Container>
      <ProductImage
        source={{
          uri: selectedVariant.image?.url || initialProduct.images[0]?.url,
        }}
      />
      <Title>{initialProduct.title}</Title>
      {selectedVariant && (
        <Price>
          {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
        </Price>
      )}
      <Description>{initialProduct.description}</Description>

      <VariantSectionHeader onPress={toggleVariants} activeOpacity={1}>
        <VariantSectionHeaderText>
          {isVariantsExpanded ? "Hide Variants" : "Show Variants"}
        </VariantSectionHeaderText>
        <FontAwesomeIcon
          icon={isVariantsExpanded ? faArrowUp : faArrowDown}
          size={FontSize.large}
        />
      </VariantSectionHeader>
      <Collapsible collapsed={!isVariantsExpanded}>
        <VariantList>
          {initialProduct.variants.map((variant) => {
            const variantAvailable =
              variant.availableForSale && variant.quantityAvailable > 0;
            return (
              <VariantItem
                key={variant.id}
                onPress={() => handleSelectVariant(variant)}
                selected={selectedVariant.id === variant.id}
                available={variantAvailable}
              >
                <VariantText
                  selected={selectedVariant.id === variant.id}
                  available={variantAvailable}
                >
                  {variant.title} {!variantAvailable && "(Unavailable)"}
                </VariantText>
                {variant.quantityAvailable > 0 &&
                  variant.quantityAvailable <= 5 &&
                  variant.availableForSale && (
                    <LowStockText>
                      Only {variant.quantityAvailable} left
                    </LowStockText>
                  )}
              </VariantItem>
            );
          })}
        </VariantList>
      </Collapsible>
      <AddToCartButton
        onPress={handleAddToCart}
        disabled={!isSelectedVariantAvailable}
      >
        <ButtonText>Add to Cart</ButtonText>
      </AddToCartButton>
    </Container>
  );
};

export default ProductDetailsScreen;
