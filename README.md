## Wojciech Fabjańczuk s21471 (TIN ABD 12c)

# Instalacja

Do lokalnego zainstalowania i uruchomienia aplikacji wystarczą:

- Docker
- Docker Compose
- komenda `docker compose up` w folderze z `docker-compose.yml`

Na Windowsie/WSL pierwsze stawianie środowiska zajmuje mi 4 minuty. 
Najdłużej czeka się na zainstalowanie wszystkich *node_modules* dla kontenera *erm_frontend*.

**W razie problemów z instalacją zapraszam do kontaktu poprzez Teams.**

# Środowisko

Po uruchomieniu środowiska lokalnie:

- frontend http://localhost:3000
    - ścieżka do projektu: `./webroot/erm_frontend/`
- backend http://localhost:9000
    - ścieżka do projektu: `./webroot/erm_backend/`
- baza danych
    - technologia: `PostgreSQL`
    - host: `localhost`
    - port: `54321`
    - database: `erm`
    - user: `developer`
    - password: `db_password`

# Baza danych

Z bazą danych nic nie trzeba robić. Do zresetowania jej zawartości służy skrypt `./scripts/reset_database.sql`
który jest automatycznie uruchamiany przy każdym włączeniu serwera *erm_backend*.
