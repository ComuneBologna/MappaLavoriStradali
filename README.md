# LAVORI ASSE STRADALE

Il software permette di gestire l'iter di pianificazione dei cantieri stradali nel territorio in grado di rispondere alle esigenze dei diversi stakeholder coinvolti nel processo.

## DESCRIZIONE
### Contesto/necessità
Il Dipartimento Lavori Pubblici, Mobilità e Patrimonio Settore Mobilità Sostenibile e Infrastrutture - U.I. Gestione Viabilità - U.O. Nucleo Operativo Interventi del Comune di Bologna ha fatto emergere la necessità di poter avere in unico punto, in forma digitale, accessibile, semplice e chiara un repository della pianificazione dei lavori stradali complessivi dell’intero territorio del Comune di Bologna per visualizzare in tempo reale le vie e i quartieri in cui sono effettuati i lavori.

### Soluzione
Il Settore Agenda Digitale e Tecnologie Informatiche del Comune di Bologna ha risposto a tali necessità, realizzando un applicativo in grado di gestire complessivamente il sistema dei lavori stradali.
L’applicativo individuato è in grado di rispondere alle esigenze dei diversi stakeholder coinvolti nel processo:
- Dipartimento Lavori Pubblici, Mobilità e Patrimonio Settore Mobilità Sostenibile e Infrastrutture del comune di Bologna: attività di pianificazione dei lavori e invio compilazione richieste alle ditte coinvolte
- Enti terzi: ditte che richiedono approvazione per i lavori e compilano Excel di richiesta;
- Ufficio Comunicazione del Comune di Bologna: approvata la richiesta, possono procedere con la comunicazione del cantiere su canali istituzionali e inserire su mappa l’attività;
- Cittadini: possibilità di accedere alle informazioni, verificare lo stato AS IS e TO BE della situazione cantieri e navigare la mappa geografica.

La piattaforma è in grado quindi di gestire diverse utenze: dagli stakeholder con attività operative-gestionali a quelle in sola visualizzazione.
La soluzione permette di gestire una mappatura geografica (è stata inserita una mappatura di quartieri, sezioni stradali e strade proprio per agevolare la navigabilità) dei lavori in corso sul territorio comunale, verificare l’iter di approvazione delle richieste di cantieri e gestire una pianificazione degli interventi futuri.

### Vantaggi – Risultati
L’attività permette una gestione efficiente dell’intero iter di pianificazione dei cantieri stradali (dalla richiesta all’approvazione all’inserimento dei cantieri su mappa), una corretta comunicazione ai cittadini dei lavori programmati e la possibilità di navigare su una mappa interattiva della città, aggiornata in tempo reale, utile a visionare le aree o i quartieri impattati.

### Anteprima
Nella cartella screenshot del repository sono disponibili alcune immagini che mostrano l'applicativo.

## LICENSE
European Union Public License 1.2 (EUPL 1.2)
https://opensource.org/licenses/EUPL-1.2

## STATO DEL PROGETTO
Il prodotto è stabile e production ready.

## AMMINISTRAZIONE COMMITTENTE
### Comune di Bologna
Dipartimento Lavori Pubblici, Mobilità e Patrimonio Settore Mobilità Sostenibile e Infrastrutture

## STRUTTURA DEL REPOSITORY

### Asf.RoadWorks
* Asf.RoadWorks.API
* Asf.RoadWorks.BusinessLogic
* Asf.RoadWorks.DataAccessLayer
* Asf.RoadWorks.Functions

### Citizens

### Frontend


## PREREQUISITI E DIPENDENZE

### SmartTech.Net5.Infrastructure: 
##### Wrapper a componenti Microsoft, quali Redis Cache, ServiceBus e AzureStorage ed alle API di GoogleMaps
Nel dettaglio:
* SmartTech.Net5.Infrastructure
* SmartTech.Net5.Infrastructure.API
* SmartTech.Net5.Infrastructure.Cache.Redis
* SmartTech.Net5.Infrastructure.Configuration.AzureApp
* SmartTech.Net5.Infrastructure.DataAccessLayer.EFCore
* SmartTech.Net5.Infrastructure.Functions
* SmartTech.Net5.Infrastructure.GoogleMaps
* SmartTech.Net5.Infrastructure.Logging
* SmartTech.Net5.Infrastructure.ServiceBus
* SmartTech.Net5.Infrastructure.Storage.AzureStorage
* SmartTech.Net5.Infrastructure.Validations

### SmartTech.Net5.Common:
##### Sistema di security, libreria per la gestione delle esportazioni ed importazioni in farmo xlsx e wrapper servizi esposti dal SIT per interfacciamento a toponomastica cittadina

Nel dettaglio:
* SmartTech.Net5.Common
* SmartTech.Net5.Common.Web.Security

### @asf/ng11-mat-library:
* estensioni alla versione 11 di angular

## MANTENIMENTO DEL PROGETTO OPEN SOURCE
...

## SEGNALAZIONI
...