import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { searchParts, retrieveSearch, SearchPartsError } from 'app/state/search.action';

@Injectable()
export class SearchEffects {

  loadMovies$ = createEffect(() => this.actions$.pipe(
    ofType(searchParts),
    mergeMap(({search}) => this.searchservice.searchStores(search)
      .pipe(
        map(result => retrieveSearch({result})),
        catchError(() => EMPTY)
      ))
    )
  );

  constructor(
    private actions$: Actions,
    private searchservice: SearchService
  ) {}
}