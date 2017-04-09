import React from 'react';

function CloseButton(props) {
  return (
    <button type="button"
      className={`close-x ${props.className || ''}`}
      title={props.title || ''}
      onClick={props.onClick}>
      <svg viewBox="0 0 20 20">
        <line x1="2" x2="18" y1="2" y2="18"></line>
        <line x1="2" x2="18" y1="18" y2="2"></line>
      </svg>
    </button>
  );
};

export default CloseButton;