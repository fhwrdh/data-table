import React from 'react';
import Icon from '@mdi/react';
import {mdiMenuUp, mdiMenuDown} from '@mdi/js';

export const Empty = () => <Icon path="" size={1} />;
export const Asc = () => <Icon path={mdiMenuUp} size={1} />;
export const Desc = () => <Icon path={mdiMenuDown} size={1} />;
