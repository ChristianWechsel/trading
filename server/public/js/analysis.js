document.addEventListener('DOMContentLoaded', async () => {
    const chartContainer = document.getElementById('chart-container');
    const form = document.getElementById('stock-form');

    if (chartContainer && form) {
        try {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
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
            console.error('Fehler beim Laden der EOD-Daten:', error);
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
