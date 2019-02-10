import React from 'react';
import {mapIndex} from '../utils';

export const Paging = ({pageData, onPageSizeChange, onSetCurrentPage}) => {
  const {pageSize, currentPage, totalPages, pageSizeOptions} = pageData;
  return (
    <div className="paging">
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
      <div className="paging-controls">
        <button
          className="paging-button paging-button-prev"
          onClick={() => onSetCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}>
          {`< Previous`}
        </button>
        <div className="paging-page">
          {currentPage} / {totalPages}
        </div>
        <button
          className="paging-button paging-button-next"
          onClick={() => onSetCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}>
          {`Next >`}
        </button>
      </div>
    </div>
  );
};
