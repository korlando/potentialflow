import React, { Component } from 'react';
import CloseButton from '../CloseButton';

export const uniformVP = (U, V) => {
  return (x, y) => {
    return U * x + V * y;
  };
};

export default class Uniform extends Component {
  constructor(props) {
    super(props);

    this.state = {
      U: 1,
      V: 1
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount() {
    const { U, V } = this.props;
    const update = {};
    if(U !== undefined) {
      update.U = U;
    }
    if(V !== undefined) {
      update.V = V;
    }
    if(Object.keys(update).length) {
      this.setState(update);
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    const { onAdd } = this.props;
    const { U, V } = this.state;

    if(onAdd) {
      onAdd(U, V, uniformVP(U, V));
    }
  };

  render() {
    const { className, style, onAdd, onRemove } = this.props;
    const { U, V } = this.state;

    return (
      <div className={`flow-element ${className || ''}`}
        style={style || {}}>
        <div className="flexbox">
          <label className="flex1">Uniform</label>
          { onRemove &&
            <CloseButton
              className="flex0"
              onClick={() => onRemove()}/>
          }
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group input-group-sm">
            <div className="input-group-addon">U</div>
            <input type="number"
              className="form-control"
              placeholder="U (x-strength)"
              value={U}
              onChange={(e) => {
                this.setState({ U: e.target.value });
              }}/>
          </div>
          <div className="input-group input-group-sm">
            <div className="input-group-addon">V</div>
            <input type="number"
              className="form-control"
              placeholder="V (y-strength)"
              value={V}
              onChange={(e) => {
                this.setState({ V: e.target.value });
              }}/>
          </div>
          { onAdd &&
            <button type="submit"
              className="btn btn-primary btn-block">Add</button>
          }
        </form>
      </div>
    );
  };
};