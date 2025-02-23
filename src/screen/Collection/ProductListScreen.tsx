import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import React, { useContext } from "react";
import { ActivityIndicator, Text } from "react-native";
import styled from "styled-components/native";

import { Colors, FontSize, Spacing } from "../../constants";
import { Product, ProductContext } from "../../context/ProductContext";
import { RootStackParamList } from "../../navigation/index";

type NavigationProp = StackNavigationProp<RootStackParamList, "ProductList">;

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.white};
  padding: ${Spacing.small}px;
  padding-top: ${Spacing.xl}px;
`;

const ProductCard = styled.TouchableOpacity`
  flex: 1;
  background-color: #fff;
  padding-vertical: ${Spacing.large}px;
`;

const ProductImage = styled.Image`
  width: 100%;
  height: 200px;
  resize-mode: contain;
`;

const InfoContainer = styled.View`
  padding: ${Spacing.small}px;
`;

const Title = styled.Text`
  font-size: ${FontSize.regular}px;
  font-weight: 600;
  margin-bottom: ${Spacing.xs}px;
`;

const Price = styled.Text`
  font-size: ${FontSize.regular}px;
  color: ${Colors.green};
  font-weight: 600;
`;

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ProductListScreen: React.FC = () => {
  const { products, isLoading, error, refresh } = useContext(ProductContext);
  const navigation = useNavigation<NavigationProp>();

  if (isLoading) {
    return (
      <CenteredContainer testID="loading-indicator">
        <ActivityIndicator size="large" color={Colors.black} />
      </CenteredContainer>
    );
  }

  if (error) {
    return (
      <CenteredContainer>
        <Text>Error: {error}</Text>
      </CenteredContainer>
    );
  }

  const renderItem = ({ item }: { item: Product }) => {
    // Use the first variant as the default variant.
    const defaultVariant = item.variants[0];
    return (
      <ProductCard
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        {item.images && item.images[0] ? (
          <ProductImage source={{ uri: item.images[0].url }} />
        ) : (
          <CenteredContainer>
            <Text>No Image</Text>
          </CenteredContainer>
        )}
        <InfoContainer>
          <Title numberOfLines={3}>{item.title}</Title>
          {defaultVariant && (
            <Price>
              {defaultVariant.price.amount} {defaultVariant.price.currencyCode}
            </Price>
          )}
        </InfoContainer>
      </ProductCard>
    );
  };

  return (
    <Container>
      <FlashList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        estimatedItemSize={100}
        onRefresh={refresh}
        refreshing={isLoading}
      />
    </Container>
  );
};

export default ProductListScreen;
