import React, { Component } from 'react';
import CloseButton from '../CloseButton';
import Flow from './Flow';
import Naught from './Naught';

export const pointSourceVP = (m, x0, y0) => {
  return (x, y) => {
    return (m / (2 * Math.PI)) * Math.log(
      Math.sqrt(Math.pow((x - x0), 2)) +
      Math.sqrt(Math.pow((y - y0), 2))
    );
  };
};

export default class PointSource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      m: {
        name: 'm',
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
    const { m, x0, y0 } = this.state;

    if(onAdd) {
      onAdd(m.value, x0.value, y0.value,
        pointSourceVP(m.value, x0.value, y0.value)
      );
    }
  };

  render() {
    return (
      <Flow
        {...this.props}
        name="Point Source/Sink"
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