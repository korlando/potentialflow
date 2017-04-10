import React, { Component } from 'react';
import CloseButton from '../CloseButton';
import Flow from './Flow';
import Naught from './Naught';

export const dipoleVP = (mu, x0, y0, alpha) => {
  return (x, y) => {
    return (-mu / (2 * Math.PI)) * (
      (
        (x - x0) * Math.cos(alpha) +
        (y - y0) * Math.sin(alpha)
      ) /
      (Math.pow(x - x0, 2) + Math.pow(y - y0, 2))
    );
  };
};

export default class Dipole extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mu: {
        name: <span>&mu;</span>,
        value: 100,
        placeholder: 'magnitude'
      },
      x0: {
        name: <Naught symbol="x"/>,
        value: 50,
        placeholder: 'x position'
      },
      y0: {
        name: <Naught symbol="y"/>,
        value: 50,
        placeholder: 'y position'
      },
      alpha: {
        name: <span>&alpha;</span>,
        value: 0,
        placeholder: 'angle' 
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
    const { mu, x0, y0, alpha } = this.state;

    if(onAdd) {
      onAdd(mu.value, x0.value, y0.value, alpha.value,
        dipoleVP(mu.value, x0.value, y0.value, alpha.value)
      );
    }
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Dipole"
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