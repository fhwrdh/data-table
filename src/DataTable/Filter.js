import React from 'react';

export const Filter = ({onChange, value}) => {
  return (
    <input
      type="text"
      style={{padding: '4px', fontSize: '1em'}}
      placeholder="Filter"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
};
