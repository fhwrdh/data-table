import * as R from 'ramda';
import Rnd from 'generate-random-data';

export const makeRandomData = count => {
  return R.map(i => {
    return [
      i,
      Rnd.femaleFirstName(),
      Rnd.lastName(),
      Rnd.int(0, 1000),
      Rnd.float(-1000, 1000, 0, 99, 2),
      new Date(Rnd.datetime()),
    ];
  })(R.range(0, count));
};
