import React, { Component, PropTypes } from "react";
import styled from "styled-components";
import { GameBoard, GameHeader, GameContent } from "./GameElements";
import lists from "../lists";

const SettingsContent = styled(GameContent)`
  border: 1px solid ${ props => props.theme.secondary };
  overflow: auto;
`;

const ListOption = styled.div`
  padding: 20px;
  ${ props => props.selected ? `
    background: ` + props.theme.secondary + `
    color: ` + props.theme.primary + `
  ` : `
    opacity: 0.5;
  `}
`;

class Settings extends Component {
  toggleSelectedList = (listName, isSelected) => {
    this.props.onTouchList(listName, isSelected);
  };

  render() {
    const { selectedLists, onTouchDone } = this.props;

    let availableLists = [];
    Object.keys(lists).forEach((listName, index) => {
      let isSelected = selectedLists.indexOf(listName) !== -1 ? true : false;
      availableLists.push(
        <ListOption key={index} onTouchEnd={this.toggleSelectedList.bind(this, listName, !isSelected)} selected={isSelected}>
          {listName}
        </ListOption>
      );
    });

    return (
      <GameBoard>
        <GameHeader
          buttonIcon="checkmark"
          onTouchButton={onTouchDone}
          disabled={!selectedLists.length}
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
  onTouchDone: PropTypes.func.isRequired,
  onTouchList: PropTypes.func.isRequired,
};

export default Settings;
