document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analysis-form');
    const analysisContainer = document.getElementById('analysis-container');

    if (form && analysisContainer) {
        try {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                const symbol = formData.get('stock').trim();
                const exchange = formData.get('exchange').trim();
                const from = formData.get('from');
                const to = formData.get('to');
                const steps = formData.getAll('steps');

                if (symbol && exchange && steps.length > 0) {
                    //     const candlestickSeries = createChart(chartContainer);
                    //     const chartData = await loadChartData(symbol, exchange, from, to);
                    //     const transformedData = transformChartData(chartData);
                    //     candlestickSeries.setData(transformedData);
                    //     // chart.timeScale().fitContent();
                }
            });
        } catch (error) {
            console.error('Fehler beim Laden der Analyse-Daten:', error);
        }
    }
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

async function loadChartData(symbol, exchange, from, to, steps) {
    const postData = {
        ticker: {
            symbol,
            exchange,
        },
    };

    if (from || to) {
        postData.range = {};
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
