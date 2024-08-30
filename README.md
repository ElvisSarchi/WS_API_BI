# WS_API_BI

Configuracion para conexion a Oracle de consulta de tabla para el BI

## Instrucciones de inicio

Antes de comenzar, asegúrate de tener Node.js y npm (o pnpm) instalados en tu máquina.

1. Abre una terminal y navega hasta el directorio del proyecto.

2. Ejecuta el siguiente comando para instalar las dependencias:

   ```bash
   npm install
   # o
   pnpm install
   ```
3. Se necesita la private.pem que este en la ubicacion `/src/controllers/encrypt/private.pem`

4. Una vez que se hayan instalado las dependencias, puedes iniciar el servidor ejecutando el siguiente comando:

   ```bash
   npm start
   # o
   pnpm start
   ```

   Esto iniciará el servidor y podrás acceder a él en `http://localhost:PORT`.

## Variables de entorno

El archivo `.env` contiene las siguientes variables de entorno:

| Variable | Descripción                                      |
| -------- | ------------------------------------------------ |
| PORT     | El puerto en el que se levanta el proyecto.      |
| SECRET     | La clave secreta para desencriptar     |
| CLIENT_ORACLEPATH   | La ubiacin del archvio InstantClient del Oracle |
| URL_ORACLE   | Conexion String de Oracle ej: localhost/XE |

Asegúrate de configurar correctamente estas variables en el archivo `.env` antes de iniciar el servidor.

