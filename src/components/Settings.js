import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameContent } from "./GameElements";
import lists from "../lists";

const SettingsContent = styled(GameContent)`
  border: 1px solid ${ props => props.theme.secondary };
  padding: 20px;
  overflow: auto;
`;

const ListOption = styled.div`
  ${ props => props.selected ? `
    background: green;
  ` : `
    background: red;
  `}
`;

class Settings extends Component {
  render() {
    const { selectedLists, onTouchSave } = this.props;

    let availableLists = [];
    Object.keys(lists).forEach(value => {
      availableLists.push(
        <ListOption selected={ selectedLists.indexOf(value) !== -1 ? true : false }>
          {value}
        </ListOption>
      );
    });

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="checkmark"
          onTouchButton={onTouchSave}
        />
        <SettingsContent>
          {availableLists}
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
