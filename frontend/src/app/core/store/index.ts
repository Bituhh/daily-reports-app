import {environment} from '@env/environment';
import {ActionReducerMap, MetaReducer} from '@ngrx/store';
import * as fromLoginReducers from '@core/store/reducers/login.reducers';

export interface AppState {
  login: fromLoginReducers.State;
}

export const reducers: ActionReducerMap<AppState> = {
  login: fromLoginReducers.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
