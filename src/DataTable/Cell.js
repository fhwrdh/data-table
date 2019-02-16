import React from 'react';
import cn from 'classnames';

export const Cell = ({cellData, columnData}) => {
  const classes = cn({
    'cell-string': !columnData.type,
    [`cell-${columnData.type}`]: !!columnData.type,
    'cell-nowrap': columnData.noWrap,
    'cell-ellipsis': columnData.ellipsis,
    [`cell-align-${columnData.align}`]: columnData.align,
  });

  return (
    <td data-testid="cell" className={classes}>
      {cellData.formatted}
    </td>
  );
};
