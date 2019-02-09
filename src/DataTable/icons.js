import React from 'react';
import Icon from '@mdi/react';
import {mdiChevronDown, mdiChevronUp} from '@mdi/js';

export const Asc = () => {
  return <Icon path={mdiChevronUp} size={0.5} />;
};
export const Desc = () => {
  return <Icon path={mdiChevronDown} size={0.5} />;
};
