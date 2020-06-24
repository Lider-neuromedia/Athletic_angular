import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarService {

  user : Subject<any> = new Subject<any>();
  constructor() { }

  setUser(data: string) {
    this.user.next(data);
  }
}
