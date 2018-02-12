import React from 'react';
import styled from 'styled-components';

const serif = `'Spectral', serif`;
const sansSerif = `'Archivo Black', sans-serif`;

const Text = styled.span`
  font-family: ${({ sans }) => (sans ? sansSerif : serif)};
  font-size: ${({ size }) => size};
  font-style: ${({ italic = false }) => (italic ? 'italic' : null)};
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
`;

export const Heading = ({ bold, children, italic, sans }) => (
  <Text bold={bold} italic={italic} size="2rem" sans={sans}>
    {children}
  </Text>
);

export const SubHeading = ({ bold, children, italic, sans }) => (
  <Text bold={bold} italic={italic} size="1.5rem" sans={sans}>
    {children}
  </Text>
);

export const Display = ({ bold, children, italic, sans }) => (
  <Text bold={bold} italic={italic} size="1rem" sans={sans}>
    {children}
  </Text>
);

export const Label = ({ bold, children, italic, sans }) => (
  <Text bold={bold} italic={italic} size="0.75rem" sans={sans}>
    {children}
  </Text>
);
