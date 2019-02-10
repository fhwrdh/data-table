import React from 'react';
// import * as R from 'ramda';
import {mapIndex} from '../utils';

export const Paging = ({
  pageSize,
  pageSizeOptions = [10, 25, 50, 100, 500],
  onPageSizeChange,
  currentPage,
  totalPages,
  onSetCurrentPage,
}) => {
  return (
    <div>
      <div>
        <select
          value={pageSize}
          onChange={e => onPageSizeChange(e.target.value)}>
          {mapIndex((size, index) => (
            <option key={index} value={size}>
              {size}
            </option>
          ))(pageSizeOptions)}
        </select>
      </div>
      <div>
        <button
          onClick={() => onSetCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}>
          Previous
        </button>
        {currentPage} / {totalPages}
        <button
          onClick={() => onSetCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};
