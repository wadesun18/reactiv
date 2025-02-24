import React from "react";
import { Text, TextProps } from "react-native";
import styled from "styled-components/native";

type CustomTextProps = TextProps & {
  size?: number;
  fontWeight?: string;
  color?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  textDecorationLine?: string;
};

const StyledText = styled(Text)<CustomTextProps>`
  font-size: ${({ size = 16 }) => size}px;
  font-weight: ${({ fontWeight = "normal" }) => fontWeight};
  color: ${({ color = "black" }) => color};
  margin-top: ${({ marginTop }) =>
    marginTop !== undefined ? `${marginTop}px` : "0px"};
  margin-bottom: ${({ marginBottom }) =>
    marginBottom !== undefined ? `${marginBottom}px` : "0px"};
  margin-left: ${({ marginLeft }) =>
    marginLeft !== undefined ? `${marginLeft}px` : "0px"};
  margin-right: ${({ marginRight }) =>
    marginRight !== undefined ? `${marginRight}px` : "0px"};
  text-decoration-line: ${({ textDecorationLine }) =>
    textDecorationLine ? textDecorationLine : "none"};
`;

const CustomText: React.FC<CustomTextProps> = ({ children, ...rest }) => {
  return <StyledText {...rest}>{children}</StyledText>;
};

export default CustomText;
