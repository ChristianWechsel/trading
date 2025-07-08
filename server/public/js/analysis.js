document.addEventListener('DOMContentLoaded', async () => {
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
        const chart = LightweightCharts.createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: chartContainer.clientHeight,
        });

        // Example data

        const candlestickSeries = chart.addSeries(LightweightCharts.CandlestickSeries, {
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });

        // Feste Parameter für die API-Anfrage
        const postData = {
            ticker: {
                symbol: "MCD",
                exchange: "US"
            },
            range: {
                from: "2001-01-01",
                to: "2001-12-31"
            }
        };

        // Hole EOD-Daten vom Backend
        try {
            const response = await fetch('/data-provider/eod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });
            if (!response.ok) throw new Error('Fehler beim Laden der Daten');
            const eodPrices = await response.json();

            // Transformation: EODPrice[] -> LightweightCharts Candlestick-Format
            const chartData = eodPrices.map(item => ({
                time: item.priceDate, // ISO-String oder 'YYYY-MM-DD'
                open: Number(item.openPrice),
                high: Number(item.highPrice),
                low: Number(item.lowPrice),
                close: Number(item.closePrice)
            }));

            candlestickSeries.setData(chartData);
            chart.timeScale().fitContent();
        } catch (err) {
            console.error('Fehler beim Laden der EOD-Daten:', err);
        }
    }

});