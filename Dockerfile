# Utiliza la imagen base de Ubuntu 22.04
FROM ubuntu:22.04

# Actualiza los repositorios e instala dependencias necesarias
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release \
    unzip && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*  

# Verifica las versiones de Node.js y npm
RUN node --version && npm --version

# Instala pnpm
RUN npm install -g pnpm && pnpm --version

# Descarga y descomprime el Oracle Instant Client
RUN curl -o /opt/oracle-instantclient.zip "https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linux.x64-19.18.0.0.0dbru.zip" && \
    unzip /opt/oracle-instantclient.zip -d /opt && \
    rm /opt/oracle-instantclient.zip

# Cambia el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto usando pnpm
RUN pnpm install

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Expone el puerto 3010 para acceder a la aplicación
EXPOSE 3010

# Comando por defecto para ejecutar la aplicación
CMD ["pnpm", "start"]
