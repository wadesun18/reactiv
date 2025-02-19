import React from "react";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5fcff;
`;

const Greeting = styled.Text`
  font-size: 20px;
  text-align: center;
  margin: 10px;
`;

const Cart = () => (
  <Container>
    <Greeting>Hello, Cart</Greeting>
  </Container>
);

export default Cart;
