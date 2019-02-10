import React from 'react';
import * as R from 'ramda';

export const defaultFilterData = (filterVal, dv) => {
  return R.filter(row =>
    R.gt(
      R.length(
        R.filter(val => {
          if (!filterVal) {
            return true;
          }
          return R.toLower(val.formatted.toString()).includes(
            R.toLower(filterVal),
          );
        }, row),
      ),
      0,
    ),
  )(dv);
};

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
