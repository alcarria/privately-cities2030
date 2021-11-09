import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare let window: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false
  error = ""

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    const permissions = await window.ethereum.request({ method: 'wallet_getPermissions' });

    if (Array.isArray(permissions) && permissions.length) {
      console.log('DApp permissions:')
      console.log(permissions[0])
    }
  }

  onLogin(): void {
    this.loading = true
    window.ethereum
      .request({
        method: 'eth_requestAccounts'
      })
      .then((result: any) => {
        this.router.navigate(['dead-drop'])
      })
      .catch((error: any) => {
        this.error = "No se ha podido conectar con MetaMask."
      })
      .finally(() => {
        this.loading = false
      });
  }
}
