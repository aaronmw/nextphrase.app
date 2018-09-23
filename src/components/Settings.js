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
  padding-left: 40px;
  margin-bottom: ${props => props.theme.borderWidth};
  ${props =>
    props.selected
      ? `background: ` +
        props.theme.secondary +
        `; color: ` +
        props.theme.primary
      : `opacity: 0.5;`};
`;

const SettingsHeading = styled.h1`
  font-size: 1rem;
  padding: 10px 20px;
  margin-bottom: 5px;
  // background-color: ${props => props.theme.secondary};
  // color: ${props => props.theme.primary};
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
      const boundTapHandler = this.toggleSelectedList.bind(
        this,
        listName,
        !isSelected
      );
      availableLists.push(
        <ListOption
          key={index}
          onTouchEnd={boundTapHandler}
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
          <SettingsHeading>Word Cartegories</SettingsHeading>
          {availableLists}
          <SettingsHeading>Misc</SettingsHeading>
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
