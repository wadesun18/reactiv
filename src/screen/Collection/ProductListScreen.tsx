import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { FlashList } from "@shopify/flash-list";
import React, { useContext } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

import CustomText from "../../components/CustomText";
import { Colors, FontSize, Spacing } from "../../constants";
import { Product, ProductContext } from "../../context/ProductContext";
import { RootStackParamList } from "../../navigation/index";

type NavigationProp = StackNavigationProp<RootStackParamList, "ProductList">;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.white};
  padding: ${Spacing.small}px;
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

const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const HeaderContainer = styled.View`
  padding-vertical: ${Spacing.small}px;
  padding-left: ${Spacing.medium}px;
`;

const ProductListScreen: React.FC = () => {
  const { products, isLoading, error, refreshProducts } =
    useContext(ProductContext);
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
    // Use the first variant that has availableForSale is true. If not found, the default to first variant
    const defaultVariant =
      item.variants.find((variant) => variant.availableForSale) ||
      item.variants[0];

    return (
      <ProductCard
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        {defaultVariant.image?.url ? (
          <ProductImage source={{ uri: defaultVariant.image.url }} />
        ) : (
          <CenteredContainer>
            <CustomText>No Image</CustomText>
          </CenteredContainer>
        )}
        <InfoContainer>
          <CustomText
            numberOfLines={3}
            fontWeight="bold"
            marginBottom={Spacing.xs}
          >
            {item.title}
          </CustomText>
          {defaultVariant && (
            <CustomText fontWeight="bold" color={Colors.green}>
              {defaultVariant.price.amount} {defaultVariant.price.currencyCode}
            </CustomText>
          )}
        </InfoContainer>
      </ProductCard>
    );
  };

  return (
    <Container>
      <HeaderContainer>
        <CustomText
          color={Colors.purple}
          fontWeight="bold"
          size={FontSize.large}
        >
          Shop
        </CustomText>
      </HeaderContainer>
      <FlashList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        estimatedItemSize={100}
        onRefresh={refreshProducts}
        refreshing={isLoading}
      />
    </Container>
  );
};

export default ProductListScreen;
