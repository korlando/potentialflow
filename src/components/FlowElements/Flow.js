import React, { Component } from 'react';
import CloseButton from '../CloseButton';

export default class Flow extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    const { name,
            className,
            style,
            onAdd,
            onRemove,
            onSubmit,
            onChange,
            inputs } = this.props;

    return (
      <div className={`flow-element ${className || ''}`}
        style={style || {}}>
        <div className="flexbox">
          <label className="flex1">{name}</label>
          { onRemove &&
            <CloseButton
              className="flex0"
              onClick={() => onRemove()}/>
          }
        </div>
        <form onSubmit={onSubmit}>
          { Object.keys(inputs).map((key, i) => {
            const input = inputs[key];
            return (
              <div key={i} className="input-group input-group-sm">
                <div className="input-group-addon">{input.name}</div>
                <input type="number"
                  className="form-control"
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={(e) => {
                    onChange(key, e.target.value);
                  }}/>
              </div>
            );
          })}
          { onAdd &&
            <button type="submit"
              className="btn btn-primary btn-block">Add</button>
          }
        </form>
      </div>
    );
  };
};