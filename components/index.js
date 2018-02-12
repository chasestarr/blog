import React from 'react';
import styled from 'styled-components';

const Text = styled.span`
  font-family: 'Spectral', serif;
  font-size: ${({ size }) => size};
  font-style: ${({ italic = false }) => (italic ? 'italic' : null)};
  font-weight: ${({ bold }) => (bold ? 700 : 400)};
`;

export const Heading = ({ bold, children, italic }) => (
  <Text bold={bold} italic={italic} size="2rem">
    {children}
  </Text>
);

export const SubHeading = ({ bold, children, italic }) => (
  <Text bold={bold} italic={italic} size="1.5rem">
    {children}
  </Text>
);

export const Display = ({ bold, children, italic }) => (
  <Text bold={bold} italic={italic} size="1rem">
    {children}
  </Text>
);

export const Label = ({ bold, children, italic }) => (
  <Text bold={bold} italic={italic} size="0.75rem">
    {children}
  </Text>
);
