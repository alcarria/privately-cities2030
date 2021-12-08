import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

// Store de address of the current user
export class Store {
    private currentAccountAddress: BehaviorSubject<string|undefined> = new BehaviorSubject<string|undefined>(undefined);

    getCurrentAccountAddress(): Observable<string|undefined> {
        return this.currentAccountAddress.asObservable()
    }

    getCurrentAccountAddressValue(): string {
        return this.currentAccountAddress.getValue() ?? ''
    }

    setCurrentAccountAddress(address: string|undefined): void {
        this.currentAccountAddress.next(address)
    }
}
