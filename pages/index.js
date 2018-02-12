import React from 'react';
import styled from 'styled-components';

import Page from '../components/Page';
import { Heading, SubHeading, Display, Label } from '../components';

const Body = styled.div`
  font-family: 'Helvetica';
`;

export default () => (
  <Body>
    <Page>
      <p>
        <Label>label</Label>
      </p>
      <p>
        <Label italic>label-italic</Label>
      </p>
      <p>
        <Label bold>label-bold</Label>
      </p>
      <p>
        <Display>display</Display>
      </p>
      <p>
        <Display italic>display-italic</Display>
      </p>
      <p>
        <Display bold>display-bold</Display>
      </p>
      <p>
        <SubHeading>subheading</SubHeading>
      </p>
      <p>
        <SubHeading italic>subheading-italic</SubHeading>
      </p>
      <p>
        <Heading>heading</Heading>
      </p>
      <p>
        <Heading italic>heading-italic</Heading>
      </p>

      <p>
        <Label sans>label</Label>
      </p>
      <p>
        <Label sans italic>
          label-italic
        </Label>
      </p>
      <p>
        <Label sans bold>
          label-bold
        </Label>
      </p>
      <p>
        <Display sans>display</Display>
      </p>
      <p>
        <Display sans italic>
          display-italic
        </Display>
      </p>
      <p>
        <Display sans bold>
          display-bold
        </Display>
      </p>
      <p>
        <SubHeading sans>subheading</SubHeading>
      </p>
      <p>
        <SubHeading sans italic>
          subheading-italic
        </SubHeading>
      </p>
      <p>
        <Heading sans>heading</Heading>
      </p>
      <p>
        <Heading sans italic>
          heading-italic
        </Heading>
      </p>
    </Page>
  </Body>
);
