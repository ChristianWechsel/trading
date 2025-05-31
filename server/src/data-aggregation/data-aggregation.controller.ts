import { Controller, Post } from '@nestjs/common';
import { DataAggregationService } from './data-aggregation.service';

@Controller('data-aggregation')
export class DataAggregationController {
  constructor(
    private readonly dataAggregationService: DataAggregationService,
  ) {}

  @Post('import')
  async importData() {
    // Als Parameter kann {SYMBOL_NAME}.{EXCHANGE_ID}übergeben werden,
    // Beispiel:  AAPL.US, TSLA.US, VTI.US, AMZN.US, BTC-USD.CC and EURUSD.FOREX
    // MCD.US consists of two parts: {SYMBOL_NAME}.{EXCHANGE_ID}, then you can use, for example,
    // MCD.MX for Mexican Stock Exchange. or MCD.US for NYSE.
    // Check the list of supported exchanges to get more information about the stock markets we do support.
    // https://eodhd.com/financial-apis/list-supported-exchanges?_gl=1*gfv7dq*_gcl_aw*R0NMLjE3NDg3MTc5MDAuQ2owS0NRancwZXJCQmhEVEFSSXNBS084aXFTZ3NINjhHaVgyQ1duZGYwU3hBNFpoSnlzV1JQUDZNVE5tM2xETW1BOXpvUndycHA3ZlBsZ2FBdlp4RUFMd193Y0I.*_gcl_au*NTk4NDQ3ODM3LjE3NDg3MTY2MTYuMTIxOTA3NjYxMC4xNzQ4NzE4MjU5LjE3NDg3MTgyNzA.*FPAU*NTk4NDQ3ODM3LjE3NDg3MTY2MTY.*_ga*MTE5MjQ4MjgwMy4xNzQ4NzE2NjE2*_ga_NRYML8NKGH*czE3NDg3MjE1ODAkbzIkZzEkdDE3NDg3MjIwNTUkajU2JGwwJGgyMjQyNDYyMzk.*_fplc*eU12SHVPZVpncUpqeSUyRnQ4SG5DSzVub2c0c0NpTUxKc3QxWERhbjZzWm9LY3B0ajJ0dU9GSnU4d1dNdGlMVE5sbExjdTE1JTJCSm5rQkRnUFhJTlJKdk9MbGRWZTh0a0hwMDgwR3pycWJWRmdiNE9HUkpmbHZLYk5UWGVtUlJtdyUzRCUzRA..

    // Wird Daten angefordert, dann sind diese in die Datenbank zu importieren.
    // Es gilt zu beachten, dass die Abfrage mehrmals aufgerufen wird, dann sind entweder alle bisehrigen Daten zu löschen
    // und durch die neuen Daten zu ersetzen oder die neuen Daten sind zu den bisherigen Daten hinzuzufügen.
    // In diesem Fall ist es besser, die neuen Daten zu den bisherigen Daten hinzuzufügen.

    // Die Tabellenstruktur muss entwicklet werden: Vielleicht iste eine Aufteilung nach Börse, Firma,
    // Datensatz sinnvoll.
    // Datentabellen partitionieren, z.B. nach Jahr, um die Performance zu verbessern.

    // Upsert, um bestehende Daten bei Aktualiserung zu ersetzen oder hinzuzufügen.
    // INSERT IGNORE INTO EODPrices (SecurityID, PriceDate, OpenPrice, HighPrice, LowPrice, ClosePrice, AdjustedClosePrice, Volume)
    // VALUES
    // (1, '2025-06-01', 315.00, 316.50, 314.00, 315.75, 315.75, 2800000),
    // (1, '2025-05-30', 312.00, 315.28, 310.58, 313.85, 313.85, 4056587); -- Dieser wird ignoriert, wenn er bereits existiert

    // Darstellung der Daten mit
    //   https://tradingview.github.io/lightweight-charts/

    return await this.dataAggregationService.importAndSaveData();
  }
}
