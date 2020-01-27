import React from 'react';

function DetailCard(props) {
  return (
    <div
      className="forecast__detail"
      style={{ display: 'flex', marginBottom: '1em' }}
    >
      {props.icon}
      <div style={{ marginLeft: '1em' }}>
        <span>{props.title}</span>
        <br />
        <b style={{ fontSize: '1.4em', lineHeight: '1.7em' }}>{props.value}</b>
      </div>
    </div>
  );
}

export default DetailCard;
