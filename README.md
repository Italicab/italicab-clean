# ITALICAB - versione semplice senza Firebase

Questa versione funziona senza fatturazione Firebase.

## Funzioni
- Catalogo pubblico IT/EN
- Prezzi visibili
- Schede tecniche collegate da `public/datasheets`
- Area Admin demo con password `admin`
- Aggiunta/modifica prodotti nel browser
- Esporta/importa catalogo JSON

## Pubblicazione su Vercel
1. Carica questi file nel repository GitHub `italicab-demo`.
2. Vercel aggiorna automaticamente il sito.

## Schede tecniche PDF
Metti i PDF nella cartella:

`public/datasheets/`

Nel prodotto indica esattamente il nome file, esempio:

`H07RN_F.EN.pdf`

## Limite di questa versione
Senza database, i prodotti aggiunti dall'Area Admin restano nel browser usato. Per conservarli e trasferirli:
- usa `Esporta catalogo JSON`
- poi usa `Importa catalogo JSON` su un altro PC/browser

Per admin reale con PDF permanenti serve backend/database.
