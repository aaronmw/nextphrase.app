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
  font-family: 'Helvetica Neue';
  text-transform: uppercase;
  font-weight: 900;
  font-size: 1.5em;
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
  height: 10%;
  line-height: 100%;
  white-space: nowrap;
  width: 100%;
  border: 1px solid ${ props => props.theme.secondary };
`;

const GameHeaderButton = styled(GameButton)`
  position: absolute;
  width: 50px;
  height: 100%;
  padding: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const GameHeaderScore = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 12px;
  ${ props => props.align === "left" ?
    "left: 20px;" :
    "right: 20px;"
  };
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
    const { pointsForTeamA, pointsForTeamB, onTouchButton, buttonIcon } = this.props;

    return (
      <GameHeaderWrapper>
        { typeof pointsForTeamA !== "undefined" ? (
          <GameHeaderScore align="left">
            <ScoreDots score={pointsForTeamA} />
          </GameHeaderScore>
        ) : "" }
        <GameHeaderButton onTouchEnd={onTouchButton} borderless icon>
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

export { GameHeader };

export const GameContent = styled.div`
  position: relative;
  height: 90%;
  width: 100%;
`;
