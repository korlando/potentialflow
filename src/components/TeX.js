import React, { Component } from 'react';

export default class TeX extends Component {
  constructor(props) {
    super(props);
  };

  componentDidMount() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.node]);
  };

  componentDidUpdate() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.node]);
  };

  render() {
    return (
      <div
        className={this.props.className}
        ref={node => this.node = node}
        style={this.props.style}>
        {`$${this.props.value}$`}
      </div>
    );
  };
};
