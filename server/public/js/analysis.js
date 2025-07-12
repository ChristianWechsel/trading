document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analysis-form');
    const analysisContainer = document.getElementById('analysis-container');


    if (form && analysisContainer) {
        try {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const symbol = form.querySelector('#stock-symbol').value.trim();
                const exchange = form.querySelector('#exchange').value.trim();
                const from = form.querySelector('#date-from').value;
                const to = form.querySelector('#date-to').value;
                if (symbol && exchange) {
                    const candlestickSeries = createChart(chartContainer);
                    const chartData = await loadChartData(symbol, exchange, from, to);
                    const transformedData = transformChartData(chartData);
                    candlestickSeries.setData(transformedData);
                    // chart.timeScale().fitContent();
                }
            });
        } catch (error) {
            console.error('Fehler beim Laden der Analyse-Daten:', error);
        }
    }
    // Set default dates
    const toInput = document.getElementById('to');
    const fromInput = document.getElementById('from');
    const today = new Date();
    toInput.valueAsDate = today;
    const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1));
    fromInput.valueAsDate = oneYearAgo;


    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const symbol = formData.get('symbol');
        const from = formData.get('from');
        const to = formData.get('to');
        const steps = formData.getAll('steps');

        const analysisQuery = {
            dataAggregation: {
                symbol: symbol.toUpperCase(),
                from: new Date(from).toISOString(),
                to: new Date(to).toISOString(),
                // Annahme: Intervall ist fix oder wird hier gesetzt
                interval: '1d',
            },
            steps: steps,
            stepOptions: {
                // Hier könnten optional Werte aus dem UI für die Optionen eingefügt werden
            },
        };

        resultsJson.textContent = 'Lade...';

        try {
            // Annahme: Der Endpunkt ist /api/analysis
            const response = await fetch('/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(analysisQuery),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP-Fehler! Status: ${response.status}, Meldung: ${errorText}`);
            }

            const data = await response.json();
            resultsJson.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            resultsJson.textContent = `Fehler bei der Analyse: ${error.message}`;
            console.error('Fehler:', error);
        }
    });
});

function createChart(chartContainer) {
    const chart = LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
    });

    return chart.addSeries(LightweightCharts.CandlestickSeries, {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
    });
}

async function loadChartData(symbol, exchange, from, to) {
    const postData = {
        ticker: {
            symbol,
            exchange,
        },
    };

    if (from || to) {
        postData.range = {}
    }
    if (from) {
        postData.range.from = from;
    }
    if (to) {
        postData.range.to = to;
    }

    const response = await fetch('/data-provider/candleSticks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Fehler beim Laden der Daten');
    return await response.json();
}

function transformChartData(chartData) {
    return chartData.map((item) => ({
        time: item.priceDate, // ISO-String oder 'YYYY-MM-DD'
        open: Number(item.openPrice),
        high: Number(item.highPrice),
        low: Number(item.lowPrice),
        close: Number(item.closePrice),
    }));
}