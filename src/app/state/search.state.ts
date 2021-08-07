import { Search, Result } from './search.model';

export interface SearchState {
    search: Search;
}

export interface SearchResultState {
    result: ReadonlyArray<Result>;
}