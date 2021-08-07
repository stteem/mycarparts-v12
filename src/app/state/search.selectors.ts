import { createSelector, createFeatureSelector } from "@ngrx/store";
import { SearchResultState } from "./search.state";
import { Result } from './search.model';


export const selectSearchResult = createSelector(
    (state: SearchResultState) => state.result,
    (result: Array<Result>) => result
);
