import React from 'react';
import * as R from 'ramda';
import * as Icons from './Icons';

const sortedLabel = R.view(R.lensPath(['column', 'label']));

export const HeaderCell = ({sortData, columnData, sortable, onAsc, onDesc}) => {
  // possible states:
  //   not sortable
  //     => do nothing
  //   sortable, but nothing in sorted
  //     => click to sort desc
  //   sortable, but sorting on some other column
  //     => click to sort desc
  //   sortable, and sorted here in one direction
  //     => click to sort the opposite direction
  const type = columnData.type || 'string';
  const alignment = columnData.align ? ` cell-align-${columnData.align}` : '';

  const activeSort = sortedLabel(sortData) === columnData.label;
  const activeDirection = activeSort && sortData.direction;
  const onClick = activeDirection === 'desc' ? onAsc : onDesc;
  // console.log({sortData, columnData, activeSort, activeDirection, onClick});

  return (
    <th scope="col" className={`cell-${type}`}>
      <div className={`header-cell-wrapper cell-${type} ${alignment}`}>
        {sortable ? (
          <span onClick={onClick} className={`header-cell-label sortable`}>
            {columnData.label}
            {activeDirection === 'asc' && <Icons.Desc />}
            {activeDirection === 'desc' && <Icons.Asc />}
            {!activeDirection && <Icons.Empty />}
          </span>
        ) : (
          <span className={`header-cell-label`}>{columnData.label}</span>
        )}
      </div>
    </th>
  );
};
