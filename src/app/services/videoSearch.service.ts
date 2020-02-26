import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class VideoSearchService {

  constructor(private http: Http) { }

  searchVideos(habilities): Promise<JSON> {

    return this.http.post(environment.apiUrl + 'consultMedia', habilities).toPromise()
      .then(response => response.json());
  }

  searchAllVideos(): Promise<JSON> {
    return this.http.get( environment.apiUrl + 'media').toPromise().then(response => response.json());
  }

  searchClientVideos(cliente): Promise<JSON> {
    return this.http.get(environment.apiUrl + 'media/' + cliente).toPromise().then(response => response.json());
  }
}
