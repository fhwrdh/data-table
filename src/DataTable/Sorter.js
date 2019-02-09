import React from 'react';
import * as Icons from './Icons';

export const Sorter = ({onAscClick, onDescClick}) => {
  return (
    <div className="sorter">
      <span className="sorter-asc" onClick={onAscClick}>
        <Icons.Asc />
      </span>
      <span className="sorter-desc" onClick={onDescClick}>
        <Icons.Desc />
      </span>
    </div>
  );
};
