import React, { Component } from 'react';
import CloseButton from '../CloseButton';
import Flow from './Flow';

export const uniformVP = (U, V) => {
  return (x, y) => {
    return U * x + V * y;
  };
};

export default class Uniform extends Component {
  constructor(props) {
    super(props);

    this.state = {
      U: {
        name: 'U',
        value: 1,
        placeholder: 'U (x-strength)'
      },
      V: {
        name: 'V',
        value: 1,
        placeholder: 'V (y-strength)'
      }
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount() {
    const update = {};
    Object.keys(this.state).forEach((key) => {
      if(this.props[key] !== undefined) {
        update[key] = Object.assign({}, this.state[key], {
          value: this.props[key]
        });
      }
    });
    if(Object.keys(update).length) {
      this.setState(update);
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    const { onAdd } = this.props;
    const { U, V } = this.state;

    if(onAdd) {
      onAdd(U.value, V.value, uniformVP(U.value, V.value));
    }
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Uniform"
        inputs={this.state}
        onSubmit={this.handleSubmit}
        onChange={(key, value) => {
          this.setState({
            [key]: Object.assign({}, this.state[key], { value })
          })
        }}/>
    );
  };
};