import React from 'react';
import * as R from 'ramda';
import Select from 'react-select';

export const Paging = ({
  pageData,
  onPageSizeChange,
  onSetCurrentPage,
  filteredCount,
  totalCount,
}) => {
  const {pageSize, currentPage, totalPages, pageSizeOptions} = pageData;
  const colorOverride = '#999';
  return (
    <div className="paging">
      <div>
        <Select
          classNamePrefix="paging-select"
          className="paging-select"
          value={{value: pageSize, label: `${pageSize} per page`}}
          options={R.map(value => ({value, label: `${value} per page`}))(
            pageSizeOptions,
          )}
          styles={{
            control: provided => ({
              ...provided,
              minWidth: '150px',
              borderColor: colorOverride,
            }),
            dropdownIndicator: provided => ({
              ...provided,
              color: colorOverride,
            }),
            indicatorSeparator: provided => ({
              ...provided,
              background: colorOverride,
            }),
          }}
          onChange={e => onPageSizeChange(e.value)}
        />
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
      <div className="paging-total-records">{filteredCount} total records</div>
    </div>
  );
};
