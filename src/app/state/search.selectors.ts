import { createSelector, createFeatureSelector } from "@ngrx/store";
import { SearchState } from "./search.state";
import { Result } from './search.model';
import { SearchForm } from "app/shared/searchform";



export const selectSearchKeysState = (state: SearchState) => state.search.searchkeys;

export const selectSearchResultState = (state: SearchState) => state.search.result;

/*export const selectSearchResultState = createFeatureSelector<
  SearchState,
  ReadonlyArray<Result>
>("search");*/

export const selectSearchCollection = createSelector(
    selectSearchKeysState,
    selectSearchResultState,
    (searchkeys: SearchForm, result: ReadonlyArray<Result>) => {
        return {searchkeys, result};
    }
);