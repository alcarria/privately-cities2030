import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DataExchangeService {

  dataSource = new BehaviorSubject<any>('');
  data$ = this.dataSource.asObservable();

  constructor() { }

  public notify(message: any){
    if (message){
      this.dataSource.next(message);
    }
  }
}
