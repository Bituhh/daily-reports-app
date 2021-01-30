import {AppState} from '@core/store';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromLoginReducers from '../reducers/login.reducers'

const loginFeature = createFeatureSelector<AppState, fromLoginReducers.State>('login');

export const accessTokenSelector = createSelector(loginFeature, s1 => s1.accessToken);
export const isAuthenticatedSelector = createSelector(loginFeature, s1 => !!s1.accessToken);
