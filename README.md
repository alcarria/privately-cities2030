# Privately

## Configuración

Para que el proyecto funcione es necesario:

- Instalar truffle y ganache
- Abrir ganache
- Acceder a la carpeta truffle y ejecutar `truffle migrate`
- Copiar los `.json` de `truffle/build/contracts` a la carpeta `src/assets/contracts`
- En la carpeta `src/environment` copiar el fichero `environment.temp.ts` en la misma carpeta y renombrar a `environment.ts`; y dentro pegar la direccion del contrato en la variable deaddrop_address

# Ejecutar proyecto

Para ejecutar la aplicación, desde la raíz del proyecto ejecutamos:

- npm install
- ng serve --open
