import React, { PropTypes } from "react";
import styled from "styled-components";

const Point = styled.div`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.secondary};
  background: ${ props => props.filled ? props.theme.secondary : "none" };
  opacity: ${ props => props.filled ? 1 : 0.5 };
  transition: all 0.1s ease-in-out;

  &:not(:first-child) {
    margin-left: 2px;
  }
`;

const Score = ({ points, reverse }) => {
  const pointElements = [];

  for (var i = 1; i <= 7; i++) {
    pointElements.push((
      <Point key={i} filled={i <= points} />
    ));
  }

  if (reverse) {
    pointElements.reverse();
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {pointElements}
    </div>
  );
};

Score.propTypes = {
  points: PropTypes.number.isRequired,
  reverse: PropTypes.bool,
};

export default Score;
