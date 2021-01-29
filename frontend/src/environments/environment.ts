// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  google: {
    clientId: '943094540000-7ggkrmj4ik9qh1ej7c9412beq57t08nq.apps.googleusercontent.com',
    clientSecret: 'LZoCyNNLBkB3MH6-avIqieGO',
    redirectUri: 'http://localhost:8100',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
