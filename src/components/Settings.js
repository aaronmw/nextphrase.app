import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameContent } from "./GameElements";
import lists from "../lists";

const SettingsContent = styled(GameContent)`
  border: ${props => props.theme.borderWidth} solid
    ${props => props.theme.secondary};
  overflow: auto;
`;

const ListOption = styled.div`
  padding: 10px 20px;
  margin-bottom: ${props => props.theme.borderWidth};
  ${props =>
    props.selected
      ? `background: ` +
        props.theme.secondary +
        `; color: ` +
        props.theme.primary
      : `opacity: 0.5;`};
`;

class Settings extends Component {
  toggleSelectedList = (listName, isSelected) => {
    this.props.onTouchList(listName, isSelected);
  };

  render() {
    const {
      selectedLists,
      onTouchDone,
      onToggleScreenRotation,
      isRotated
    } = this.props;

    let availableLists = [];
    Object.keys(lists).forEach((listName, index) => {
      let isSelected = selectedLists.indexOf(listName) !== -1 ? true : false;
      availableLists.push(
        <ListOption
          key={index}
          onTouchEnd={this.toggleSelectedList.bind(this, listName, !isSelected)}
          selected={isSelected}
        >
          {listName}
        </ListOption>
      );
    });

    return (
      <GameBoard isRotated={isRotated}>
        <GameHeader
          buttonIcon="checkmark"
          onTouchButton={onTouchDone}
          disabled={!selectedLists.length}
        />
        <SettingsContent>
          {availableLists}
          <ListOption selected={isRotated} onTouchEnd={onToggleScreenRotation}>
            Rotate Screen
          </ListOption>
        </SettingsContent>
      </GameBoard>
    );
  }
}

Settings.propTypes = {
  selectedLists: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTouchDone: PropTypes.func.isRequired,
  onTouchList: PropTypes.func.isRequired
};

export default Settings;
