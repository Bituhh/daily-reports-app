import {Action, createReducer, on} from '@ngrx/store';
import * as LoginActions from '../actions/login.actions';

export interface State {
  loading: boolean;
  accessToken: string;
}

export const initialState: State = {
  loading: false,
  accessToken: null,
};

const loginReducers = createReducer(
  initialState,

  on(LoginActions.EffectAuthenticateAction,
    state => ({...state, loading: true})),
  on(LoginActions.ServiceAuthenticateCompleteAction,
    (state, {accessToken}) => ({...state, loading: false, accessToken})),
  on(LoginActions.ServiceAuthenticateFailedAction,
    state => ({...state, loading: false})),
);

export function reducer(state: State | undefined, action: Action) {
  return loginReducers(state, action);
}
