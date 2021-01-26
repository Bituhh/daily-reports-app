import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {propsCreator} from '@core/models/props-creator.model';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, createAction, props} from '@ngrx/store';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {Observable, of} from 'rxjs';
import {TestScheduler} from 'rxjs/testing';
import {NgrxUtilsService} from './ngrx-utils.service';

class TestService {
  constructor() {
  }

  testMethod(params: any) {
    return of(params);
  }
}

describe('NgrxUtilsService', () => {
  let service: NgrxUtilsService;
  let store: MockStore;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            products: {
              data: 1,
            },
          },
        }),
        provideMockActions(() => actions$),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(NgrxUtilsService);
    store = TestBed.inject(MockStore);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('Unit Testing', () => {
    describe('actionToAction', () => {
      it('should dispatch skip action if condition is false', async(() => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction(
            '[Test Effect] start tests',
            propsCreator(),
          );
          const actionsToDispatch = createAction(
            '[Test Effect] start first test',
            propsCreator(),
          );
          const actionToExpect = createAction(
            '[Test Service] start tests skip',
            propsCreator(),
          );

          actions$ = hot('a', {a: actionToListen({})});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            condition: () => false,
            stores: [
              store.select('products')
            ],
            actionsToDispatch,
          })).toBe('b', {b: actionToExpect({})});
        });
      }));

      it('should dispatch action if condition doesn\'t exists', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');
          const actionsToDispatch = createAction('[Test Effect] start first test');

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            stores: [store.select('products')],
            actionsToDispatch,
          })).toBe('b', {b: actionsToDispatch()});
        });
      });

      it('should dispatch action if stores doesn\'t exists', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');
          const actionsToDispatch = createAction('[Test Effect] start first test');

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            actionsToDispatch,
          })).toBe('b', {b: actionsToDispatch()});
        });
      });

      it('should dispatch multiple actions', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');
          const actionsToDispatch = [
            createAction('[Test Effect] start first test'),
            createAction('[Test Effect] start second test'),
          ];

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            actionsToDispatch,
          })).toBe('(bc)', {b: actionsToDispatch[0](), c: actionsToDispatch[1]()});
        });
      });

      it('should fail if empty array is provided to actionsToDispatch', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            actionsToDispatch: [],
          })).toBe('#', null, 'At least one action is required!');
        });
      });

      it('should NOT dispatch a payload if the dispatched action has not payload', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction(
            '[Test Effect] start tests',
            propsCreator<{ value: string }>(),
          );
          const actionsToDispatch = createAction('[Test Effect] start first test');

          actions$ = hot('a', {a: actionToListen({value: 'Test Value'})});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            actionsToDispatch,
          })).toBe('b', {b: actionsToDispatch()});
        });
      });

      it('should NOT dispatch a payload if the dispatched action has not payload and store is provided', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction(
            '[Test Effect] start tests',
            propsCreator<{ value: string }>(),
          );
          const actionsToDispatch = createAction('[Test Effect] start first test');
          store.setState({
            products: {
              loading: false,
              searchingSainsburys: false,
              sainsburysProducts: [],
            },
          });

          actions$ = hot('a', {a: actionToListen({value: 'Test Value'})});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            stores: [
              store.select('products'),
            ],
            actionsToDispatch,
          })).toBe('b', {b: actionsToDispatch()});
        });
      });

      it('should MAP dispatch payload if the dispatched action has extra payloads', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction(
            '[Test Effect] start tests',
            propsCreator<{ value: string, name: string }>(),
          );
          const actionsToDispatch = createAction(
            '[Test Effect] start first test',
            propsCreator<{ name: string }>(),
          );

          const expectedAction = actionsToDispatch({name: 'Victor'});
          actions$ = hot('a', {a: actionToListen({value: 'Test Value', name: 'Victor'})});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            actionsToDispatch,
          })).toBe('b', {b: expectedAction});
        });
      });

      it('should MAP multiple dispatch payload if the dispatched action has extra payloads', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction(
            '[Test Effect] start tests',
            (x: { value: string, name: string }) => ({value: x.value, name: x.name}),
          );
          const actionToDispatch1 = createAction(
            '[Test Effect] start first test',
            (x: { value: string }) => ({value: x.value}),
          );
          const actionToDispatch2 = createAction(
            '[Test Effect] start second test',
            (y: { name: string }) => ({name: y.name}),
          );

          actions$ = hot('a', {a: actionToListen({value: 'Tennis', name: 'Victor'})});

          expectObservable(service.actionToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            actionsToDispatch: [
              actionToDispatch1,
              actionToDispatch2,
            ],
          })).toBe('(bc)', {b: actionToDispatch1({value: 'Tennis'}), c: actionToDispatch2({name: 'Victor'})});
        });
      });
    });

    describe('actionToServiceToAction', () => {
      it('should handle the service and dispatch a success action', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');
          const expectedAction = createAction('[Test Service] start tests complete');
          const testService = new TestService();

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToServiceToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            serviceMethod: testService.testMethod,
          })).toBe('b', {b: expectedAction()});
        });
      });

      // it('should dispatch skip action if condition is false', () => {
      //   testScheduler.run(({hot, expectObservable}) => {
      //     const actionToListen = createAction('[Test Effect] start tests');
      //     const expectedAction = createAction('[Test Service] start tests skip');
      //     const testService = new TestService();
      //
      //     actions$ = hot('a', {a: actionToListen()});
      //
      //     expectObservable(service.actionToServiceToAction({
      //       actionsToListenTo: [
      //         actionToListen,
      //       ],
      //       condition: () => false,
      //       serviceMethod: testService.testMethod,
      //     })).toBe('b', {b: expectedAction()});
      //   });
      // });

      it('should dispatch success action with store state', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');
          const expectedAction = createAction('[Test Service] start tests complete', props<{ data: number }>());
          const testService = new TestService();

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToServiceToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            stores: [
              store.select('products'),
            ],
            serviceMethod: testService.testMethod,
            outputTransform: (data, action, state) => {
              return state;
            },
          })).toBe('b', {b: expectedAction({data: 1})});
        });
      });

      it('should dispatch failed action', () => {
        testScheduler.run(({hot, expectObservable}) => {
          const actionToListen = createAction('[Test Effect] start tests');
          const expectedAction = createAction('[Test Service] start tests failed', props<{ error?: string }>());
          const testService = new TestService();
          spyOn(testService, 'testMethod').and.throwError(new Error('error'));

          actions$ = hot('a', {a: actionToListen()});

          expectObservable(service.actionToServiceToAction({
            actionsToListenTo: [
              actionToListen,
            ],
            stores: [
              store.select('products'),
            ],
            serviceMethod: testService.testMethod,
            outputTransform: (data, action, state) => {
              return state;
            },
          })).toBe('(b|)', {b: expectedAction({error: 'error'})});
        });
      });
    });
  });

  describe('Integration Testing', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });
});
