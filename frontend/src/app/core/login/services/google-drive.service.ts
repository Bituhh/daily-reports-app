import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class GoogleDriveService {

  private readonly rootReportFolderId = '1v5fAYR5S8Vrb2Xd2WpGQ8vgUbUhHNmRq';

  listFoldersApi = (id: string = this.rootReportFolderId) => `https://www.googleapis.com/drive/v2/files/${id}/children`;

  // private readonly rootReportFolderId = '1FEqq_SnlkH3GzsEBv3vCrGWBruycUCTS';

  constructor(private httpClient: HttpClient) {
  }

  // TODO - remove accessToken params and change
  getWeekFolderId(accessToken: string, weekNumber: string = 'X'): Observable<{id: string}> {
    let headers: HttpHeaders = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    const params = {q: `title='Week ${weekNumber}'`};
    return this.httpClient.get<{ items: Children[] }>(this.listFoldersApi(), {
      headers,
      params,
    }).pipe(switchMap(x => {
      console.log(x);
      return of({id: x.items[0].id});
    }));
  }

  // TODO - remove accessToken params and change
  getFillRateReportId(accessToken: string, weekFolderId: string, weekNumber: string = 'X') {
    let headers: HttpHeaders = new HttpHeaders({'Authorization': 'Bearer ' + accessToken});
    const params = {q: `title='WK ${weekNumber} Fill Rate Report'`};
    return this.httpClient.get<{ items: Children[] }>(this.listFoldersApi(weekFolderId), {
      headers,
      // params,
    }).pipe(switchMap(x => {
      console.log(x);
      return of({id: x.items[0].id});
    }));
  }
}

interface Children {
  kind: 'drive#childReference',
  id: string,
  selfLink: string,
  childLink: string
}
