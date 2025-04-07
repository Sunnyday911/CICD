<h1>Laporan Praktikum</h1>


LINK API : http://92.112.184.203:3000/health

<h3>Server.js</h3>

```javascript
const { timeStamp } = require('console');
const http = require('http')
const express = require('express');

const app = express();

const start = Date.now()

app.get('/health', (req, res) =>{
    const data = {
        nama: "Sanie Ghanda Prawira",
        nrp: "5025231009",
        status: "UP",
        timestamp : new Date().toISOString(),
        uptime: `${Math.floor((Date.now() - start) / 1000)} seconds`
        
    }
    res.json(data)
})

const server = http.createServer(app);
server.listen(3000);
```
Api ini dibuat dengan menggunakan Node.js dan Express.js. Endpoint `/health`akan memberikan informatis status server dengan output berupa up time server, nama, nrp, dan timestamp. Dan aplikasi ini berjalan pada port 3000.

Disini kita mengimpor modul console, http dan express untuk waktu, membuat server http dan framework Express.js untuk mempermudah pembuatan API. Kemudian di sini membuat endpoin HTTP GET dengan endpoint `/health`. Saat diakses , server akan merespon dengan JSON.

Kemudian diawah kita membuat server HTTP dan menjalankan server tersebut pada port 3000.

<h3>Dockerfile</h3>

```Dockerfile

FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app .

EXPOSE 3000

CMD ["node", "server.js"]
```

Dockerfile disini dibuat untuk otomasi proses dan  menyamakan lingkungan yang ada di server dengan yang ada di laptop.

Disini di mulai dengan image dasar untuk Node.js yaitu alpine. kemudian kita setup WORKDIR nya pada directory /app. kemudian copy `package*.json` karena untuk npm install bisa berjalan membutuhkan itu. Selanjutnya `npm install --prouction`.Selanjutnya copy semua file ke dalam container

Kemudian di membikin image baru dengan `alpine`. Keudina kita ke directory app. dan kita copy hasil build image di container 1 ke container ke 2. Kita kasih tau docker kalau server ini berjalan di port 3000. Setelah itu kita berikan command node server.js di akhir untuk run aplikasi.

<h3>docker-compose.yml</h3>

```YAML
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    restart: always
```
Disini fungsi dari dcoker-compose agar container bisa jalan dengan satu peritntah `docker-compose up -d`. Untuk di sini docker compose akan mencari dockerfile yang ada di folder skrrg. Kemudian untuk `ports: 3000:3000` ini untuk menghubungkan port laptop kita dengan port yang ada di container. Dan `restart: always` untuk otomatis restart ketika ada error atau server reboot.

<h3>.github/workflows/main.yml</h3>

```YAML
name: Deploy

on:
  push:
    branches:
    - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Set up node
      uses: actions/setup-node@v4
      with:
        node-version: '20'

    - name: install dependecies
      run: npm install

    - name: Run Test
      run: npm test

    - name: Set up SHH
      uses: webfactory/ssh-agent@v0.8.0
      with:
        ssh-private-key: ${{ secrets.SSH_KEY }}

    - name: Deploy to vps
      run: |
        ssh -o StrictHostKeyChecking=no ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} "
            if [ ! -d CICD1 ]; then
              git clone git@github.com:Sunnyday911/CICD.git CICD1;
            fi &&
            cd CICD1 &&
            git pull origin main &&
            docker compose down ||
            true &&
            docker compose up -d --build
          "
```

Nama  workflow ini adalah deploy dan akan jalan setiap ada push di brach main. Kemudian kode akan di check di action. Kemudian menginstall node.js agar bisa menjalankannya. menginstall dependecies segala keperluan. Kemudian setup SSH agar github action bisa mengakses VPS dengan mencantumkan Private SS_KEY. Setelah itu Depoy ke VPS. Masukkan VPS_UER DAN VPS_HOST. Kemudian mengecek pada server VPS apakah ada direktori CICD1. jika tidak ada maka akan di buat direktori dan akan clone repository dari github menuju direktori. Setelah itu tarik update terbaru dari branch main. Hentikan container lama dan bangun ulang dan jalankan container baru.
