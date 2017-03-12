import React, { PropTypes } from "react";
import * as config from "../config";
import styled from "styled-components";

const Dot = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border-style: solid;
  border-color: ${props => props.theme.secondary};
  border-width: ${ props => props.filled ? "7px" : "2px" };
  background: ${ props => props.filled ? props.theme.secondary : "none" };
  opacity: ${ props => props.filled ? 1 : 0.15 };
  transition: all 0.25s ease-in-out;

  &:not(:first-child) {
    margin-left: ${ props => props.theme.borderWidth };
  }
`;

const ScoreDots = ({ score, reverse }) => {
  const dotElements = [];

  for (var i = 1; i <= config.MAX_SCORE; i++) {
    dotElements.push((
      <Dot key={i} filled={i <= score} />
    ));
  }

  if (reverse) {
    dotElements.reverse();
  }

  return <div>{dotElements}</div>;
};

ScoreDots.propTypes = {
  score: PropTypes.number.isRequired,
  reverse: PropTypes.bool,
};

export default ScoreDots;
