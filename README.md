# Escape Room Management

## TIN MP1 - Statyczny wygląd dla wszystkich wymaganych widoków

### Widoki dla tabeli: `guest`

* rejestracja (CREATE)
* profil (READ, UPDATE, DELETE)
* lista gości (READ)

### Widoki dla tabel: `reservation` i `reservation_guest`

* nowa rezerwacja (CREATE)
* płatność (UPDATE)
* szczegóły rezerwacji (READ, UPDATE, DELETE*)
* lista rezerwacji (READ)

(anulowane rezerwacje nie będą usuwane z bazy danych)

### Widoki dla tabeli: `room`

* nowy pokój (CREATE)
* szczegóły pokoju (READ, UPDATE, DELETE)
* lista pokoi (READ)
