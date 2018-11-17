import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { GameBoard, GameHeader, GameButton, GameContent } from './GameElements';
import { LONG_PRESS_DURATION } from '../config';

const ScoreButton = styled(GameButton)`
  width: 50%;
  height: 33%;
  line-height: 100%;

  ${props => props.isHighlighted
    ? 'position: relative; z-index: 1000;'
    : ''
  }
  &:nth-child(1) {
    border-right-width: ${props => props.theme.halfBorderWidth};
  }
  &:nth-child(2) {
    border-left-width: ${props => props.theme.halfBorderWidth};
  }
`;

const StartButton = styled(GameButton)`
  width: 100%;
  height: 67%;
  border-top: none;
  ${props => props.isFrozen
    ? `opacity: ${props.theme.frozenOpacity};`
    : ''
  }
`;

class Home extends Component {
  addPointForTeamA = e => {
    if (this._scheduledTask) {
      clearTimeout(this._scheduledTask);
      this._scheduledTask = false;
      const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
      onTouchScore(pointsForTeamA + 1, pointsForTeamB);
    }
  };

  addPointForTeamB = () => {
    if (this._scheduledTask) {
      clearTimeout(this._scheduledTask);
      this._scheduledTask = false;
      const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
      onTouchScore(pointsForTeamA, pointsForTeamB + 1);
    }
  };

  removePointFromTeamA = () => {
    const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    onTouchScore(pointsForTeamA - 1, pointsForTeamB);
    this._scheduledTask = false;
  };

  removePointFromTeamB = () => {
    const { pointsForTeamA, pointsForTeamB, onTouchScore } = this.props;
    onTouchScore(pointsForTeamA, pointsForTeamB - 1);
    this._scheduledTask = false;
  };

  scheduleRemovePointFromTeamA = () => {
    this._scheduledTask = setTimeout(
      this.removePointFromTeamA,
      LONG_PRESS_DURATION
    );
  };

  scheduleRemovePointFromTeamB = () => {
    this._scheduledTask = setTimeout(
      this.removePointFromTeamB,
      LONG_PRESS_DURATION
    );
  };

  render() {
    const {
      pointsForTeamA,
      pointsForTeamB,
      onTouchStart,
      onTouchSettings,
      isRotated,
      roundJustCompleted
    } = this.props;

    return (
      <GameBoard isRotated={isRotated}>
        <GameHeader
          isFrozen={roundJustCompleted}
          buttonIcon="cog"
          onTouchButton={onTouchSettings}
          pointsForTeamA={pointsForTeamA}
          pointsForTeamB={pointsForTeamB}
        />
        <GameContent>
          <ScoreButton
            onTouchStart={this.scheduleRemovePointFromTeamA}
            onTouchEnd={this.addPointForTeamA}
            isHighlighted={roundJustCompleted}
          >
            A
          </ScoreButton>
          <ScoreButton
            onTouchStart={this.scheduleRemovePointFromTeamB}
            onTouchEnd={this.addPointForTeamB}
          >
            B
          </ScoreButton>
          <StartButton
            isFrozen={roundJustCompleted}
            onTouchEnd={onTouchStart}
          >
            Start
          </StartButton>
        </GameContent>
      </GameBoard>
    );
  }
}

Home.propTypes = {
  pointsForTeamA: PropTypes.number.isRequired,
  pointsForTeamB: PropTypes.number.isRequired,
  onTouchStart: PropTypes.func.isRequired,
  onTouchSettings: PropTypes.func.isRequired,
  onTouchScore: PropTypes.func.isRequired
};

export default Home;
