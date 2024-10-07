FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    lsb-release && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    node --version && \
    npm --version && \
    npm install -g pnpm && \
    pnpm --version && \
    curl -o /opt/oracle-instantclient.zip "https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linux.x64-19.18.0.0.0dbru.zip" && \
    unzip /opt/oracle-instantclient.zip -d /opt && \
    ls -la /opt && \
    ls -la /opt/instantclient_19_18 && \
    rm /opt/oracle-instantclient.zip

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 3010

CMD [ "pnpm", "start" ]