import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Alert, ScrollView } from "react-native";
import Collapsible from "react-native-collapsible";
import styled from "styled-components/native";

import CustomText from "../../components/CustomText";
import { Colors, FontSize, Spacing } from "../../constants";
import { CartContext } from "../../context/CartContext";
import { ProductContext } from "../../context/ProductContext";
import { ProductVariant } from "../../context/ProductContext";
import { RootStackParamList } from "../../navigation/index";

type ProductDetailsRouteProp = RouteProp<RootStackParamList, "ProductDetails">;

const Container = styled(ScrollView)`
  flex: 1;
  background-color: ${Colors.white};
  padding-horizontal: ${Spacing.medium}px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 300px;
  resize-mode: contain;
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

const AddToCartButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${({ disabled }) =>
    disabled ? Colors.gray : Colors.purple};
  padding: ${Spacing.medium}px;
  border-radius: 8px;
  align-items: center;
  margin-vertical: ${Spacing.small}px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const ProductDetailsScreen: React.FC = () => {
  const { params } = useRoute<ProductDetailsRouteProp>();
  // Get the product from navigation params.
  const initialProduct = params.product;
  const { addToCart } = useContext(CartContext);
  const { refreshProducts } = useContext(ProductContext);

  // Default to the first available variant, if one exists; otherwise, use the first variant.
  const initialAvailable =
    initialProduct.variants.find((variant) => variant.availableForSale) ||
    initialProduct.variants[0];
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(initialAvailable);
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(false);

  const hasQuantityAvailable = selectedVariant.quantityAvailable > 0;
  // Check if selected variant is available.
  const isSelectedVariantAvailable =
    selectedVariant.availableForSale && hasQuantityAvailable;

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
      <CustomText
        size={FontSize.large}
        fontWeight="bold"
        marginBottom={Spacing.small}
        color={Colors.darkGray}
      >
        {initialProduct.title}
      </CustomText>
      {selectedVariant && (
        <CustomText
          color={Colors.green}
          fontWeight="bold"
          marginBottom={Spacing.small}
        >
          {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
        </CustomText>
      )}
      <CustomText
        size={FontSize.regular}
        marginBottom={Spacing.medium}
        color={Colors.darkGray}
      >
        {initialProduct.description}
      </CustomText>
      <VariantSectionHeader onPress={toggleVariants} activeOpacity={1}>
        <CustomText fontWeight="bold" color={Colors.darkGray}>
          {isVariantsExpanded ? "Hide Variants" : "Show Variants"}
        </CustomText>
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
                selected={selectedVariant.id === variant.id && variantAvailable}
                available={variantAvailable}
              >
                <CustomText
                  color={
                    selectedVariant.id === variant.id && variantAvailable
                      ? Colors.white
                      : Colors.darkGray
                  }
                  textDecorationLine={
                    variantAvailable ? "none" : "line-through"
                  }
                >
                  {variant.title} {!variantAvailable && "(Unavailable)"}
                </CustomText>
                {variant.quantityAvailable > 0 &&
                  variant.quantityAvailable <= 5 &&
                  variant.availableForSale && (
                    <CustomText
                      size={FontSize.small}
                      color={Colors.red}
                      marginTop={Spacing.xs}
                    >
                      Only {variant.quantityAvailable} left
                    </CustomText>
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
        <CustomText color={Colors.white} fontWeight="bold">
          Add to Cart
        </CustomText>
      </AddToCartButton>
    </Container>
  );
};

export default ProductDetailsScreen;
