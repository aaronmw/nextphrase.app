import React, { PropTypes } from "react";
import styled from "styled-components";

const Dot = styled.span`
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

const ScoreDots = ({ score, reverse }) => {
  const dotElements = [];

  for (var i = 1; i <= 7; i++) {
    dotElements.push((
      <Dot key={i} filled={i <= score} />
    ));
  }

  if (reverse) {
    dotElements.reverse();
  }

  return (
    <span>
      {dotElements}
    </span>
  );
};

ScoreDots.propTypes = {
  score: PropTypes.number.isRequired,
  reverse: PropTypes.bool,
};

export default ScoreDots;
