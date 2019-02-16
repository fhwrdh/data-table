import React from 'react';
import {render} from 'react-testing-library';
import {debugDOM} from '../../testUtils';
import {Row} from '../Row';

describe('<Row />', () => {
  it.only('should render', () => {
    const props = {
      rowData: [{}, {}],
      columnData: [{}, {}],
    };
    const {container} = render(
      <table>
        <tbody>
          <Row {...props}> </Row>
        </tbody>
      </table>,
    );
    // debugDOM(container);
    const cellCount = container.getElementsByTagName('td').length;
    expect(cellCount).toEqual(props.columnData.length);
  });
});
