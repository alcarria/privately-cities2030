import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from "../../environments/environment";
// @ts-ignore
import DeadDrop from "../../assets/contracts/DeadDrop.json";
// @ts-ignore
import Groups from "../../assets/contracts/Groups.json";
// @ts-ignore
import Privates from "../../assets/contracts/Privates.json";

declare let window: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private deadDropContract = new window.web3.eth.Contract(
    DeadDrop.abi,
    environment.deaddrop_address
  )

  private groupContract = new window.web3.eth.Contract(
    Groups.abi,
    environment.group_address
  )

  private privatesContract = new window.web3.eth.Contract(
    Privates.abi,
    environment.privates_address
  )
  metamask_accounts = ""
  loading = false
  error = ""

  constructor(private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    const permissions = await window.ethereum.request({method: 'wallet_getPermissions'});
    this.metamask_accounts = await window.ethereum.request({method: 'eth_accounts'});

    if (Array.isArray(permissions) && permissions.length) {
      console.log('DApp permissions:')
      console.log(permissions[0])
    }
  }

  onLogin(): void {
    this.loading = true

    //Solicitamos que inicie sesion con Metamask
    window.ethereum
      .request({
        method: 'eth_requestAccounts'
      })
      .then(() => {
        let publicKey = ""
        // Cuando ha iniciado sesion le pedimos permiso para añadir la publica al contrato
        window.ethereum.request({
          method: 'eth_getEncryptionPublicKey',
          params: [this.metamask_accounts[0]]
        })
          .then((result: any) => {
            publicKey = result;
            // Comprobamos si la clave publica esta en el contrato deadDrop
            this.deadDropContract.methods.getPublicKey(this.metamask_accounts[0]).call().then((result: any) => {
              if (result !== publicKey) {
                //Si no esta, la añadimos
                this.deadDropContract.methods.setPublicKey(this.metamask_accounts[0], publicKey).send({from: this.metamask_accounts[0]})
                  .then(() => {
                    //Cuando se ha añadido su clave publica al contrato se sigue adelante en el proceso de login
                    this.router.navigate(['dead-drop'])
                  })
              } else {
                //Si esta, no la añadimos
                this.router.navigate(['dead-drop'])
              }
            })

            // Comprobamos si la clave publica esta en el contrato group
            this.groupContract.methods.getPublicKey(this.metamask_accounts[0]).call().then((result: any) => {
              if (result !== publicKey) {
                //Si no esta, la añadimos
                this.groupContract.methods.setPublicKey(this.metamask_accounts[0], publicKey).send({from: this.metamask_accounts[0]})
                  .then(() => {
                    //Cuando se ha añadido su clave publica al contrato se sigue adelante en el proceso de login
                    this.router.navigate(['dead-drop'])
                  })
              } else {
                //Si esta, no la añadimos
                this.router.navigate(['dead-drop'])
              }
            })

            this.privatesContract.methods.getPublicKey(this.metamask_accounts[0]).call().then((result: any) => {
              if (result !== publicKey) {
                //Si no esta, la añadimos
                this.privatesContract.methods.setPublicKey(this.metamask_accounts[0], publicKey).send({from: this.metamask_accounts[0]})
                  .then(() => {
                    //Cuando se ha añadido su clave publica al contrato se sigue adelante en el proceso de login
                    this.router.navigate(['dead-drop'])
                  })
              } else {
                //Si esta, no la añadimos
                this.router.navigate(['dead-drop'])
              }
            })
          })
      })
      .catch((error: any) => {
        console.log(error)
        this.error = "No se ha podido conectar con MetaMask."
      })
      .finally(() => {
        this.loading = false
      });
  }
}
