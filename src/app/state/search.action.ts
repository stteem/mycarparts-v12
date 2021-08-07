import { createAction, props } from '@ngrx/store';
import { Search, Result } from './search.model';


export const searchParts = createAction(
    '[Home Page] Search Parts',
    props<{ search: Search }>()
);

export const retrieveSearch = createAction(
    '[Home Page] Search Parts Success',
    props<{ result: Result }>()
);