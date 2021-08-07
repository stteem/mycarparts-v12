import { createReducer, on, Action, State } from '@ngrx/store';

import { retrieveSearch } from './search.action';
import { Result } from './search.model';

export const initialState: ReadonlyArray<Result> = [];

export const searchReducer = createReducer(
  initialState,
  on(retrieveSearch, (state, { result }) => [result])
);
