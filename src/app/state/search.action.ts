import { createAction, props } from '@ngrx/store';
import { Result } from './search.model';
import { SearchForm } from "app/shared/searchform";



export const searchParts = createAction(
    '[Home Page] Search Parts',
    props<{ search: SearchForm }>()
);

export const retrieveSearch = createAction(
    '[Home Page] Search Parts Success',
    props<{ result: Array<Result> }>()
);

export const SearchPartsError = createAction(
    '[Home Page] Search Parts Error'
);