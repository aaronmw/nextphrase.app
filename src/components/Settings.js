import React from "react";
import styled from "styled-components";
import Header from "./Header";
import TouchButton from "./TouchButton";

const Container = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100vw;
  height: 100vh;
  backface-visibility: hidden;
  border: 1px solid ${props => props.theme.secondary};
  transition: all 0.25s ease-in-out;
  ${ props => props.isVisible ? `
    transition-delay: 0.125s;
    transform: rotate3d(0, 1, 0.1, 0);
    opacity: 1;
  ` : `
    transform: rotate3d(0, 1, 0.1, 180deg);
    pointer-events: none;
    opacity: 0;
  `}
`;

const ScrollableContent = styled.div`
  background: ${props => props.theme.primary};
  flex-grow: 1;
  padding: 20px;
  color: ${props => props.theme.secondary};
  border: 1px solid ${props => props.theme.secondary};
`;

const Settings = ({ onSave, isVisible }) => (
  <Container isVisible={isVisible}>
    <Header>
      <TouchButton borderless icon onTouchEnd={onSave}>
        &#xf00c;
      </TouchButton>
    </Header>
    <ScrollableContent>
      <h1>Word Lists</h1>
      <ul>
        <li><input type="checkbox" /> NSFW</li>
        <li><input type="checkbox" /> Entertainment</li>
        <li><input type="checkbox" /> Pop Culture</li>
        <li><input type="checkbox" /> 70&rsquo;s</li>
        <li><input type="checkbox" /> 80&rsquo;s</li>
        <li><input type="checkbox" /> 90&rsquo;s</li>
        <li><input type="checkbox" /> 00&rsquo;s</li>
        <li><input type="checkbox" /> Christmas</li>
      </ul>
    </ScrollableContent>
  </Container>
);

export default Settings;
