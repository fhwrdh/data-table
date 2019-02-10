import React, {useEffect, useReducer} from 'react';
import * as R from 'ramda';
import './data-table.css';
import {Filter, defaultFilterData} from './Filter';
import {Paging} from './Paging';
import {HeaderCell} from './Header';
import {
  actions,
  reducer,
  resetFilterData,
  resetPageData,
  resetSortData,
} from './state';

const mapIndex = R.addIndex(R.map);

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
    totalCount: undefined,
    filteredData: [],
    filteredCount: undefined,
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
    <div className="data-table">
      <div className="data-table-container">
        <table className="table">
          <caption>{caption}</caption>
          <thead>
            {filterable && (
              <tr className="filter-row">
                <th>
                  <Filter
                    onChange={filterVal =>
                      dispatch(actions.filter.set(filterVal))
                    }
                    value={state.filterData.filter}
                    filteredCount={state.filteredCount}
                    totalCount={state.totalCount}
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
                  sortData={state.sortData}
                />
              ))(columns)}
            </tr>
          </thead>
          <tbody>
            {mapIndex((r, i) => (
              <Row key={i} rowData={r} columnData={columns} />
            ))(state.dataView)}
          </tbody>
          <tfoot>
            {pageable && (
              <tr>
                <td colSpan={columns.length}>
                  <Paging
                    filteredCount={state.filteredCount}
                    totalCount={state.totalCount}
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
      </div>
    </div>
  );
};
