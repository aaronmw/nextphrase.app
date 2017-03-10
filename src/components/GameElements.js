import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import ScoreDots from "./ScoreDots";

export const GameBoard = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  border: 1px solid ${ props => props.theme.secondary };
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.secondary};
  font-family: 'Amatic SC', cursive;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 2.6em;
`;

export const GameButton = styled.button`
  padding: 0 20px;
  cursor: pointer;
  background: inherit;
  border: ${ props => props.borderless ? "none" : "1px solid " + props.theme.secondary };
  text-transform: inherit;
  color: inherit;
  font: inherit;
  ${ props => props.icon ? "font-family: FontAwesome;" : "" }

  &:active {
    background-color: ${props => props.theme.highlight};
  }
`;

const GameHeaderWrapper = styled.div`
  position: relative;
  z-index: 1000;
  height: 10%;
  line-height: 100%;
  white-space: nowrap;
  width: 100%;
  border: 1px solid ${ props => props.theme.secondary };
  background: ${ props => props.theme.primary };
`;

const GameHeaderButton = styled(GameButton)`
  position: absolute;
  width: 50px;
  height: 100%;
  padding: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.5em;
  ${ props => props.disabled ? `
    opacity: 0.25;
    pointer-events: none;
  ` : `` }
`;

const GameHeaderScore = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 0;
  ${ props => props.align === "left" ?
    "left: 20px;" :
    "right: 20px;"
  }
`;
GameHeaderScore.propTypes = {
  align: PropTypes.oneOf(["left", "right"]).isRequired,
};

const ICONS = {
  "cog": "\uf013",
  "checkmark": "\uf00c",
  "pause": "\uf04c",
}

class GameHeader extends Component {
  render() {
    const { pointsForTeamA, pointsForTeamB, onTouchButton, buttonIcon, disabled } = this.props;

    return (
      <GameHeaderWrapper>
        { typeof pointsForTeamA !== "undefined" ? (
          <GameHeaderScore align="left">
            <ScoreDots score={pointsForTeamA} />
          </GameHeaderScore>
        ) : "" }
        <GameHeaderButton onTouchEnd={onTouchButton} borderless icon disabled={disabled}>
          { ICONS[buttonIcon] }
        </GameHeaderButton>
        { typeof pointsForTeamA !== "undefined" ? (
          <GameHeaderScore align="right">
            <ScoreDots score={pointsForTeamB} reverse />
          </GameHeaderScore>
        ) : "" }
      </GameHeaderWrapper>
    );
  }
}

GameHeader.propTypes = {
  pointsForTeamA: PropTypes.number,
  pointsForTeamB: PropTypes.number,
  onTouchButton: PropTypes.func.isRequired,
  buttonIcon: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export { GameHeader };

export const GameContent = styled.div`
  position: relative;
  height: 90%;
  width: 100%;
`;
