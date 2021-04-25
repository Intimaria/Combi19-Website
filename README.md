# Ejecución del proyecto
Para el correcto funcionamiento del proyecto y poder continuar con el mismo, es necesario tener:
1. Instalado Node LTS. link de descarga: https://nodejs.org/es/


2. Una vez descargado el proyecto y estando posicionado en la carpeta "my-backend" ejecutar:

`npm install`

3. Luego estando posicionado en la carpeta "my-frontend" ejecutar:

`npm install`

4. Para iniciar el servidor de frontend en el puerto 3000, una vez posicionados en la carpeta "my-frontend" ejecutamos el comando:

`npm run start`

Para Iniciar el servidor de backend con Nodemon (para empezar automaticamente la aplicacion de node cuando se producen cambios en el directorio) en el puerto 3001, una vez posicionados en la carpeta "my-backend" ejecutamos el comando:

`npm run devStart`

El servidor de backend se conecta a una base de datos con las siguientes caracteristicas:

host: 'localhost',
user: 'root',
password: '',
database: 'mydb'.

# Git
### Cómo subir el trabajo realizado al repositorio remoto

`git commit -A`

`git commit -m "Título del commit" -m "Cuerpo del commit (opcional)`

`git push`

### Cómo eliminar último push realizado al repositorio remoto
**Para hacerlo es necesario asegurarse que nadie esté trabajando con el commit a eliminar**

`git reset --hard HEAD^`

`git push origin -f`
