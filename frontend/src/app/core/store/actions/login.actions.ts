import {ActionError} from '@core/models/action-error.model';
import {propsCreator} from '@core/models/props-creator.model';
import {createAction} from '@ngrx/store';

const LOGIN: 'Login' = 'Login';


// Authenticate Actions
export const PageAuthenticateAction = createAction(
  `[${LOGIN} Page] authenticate`,
);
export const RouterAuthenticateAction = createAction(
  `[${LOGIN} Router] authenticate`,
);
export const EffectAuthenticateAction = createAction(
  `[${LOGIN} Effect] authenticate`,
);
export const ServiceAuthenticateCompleteAction = createAction(
  `[${LOGIN} Service] authenticate complete`,
  propsCreator<{ accessToken: string }>('accessToken'),
);
export const ServiceAuthenticateFailedAction = createAction(
  `[${LOGIN} Service] authenticate failed`,
  propsCreator<ActionError>('error'),
);

