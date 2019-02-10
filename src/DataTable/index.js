import React, {useEffect, useReducer} from 'react';
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

const sortView = (direction, columnData, colIndex, view) => {
  if (!columnData) return view;
  const comparator = columnData.sort
    ? columnData.sort(colIndex)
    : R.path([colIndex, 'value']);
  return R.sort(direction(comparator), view);
};

const actions = createActions({
  data: {
    set: undefined,
  },
  sort: (direction, colIndex) => ({direction, colIndex}),
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

const debug = f => (...args) => {
  console.log('A: ', typeof args[1], args[1]);
  return f.apply(null, args);
};

const reducer = handleActions(
  {
    [actions.paging.pageSize.set]: debug((state, {payload}) => {
      const newTotalPages = Math.ceil(state.formattedData.length / payload);
      const newPageData = {
        ...state.pageData,
        pageSize: Number(payload),
        totalPages: newTotalPages,
        currentPage: 1,
      };
      return {
        ...state,
        pageData: newPageData,
        dataView: calcDataView(
          state.formattedData,
          state.filterData,
          state.sortData,
          newPageData,
        ),
      };
    }),
    [actions.paging.currentPage.set]: debug((state, {payload}) => ({
      ...state,
      pageData: {
        ...state.pageData,
        currentPage: payload,
      },
      dataView: calcDataView(
        state.formattedData,
        state.filterData,
        state.sortData,
        {...state.pageData, currentPage: payload},
      ),
    })),
    [actions.filter.set]: debug((state, {payload}) => ({
      ...state,
      filterData: {
        ...state.filterData,
        filter: payload,
      },
      dataView: calcDataView(
        state.formattedData,
        {...state.filterData, filter: payload},
        state.sortData,
        state.pageData,
      ),
    })),
    [actions.sort]: debug((state, {payload}) => {
      const {colIndex} = payload;
      const newSortData = {
        ...state.sortData,
        ...payload,
        column: state.columns[colIndex],
      };
      return {
        ...state,
        sortData: newSortData,
        dataView: calcDataView(
          state.formattedData,
          state.filterData,
          newSortData,
          state.pageData,
        ),
      };
    }),
    [actions.data.set]: debug((state, {payload: data}) => {
      const formatted = formatData(state.columns, data);
      const dv = calcDataView(
        formatted,
        state.filterData,
        state.sortData,
        state.pageData,
      );
      return {
        ...state,
        rawData: data,
        formattedData: formatted,
        dataView: dv,

        // todo: reset all the filtering, sorting, paging data...
        totalPages: Math.ceil(formatted.length / state.pageSize),
      };
    }),
  },
  {},
);

const filterWith = filterData => data =>
  filterData.filterFunc(filterData.filter, data);

const sortWith = sortData => data =>
  sortView(
    sortData.sortMap[sortData.direction],
    sortData.column,
    sortData.colIndex,
    data,
  );

const pageWith = pageData => data => {
  const begin = (pageData.currentPage - 1) * pageData.pageSize;
  const end = begin + pageData.pageSize;
  return R.slice(begin, end)(data);
};

const calcDataView = (formattedData, filterData, sortData, pageData) =>
  R.pipe(
    filterWith(filterData),
    sortWith(sortData),
    pageWith(pageData),
  )(formattedData);

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
  // sort based on the raw data + sorting function
  // filter based on the formatted data
  const formattedData = formatData(columns, data);

  const initialState = {
    pageData: {
      currentPage,
      pageSize,
      totalPages: Math.ceil(formattedData.length / pageSize),
    },
    filterData: {
      filter: '',
      filterFunc,
    },
    sortData: {
      direction: '',
      colIndex: undefined,
      column: undefined,
      sortMap: {
        asc: R.ascend,
        desc: R.descend,
      },
    },
    // data
    columns,
    rawData: [],
    formattedData: [],
    dataView: [],
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
                pageSize={state.pageData.pageSize}
                onPageSizeChange={size =>
                  dispatch(actions.paging.pageSize.set(size))
                }
                currentPage={state.pageData.currentPage}
                totalPages={state.pageData.totalPages}
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
