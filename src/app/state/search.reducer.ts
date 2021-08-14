import { createReducer, on, Action, State } from '@ngrx/store';

import { searchParts, retrieveSearch } from './search.action';

export const initialState = { 
  searchkeys: {}, 
  result: []
};

export const searchReducer = createReducer(
  initialState,
  on(searchParts, (state, { search }) => {
    return {...state, searchkeys: search};
  }),
  on(retrieveSearch, (state, { result }) => {
    return {...state, result: result};
  })
);
