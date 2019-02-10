import React, {useEffect, useReducer} from 'react';
import * as R from 'ramda';
import './data-table.css';
import {Filter, defaultFilterData} from './Filter';
import {Sorter} from './Sorter';
import {Paging} from './Paging';
import {
  actions,
  reducer,
  resetFilterData,
  resetPageData,
  resetSortData,
} from './state';

const mapIndex = R.addIndex(R.map);

const HeaderCell = ({columnData, sortable, onAsc, onDesc}) => {
  const type = columnData.type || 'string';
  const alignment = columnData.align ? ` cell-align-${columnData.align}` : '';
  return (
    <th className={`cell-${type}`}>
      <div className={`header-cell-wrapper cell-${type} ${alignment}`}>
        <span className="header-cell-label">{columnData.label}</span>
        {sortable && <Sorter onAscClick={onAsc} onDescClick={onDesc} />}
      </div>
    </th>
  );
};

const Row = ({rowData, columnData}) => (
  <tr>
    {mapIndex((cellData, i) => (
      <Cell key={i} cellData={cellData} columnData={columnData[i]} />
    ))(rowData)}
  </tr>
);

const Cell = ({cellData, columnData}) => {
  const type = columnData.type || 'string';
  const alignment = columnData.align ? ` cell-align-${columnData.align}` : '';
  return <td className={`cell-${type}${alignment}`}>{cellData.formatted}</td>;
};

export const DataTable = ({
  caption = 'table caption required',
  columns,
  data,
  sortable = false,
  filterable = false,
  filterFunc = defaultFilterData,
  pageable = false,
  currentPage = 1,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100, 500],
}) => {
  const initialState = {
    columns,
    rawData: [],
    formattedData: [],
    dataView: [],

    filterData: resetFilterData(filterFunc),
    sortData: resetSortData(),
    pageData: resetPageData(currentPage, pageSize, pageSizeOptions),

    resetFilterData,
    resetSortData,
    resetPageData,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(actions.data.set(data));
  }, [data]);

  return (
    <table className="">
      <caption>{caption}</caption>
      <thead>
        {filterable && (
          <tr className="filter-row">
            <th>
              <Filter
                onChange={filterVal => dispatch(actions.filter.set(filterVal))}
                value={state.filterData.filter}
              />
            </th>
          </tr>
        )}
        <tr className="header-row">
          {mapIndex((c, i) => (
            <HeaderCell
              key={i}
              sortable={sortable}
              onAsc={() => dispatch(actions.sort('asc', i))}
              onDesc={() => dispatch(actions.sort('desc', i))}
              columnData={columns[i]}
            />
          ))(columns)}
        </tr>
      </thead>
      <tbody>
        {mapIndex((r, i) => <Row key={i} rowData={r} columnData={columns} />)(
          state.dataView,
        )}
      </tbody>
      <tfoot>
        {pageable && (
          <tr>
            <td colSpan={columns.length}>
              <Paging
                pageData={state.pageData}
                onPageSizeChange={size =>
                  dispatch(actions.paging.pageSize.set(size))
                }
                onSetCurrentPage={pageNumber =>
                  dispatch(actions.paging.currentPage.set(pageNumber))
                }
              />
            </td>
          </tr>
        )}
      </tfoot>
    </table>
  );
};
