import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameButton, GameContent } from "./GameElements";

const SettingsContent = styled(GameContent)`
  border: 1px solid ${ props => props.theme.secondary };
  padding: 20px;
  overflow: auto;
`;

class Settings extends Component {
  render() {
    const { selectedLists, onTouchSave } = this.props;

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="checkmark"
          onTouchButton={onTouchSave}
        />
        <SettingsContent>
          Settings!
        </SettingsContent>
      </GameBoard>
    );
  }
};

Settings.propTypes = {
  selectedLists: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTouchSave: PropTypes.func.isRequired,
};

export default Settings;
