import React, { ReactNode, createContext, useEffect, useState } from "react";
import Config from "react-native-config";

export type Image = {
  id: string;
  url: string;
};

export type Price = {
  amount: string;
  currencyCode: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  price: Price;
  availableForSale: boolean;
  quantityAvailable: number;
  image: Image;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  descriptionHtml: string;
  images: Image[];
  variants: ProductVariant[];
};

export type ProductContextType = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
};

export const ProductContext = createContext<ProductContextType>({
  products: [],
  isLoading: false,
  error: null,
  refreshProducts: async () => {},
});

type ProductProviderProps = {
  children: ReactNode;
};

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data from your API.
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!Config.API_URL) {
        throw new Error("API_URL is not defined in your .env file");
      }
      const response = await fetch(Config.API_URL as string);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Assuming the API returns an array of products.
      setProducts(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        error,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
