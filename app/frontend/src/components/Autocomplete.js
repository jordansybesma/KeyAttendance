/*
 *  https://alligator.io/react/react-autocomplete/
 */

import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import "./Autocomplete.css"

class Autocomplete extends Component {
  static propTypes = {
    suggestions: PropTypes.instanceOf(Array),
    handler: PropTypes.instanceOf(Function)
  };

  static defaultProps = {
    suggestions: [],
    handler: null
  };

  constructor(props) {
    super(props);

    this.state = {
      // The active selection's index
      activeSuggestion: 0,
      // The suggestions that match the user's input
      filteredSuggestions: [],
      // Whether or not the suggestion list is shown
      showSuggestions: false,
      // What the user has entered
      userInput: ""
    };
  }

  // Event fired when the input value is changed
  onChange = e => {
    const { suggestions } = this.props;
    const userInput = e.currentTarget.value;

    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.name.toLowerCase().startsWith(userInput.toLowerCase()) === true
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value,
    });
  };

  // Event fired when the user clicks on a suggestion
  onClick = e => {
    // Update the user input and reset the rest of the state
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
    this.props.handler(e, e._targetInst.key);
  };

  // Event fired when the user presses a key down
  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13 && this.state.activeSuggestion === -1) {
      this.props.handler(e, this.state.selectedId)
    }
    else if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: -1,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion].name,
		selectedId: filteredSuggestions[activeSuggestion].id
      });
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion === filteredSuggestions.length - 1) {  // Improvements should be made
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: {
        activeSuggestion,
        filteredSuggestions,
        showSuggestions,
        userInput
      }
    } = this;

    let suggestionsListComponent;

    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <div className="suggestions">
            {filteredSuggestions.map((suggestion, index) => {
              let className;

              // Flag the active suggestion with a class
              if (index === activeSuggestion) {
                className = "suggestion-active";
              }

              return (
                <p
                  className={className}
                  key={suggestion.id}
                  onClick={onClick}
                >
                  {suggestion.name}
                </p>
              );
            })}
          </div>
        );
      } else {
        suggestionsListComponent = (
          <div className="no-suggestions">
            <em>No suggestions.</em>
          </div>
        );
      }
    }

    return (
      <Fragment>
        <input
          type="text"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}
      </Fragment>
    );
  }
}

export default Autocomplete;
