import React, {useReducer} from 'react';
import * as R from 'ramda';
import {createActions, handleActions} from 'redux-actions';

import './data-table.css';
import {Filter} from './Filter';
import {Sorter} from './Sorter';
import {Paging} from './Paging';

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

const defaultFormatters = {
  money: d => d,
  number: d => d,
  date: data => data.toLocaleString('en-US'),
  string: data => data.toString(),
};

const handleSort = direction => setter => (columnIndex, data, columnData) => {
  const comparator = columnData.sort
    ? columnData.sort(columnIndex)
    : R.path([columnIndex, 'value']);
  const newDataView = R.sort(direction(comparator), data);
  // setter(newDataView);
  return newDataView;
};

const formatData = (columns, data) => {
  const formatters = R.map(
    c => c.format || defaultFormatters[c.type || 'string'],
  )(columns);
  return mapIndex(
    mapIndex((value, i) => ({
      value,
      formatted: formatters[i](value),
    })),
  )(data);
};

const filterData = (filterVal, dv) => {
  console.log('filter.filterVal: ', filterVal);
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

const actions = createActions({
  dataView: {
    set: undefined,
  },
  filter: {
    set: undefined,
  },
  paging: {
    pageSize: {
      set: undefined,
    },
    currentPage: {
      set: undefined,
    },
  },
});

const makeReducer = initialState =>
  handleActions(
    {
      [actions.paging.pageSize.set]: (state, payload) => ({
        ...state,
        pageSize: payload,
      }),
      [actions.paging.currentPage.set]: (state, {payload}) => ({
        ...state,
        currentPage: payload,
      }),
      [actions.filter.set]: (state, {payload}) => ({
        ...state,
        filter: payload,
        dataView: state.filterFunc(payload, state.initialData),
      }),
      [actions.dataView.set]: (state, {payload}) => ({
        ...state,
        dataView: payload,
      }),
    },
    initialState,
  );

export const DataTable = ({
  caption = 'table caption required',
  columns,
  data,
  sortable = false,
  filterable = false,
  filterFunc = filterData,
  pageable = false,
  currentPage = 1,
  pageSize = 10,
}) => {
  // sort based on the raw data, sorting function
  // filter based on the formatted data
  const formattedData = formatData(columns, data);

  const initialState = {
    currentPage,
    pageSize,
    totalPages: Math.ceil(formattedData.length / pageSize),
    filter: '',
    filterFunc,
    initialData: formattedData,
    dataView: formattedData,
  };
  const [state, dispatch] = useReducer(makeReducer(initialState), initialState);

  const handleAscSort = () =>
    dispatch(actions.dataView.set(handleSort(R.ascend)));
  const handleDescSort = () =>
    dispatch(actions.dataView.set(handleSort(R.descend)));

  const filterRow = filterable ? (
    <tr className="filter-row">
      <th>
        <Filter
          onChange={filterVal => dispatch(actions.filter.set(filterVal))}
          value={state.filter}
        />
      </th>
    </tr>
  ) : null;

  const pagingRow = pageable ? (
    <tr>
      <td colSpan={columns.length}>
        <Paging
          pageSize={state.pageSize}
          onPageSizeChange={size => dispatch(actions.paging.pageSize.set(size))}
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          onSetCurrentPage={pageNumber =>
            dispatch(actions.paging.currentPage.set(pageNumber))
          }
        />
      </td>
    </tr>
  ) : null;

  return (
    <table className="">
      <caption>{caption}</caption>
      <thead>
        {filterRow}
        <tr className="header-row">
          {mapIndex((c, i) => (
            <HeaderCell
              key={i}
              sortable={sortable}
              onAsc={() => handleAscSort(i, state.dataView, columns[i])}
              onDesc={() => handleDescSort(i, state.dataView, columns[i])}
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
      <tfoot>{pagingRow}</tfoot>
    </table>
  );
};
