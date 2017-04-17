import React, { Component } from 'react';

export default class PresetFlow extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { name } = this.props;
    return (
      <div className="flow-element">
        <label>{name}</label>
        <button
          type="button"
          className="btn btn-primary btn-block btn-sm"
          onClick={() => {
            
          }}>Add</button>
      </div>
    );
  };
};