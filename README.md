# Privately
Proyecto de fin de grado que implementa una aplicación de mensajería haciendo uso de blockchain para mantener los datos de los usuarios seguros

## Requisitos de instalación
Antes de ejecutar el repositorio, hay que instalar las siguientes herramientas:
* Node.js: esta desarrollado en la versión 14.18.0 Enlace: <https://nodejs.org/download/release/v14.18.0/>
* Ganache: desarrollado en la versión 2.5.4. Enlace: <https://github.com/trufflesuite/ganache-ui/releases/tag/v2.5.4>
* Metamask: para gestionar las cuentas de ethereum de Ganache. Enlace: <https://metamask.io/download/>

Una vez que ya se han instalado las herramientas anteriores, ejecutar Ganache y crear un nuevo espacio de ethereum. Tras ello, abrir una consola de comandos y ejecutar los siguientes comandos:
```bash 
npm install -g truffle
git clone https://github.com/gisai/privately
cd privately
npm install
cd truffle
truffle migrate
```
* Cuando acabe de migrar los contratos a la blockchain, ir a la carpeta `src/environment` y copiar el fichero `environment.temp.ts` en la misma carpeta y renombrar a `environment.ts`. Dentro de `environment.ts`, copiar las direcciones de los contratos que se han migrado en sus respectivas variables.
* Por ultimo, hay que copiar los `json` de la carpeta `truffle/build/contracts` a la carpeta `src/assets/contracts`. 
Tras todos estos pasos bastaria con ejecutar:
```bash
ng serve --open
```
Y ya se abrirá la aplicación en el navegador. Ahora solo quedaría conectar Metamask a la blockchain de Ganache y dar de alta una de las cuentas que aparecen en Metamask.
