import React from 'react';
import {fireEvent, render, debugDOM, waitForElement} from '../../testUtils';
import {Paging} from '../Paging';

const debugSelector = (node, selector) =>
  console.log(node.querySelector(selector));

describe('<Paging />', () => {
  it('should render all page size options', async () => {
    const props = {
      pageData: {
        pageSize: 5,
        currentPage: 1,
        totalPages: 10,
        pageSizeOptions: [1, 5, 10, 25],
      },
      onPageSizeChange: jest.fn(),
      onSetCurrentPage: jest.fn(),
      filteredCount: 1,
      totalCount: 2,
    };
    const {container, getByText} = render(<Paging {...props} />);
    // debugDOM(container);
    await waitForElement(() =>
      getByText(`${props.pageData.pageSize} per page`),
    );

    fireEvent.focus(container.querySelector('.paging-select input'));
    fireEvent.mouseDown(container.querySelector('.paging-select__control'));
    await waitForElement(() => getByText('1 per page'));
    await waitForElement(() => getByText('5 per page'));
    await waitForElement(() => getByText('10 per page'));
    await waitForElement(() => getByText('25 per page'));
  });

  it('should render page number and total', () => {
    //
  });

  it('should disble previous when on page 1', () => {
    //
  });

  it('should disable next when on last page', () => {
    //
  });

  it('should call onPageSizeChange when page size changed', () => {
    //
  });
});
