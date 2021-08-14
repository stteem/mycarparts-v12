import { Result } from './search.model';
import { SearchForm } from "app/shared/searchform";


export interface SearchState {
    search: {
        searchkeys: SearchForm;
        result: ReadonlyArray<Result>;
    }
}
