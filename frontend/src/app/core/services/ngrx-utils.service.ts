import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {AlertController, ToastController} from '@ionic/angular';
import {Actions, ofType} from '@ngrx/effects';
import {Action, ActionCreator} from '@ngrx/store';
import {FunctionWithParametersType} from '@ngrx/store/src/models';
import * as _ from 'lodash';
import {combineLatest, from, Observable, of, throwError} from 'rxjs';
import {catchError, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class NgrxUtilsService {

  constructor(private toastController: ToastController,
              private alertController: AlertController,
              private router: Router,
              private actions$: Actions) {
  }

  actionToAction<A, B, C, D, E>(params: {
    actionsToListenTo: FunctionWithParametersType<any, Action>[];
    actionsToDispatch: FunctionWithParametersType<any, Action> | Array<FunctionWithParametersType<any, Action>>;
    stores?: [Observable<A>, Observable<B>, Observable<C>, Observable<D>, Observable<E>];
    payloadTransform?: (action: Action, ...states: [A, B, C, D, E]) => {};
    condition?: (action: Action, ...states: [A, B, C, D, E]) => boolean;
  }): Observable<Action>;
  actionToAction<A, B, C, D>(params: {
    actionsToListenTo: FunctionWithParametersType<any, Action>[];
    actionsToDispatch: FunctionWithParametersType<any, Action> | Array<FunctionWithParametersType<any, Action>>;
    stores?: [Observable<A>, Observable<B>, Observable<C>, Observable<D>];
    payloadTransform?: (action: Action, ...states: [A, B, C, D]) => {};
    condition?: (action: Action, ...states: [A, B, C, D]) => boolean;
  }): Observable<Action>;
  actionToAction<A, B, C>(params: {
    actionsToListenTo: FunctionWithParametersType<any, Action>[];
    actionsToDispatch: FunctionWithParametersType<any, Action> | Array<FunctionWithParametersType<any, Action>>;
    stores?: [Observable<A>, Observable<B>, Observable<C>];
    payloadTransform?: (action: Action, ...states: [A, B, C]) => {};
    condition?: (action: Action, ...states: [A, B, C]) => boolean;
  }): Observable<Action>;
  actionToAction<A, B>(params: {
    actionsToListenTo: FunctionWithParametersType<any, Action>[];
    actionsToDispatch: FunctionWithParametersType<any, Action> | Array<FunctionWithParametersType<any, Action>>;
    stores?: [Observable<A>, Observable<B>];
    payloadTransform?: (action: Action, ...states: [A, B]) => {};
    condition?: (action: Action, ...states: [A, B]) => boolean;
  }): Observable<Action>;
  actionToAction<T>(params: {
    actionsToListenTo: FunctionWithParametersType<any, Action>[];
    actionsToDispatch: FunctionWithParametersType<any, Action> | Array<FunctionWithParametersType<any, Action>>;
    stores?: Array<Observable<T>>;
    payloadTransform?: (action: Action, ...states: [T]) => {};
    condition?: (action: Action, ...states: [T]) => boolean;
  }): Observable<Action>;
  actionToAction(params: {
    actionsToListenTo: FunctionWithParametersType<any, Action>[];
    actionsToDispatch: FunctionWithParametersType<any, Action> | Array<FunctionWithParametersType<any, Action>>;
    stores?: Array<Observable<any>>;
    payloadTransform?: (action: Action, ...states: Array<any>) => {};
    condition?: (action: Action, ...states: Array<any>) => boolean;
  }): Observable<Action> {
    let actionType = null;
    return this.actions$.pipe(
      ofType(...params.actionsToListenTo.map(x => x({}).type)),
      withLatestFrom(combineLatest<Observable<any>>(!!params.stores ? params.stores : [of({})])),
      mergeMap(([action, states]: [Action, any]) => {
        return of({}).pipe(
          switchMap(() => {
            actionType = action.type
              .split(/(\s|\[|])/g)
              .filter(x => !!x)
              .reduce((prev, curr, i, x) => {
                if (x[i + 1] === ']') {
                  return [...prev, 'Service'];
                }
                return [...prev, curr];
              }, []).join('');
            if (!!params.condition) {
              if (!params.condition(action, ...states)) {
                return of({type: `${actionType} skip`});
              }
            }
            let payload = Object.keys(action)
              .reduce((previousValue, currentValue) => {
                if (currentValue === 'type') {
                  return previousValue;
                } else {
                  return {...previousValue, [currentValue]: action[currentValue]};
                }
              }, {});
            if (params.payloadTransform) {
              payload = params.payloadTransform(action, ...states);
            }
            if (Array.isArray(params.actionsToDispatch) && params.actionsToDispatch.length > 0) {
              return of(...params.actionsToDispatch.map(x => x(_.cloneDeep(payload))));
            } else if (Array.isArray(params.actionsToDispatch)) {
              return throwError(new Error('At least one action is required!'));
            } else {
              return of(params.actionsToDispatch(_.cloneDeep(payload)));
            }
          }),
          catchError((error: Error) => {
            if (error.message === 'At least one action is required!') {
              return throwError(error.message);
            }
            this.alertController.create({
              message: error.message,
              buttons: [
                {text: 'Ok'},
              ],
            }).then(x => x.present());
            if (actionType) {
              return of({
                type: `${actionType} failed`,
                error: error.message,
              });
            }
            return of({
              type: 'Unknown Error',
              error: error.message,
            });
          }),
        );
      }),
    );
  }

  actionToServiceToAction<A, B, C, D, E>(params: {
    actionsToListenTo: ActionCreator[];
    serviceMethod: (...args: any[]) => Observable<any>;
    payloadTransform?: (action: Action, ...states: [A, B, C, D, E]) => {};
    stores?: [Observable<A>, Observable<B>, Observable<C>, Observable<D>, Observable<E>];
    outputTransform?: (data: any, action: Action, ...states: [A, B, C, D, E]) => {};
    successToastMessage?: (data: any, action?: Action, ...states: [A, B, C, D, E]) => string;
    successAlertMessage?: (data: any, action?: Action, ...states: [A, B, C, D, E]) => string;
    successNavigation?: (navigate: (commands: any[], extras?: NavigationExtras) => Promise<boolean>) => void;
    postFailed?: (error: Error) => void;
    failedAlertType?: (error: Error) => NgrxUtilsErrorAlertType;
  }): Observable<Action>;
  actionToServiceToAction<A, B, C, D>(params: {
    actionsToListenTo: ActionCreator[];
    serviceMethod: (...args: any[]) => Observable<any>;
    payloadTransform?: (action: Action, ...states: [A, B, C, D]) => {};
    stores?: [Observable<A>, Observable<B>, Observable<C>, Observable<D>];
    outputTransform?: (data: any, action: Action, ...states: [A, B, C, D]) => {};
    successToastMessage?: (data: any, action?: Action, ...states: [A, B, C, D]) => string;
    successAlertMessage?: (data: any, action?: Action, ...states: [A, B, C, D]) => string;
    successNavigation?: (navigate: (commands: any[], extras?: NavigationExtras) => Promise<boolean>) => void;
    postFailed?: (error: Error) => void;
    failedAlertType?: (error: Error) => NgrxUtilsErrorAlertType;
  }): Observable<Action>;
  actionToServiceToAction<A, B, C>(params: {
    actionsToListenTo: ActionCreator[];
    serviceMethod: (...args: any[]) => Observable<any>;
    payloadTransform?: (action: Action, ...states: [A, B, C]) => {};
    stores?: [Observable<A>, Observable<B>, Observable<C>];
    outputTransform?: (data: any, action: Action, ...states: [A, B, C]) => {};
    successToastMessage?: (data: any, action?: Action, ...states: [A, B, C]) => string;
    successAlertMessage?: (data: any, action?: Action, ...states: [A, B, C]) => string;
    successNavigation?: (navigate: (commands: any[], extras?: NavigationExtras) => Promise<boolean>) => void;
    postFailed?: (error: Error) => void;
    failedAlertType?: (error: Error) => NgrxUtilsErrorAlertType;
  }): Observable<Action>;
  actionToServiceToAction<A, B>(params: {
    actionsToListenTo: ActionCreator[];
    serviceMethod: (...args: any[]) => Observable<any>;
    payloadTransform?: (action: Action, ...states: [A, B]) => {};
    stores?: [Observable<A>, Observable<B>];
    outputTransform?: (data: any, action: Action, ...states: [A, B]) => {};
    successToastMessage?: (data: any, action?: Action, ...states: [A, B]) => string;
    successAlertMessage?: (data: any, action?: Action, ...states: [A, B]) => string;
    successNavigation?: (navigate: (commands: any[], extras?: NavigationExtras) => Promise<boolean>) => void;
    postFailed?: (error: Error) => void;
    failedAlertType?: (error: Error) => NgrxUtilsErrorAlertType;
  }): Observable<Action>;
  actionToServiceToAction<A>(params: {
    actionsToListenTo: ActionCreator[];
    serviceMethod: (...args: any[]) => Observable<any>;
    payloadTransform?: (action: Action, ...states: [A]) => {};
    stores?: [Observable<A>];
    outputTransform?: (data: any, action: Action, ...states: [A]) => {};
    successToastMessage?: (data: any, action?: Action, ...states: [A]) => string;
    successAlertMessage?: (data: any, action?: Action, ...states: [A]) => string;
    successNavigation?: (navigate: (commands: any[], extras?: NavigationExtras) => Promise<boolean>) => void;
    postFailed?: (error: Error) => void;
    failedAlertType?: (error: Error) => NgrxUtilsErrorAlertType;
  }): Observable<Action>;
  actionToServiceToAction(params: {
    actionsToListenTo: ActionCreator[];
    serviceMethod: (...args: any[]) => Observable<any>;
    payloadTransform?: (action: Action, ...states: Array<any>) => {};
    stores?: Array<Observable<any>>;
    outputTransform?: (data: any, action: Action, ...states: Array<any>) => {};
    successToastMessage?: (data: any, action?: Action, ...states: Array<any>) => string;
    successAlertMessage?: (data: any, action?: Action, ...states: Array<any>) => string;
    successNavigation?: (navigate: (commands: any[], extras?: NavigationExtras) => Promise<boolean>) => void;
    postFailed?: (error: Error) => void;
    failedAlertType?: (error: Error) => NgrxUtilsErrorAlertType;
  }): Observable<Action> {
    let actionType: string = null;
    return this.actions$.pipe(
      ofType(...params.actionsToListenTo),
      withLatestFrom(combineLatest<Observable<any>>(!!params.stores ? params.stores : [of({})])),
      mergeMap(([action, states]: [Action, any]) => {
        return of({}).pipe(
          switchMap(() => {
            actionType = action.type
              .split(/(\s|\[|])/g)
              .filter(x => !!x)
              .reduce((prev, curr, i, x) => {
                if (x[i + 1] === ']') {
                  return [...prev, 'Service'];
                }
                return [...prev, curr];
              }, []).join('');
            let payload = Object.keys(action)
              .reduce((previousValue, currentValue) => {
                if (currentValue === 'type') {
                  return previousValue;
                } else {
                  return {...previousValue, [currentValue]: action[currentValue]};
                }
              }, {});
            if (!!params.payloadTransform) {
              payload = params.payloadTransform(action, ...states);
            }
            return from(params.serviceMethod(payload)).pipe(
              mergeMap((data): Observable<Action> => {
                if (!!params.successAlertMessage) {
                  this.alertController.create({
                    message: params.successAlertMessage(data, action, ...states),
                    buttons: [
                      {text: 'Ok'},
                    ],
                  }).then(x => x.present());
                }
                if (!!params.successToastMessage) {
                  this.toastController.create({
                    message: params.successToastMessage(data, action, ...states),
                    duration: 4000,
                  }).then(x => x.present());
                }
                if (!!params.successNavigation) {
                  params.successNavigation(this.router.navigate.bind(this.router));
                }
                return of({
                  type: `${actionType} complete`,
                  ...(_.cloneDeep(!!params.outputTransform ? params.outputTransform(data, action, ...states) : data)),
                });
              }),
            );
          }),
          catchError((error: Error) => {
            console.error(error);
            switch (params.failedAlertType ? params.failedAlertType(error) : NgrxUtilsErrorAlertType.default) {
              case NgrxUtilsErrorAlertType.none:
                break;
              case NgrxUtilsErrorAlertType.alert:
                this.alertController.create({
                  message: error.message,
                  buttons: [
                    {text: 'Ok'},
                  ],
                }).then(x => x.present());
                break;
              case NgrxUtilsErrorAlertType.toast:
                this.toastController.create({
                  message: error.message,
                  duration: 4000,
                }).then(x => x.present());
                break;
              case NgrxUtilsErrorAlertType.default:
              default:
                this.alertController.create({
                  message: error.message,
                  buttons: [
                    {text: 'Ok'},
                  ],
                }).then(x => x.present());
                break;
            }
            if (params.postFailed) {
              params.postFailed(error);
            }
            if (actionType) {
              return of({
                type: `${actionType} failed`,
                error: error.message,
              });
            }
            return of({
              type: 'Unknown Error',
              error: error.message,
            });
          }),
        );
      }),
    );
  }
}

export enum NgrxUtilsErrorAlertType {
  none,
  toast,
  alert,
  default
}
