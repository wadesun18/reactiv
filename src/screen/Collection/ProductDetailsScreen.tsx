import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import { Alert } from "react-native";
import Collapsible from "react-native-collapsible";
import styled from "styled-components/native";

import { Colors, FontSize, Spacing } from "../../constants";
import { CartContext } from "../../context/CartContext";
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
  active-opacity: 1;
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

const AddToCartButton = styled.TouchableOpacity`
  background-color: ${Colors.purple};
  padding: ${Spacing.medium}px;
  border-radius: 8px;
  align-items: center;
  margin-vertical: ${Spacing.small}px;
`;

const ButtonText = styled.Text`
  color: ${Colors.white};
  font-size: ${FontSize.regular}px;
  font-weight: bold;
`;

const ProductDetailsScreen: React.FC = () => {
  const { params } = useRoute<ProductDetailsRouteProp>();
  const { product } = params;

  // Default to the first variant.
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isVariantsExpanded, setIsVariantsExpanded] = useState(false);
  const { addToCart } = useContext(CartContext);

  const toggleVariants = () => {
    setIsVariantsExpanded((prev) => !prev);
  };

  const handleSelectVariant = (variant: (typeof product.variants)[0]) => {
    if (!variant.availableForSale) {
      Alert.alert(
        "Variant Unavailable",
        "This variant is not available for sale.",
      );
      return;
    }
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant);

    Alert.alert(
      "Added to Cart",
      `${product.title} - ${selectedVariant.title} has been added to your cart!`,
    );
  };

  return (
    <Container>
      <ProductImage
        source={{
          uri: selectedVariant.image?.url || product.images[0]?.url,
        }}
      />
      <Title>{product.title}</Title>
      {selectedVariant && (
        <Price>
          {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
        </Price>
      )}
      <Description>{product.description}</Description>

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
          {product.variants.map((variant) => (
            <VariantItem
              key={variant.id}
              onPress={() => handleSelectVariant(variant)}
              selected={selectedVariant.id === variant.id}
              available={variant.availableForSale}
            >
              <VariantText
                selected={selectedVariant.id === variant.id}
                available={variant.availableForSale}
              >
                {variant.title} {!variant.availableForSale && "(Unavailable)"}
              </VariantText>
            </VariantItem>
          ))}
        </VariantList>
      </Collapsible>
      <AddToCartButton onPress={handleAddToCart}>
        <ButtonText>Add to Cart</ButtonText>
      </AddToCartButton>
    </Container>
  );
};

export default ProductDetailsScreen;
