import { Component, OnInit } from '@angular/core';
declare let window: any

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account = String
  permissions = []

  constructor() { }

  async ngOnInit(): Promise<void> {
    let accounts = await window.ethereum.request({ method: 'eth_accounts' })
    this.account = accounts[0]
    this.permissions = await window.ethereum.request({ method: 'wallet_getPermissions' })
  }

}
