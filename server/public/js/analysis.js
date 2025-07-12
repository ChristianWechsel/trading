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
                    const chartData = await loadChartData(
                        symbol,
                        exchange,
                        from,
                        to,
                        steps,
                    );
                    const chart = createChart(analysisContainer);
                    chart.timeScale().fitContent();
                    addLineSeries(chart, getLineSeriesData(chartData));
                }
            });
        } catch (error) {
            console.error('Fehler beim Laden der Analyse-Daten:', error);
        }
    }
});

async function loadChartData(symbol, exchange, from, to, steps) {
    const postData = {
        dataAggregation: {
            ticker: {
                symbol,
                exchange,
            },
        },
        steps,
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

    const response = await fetch('/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Fehler beim Laden der Daten');
    return await response.json();
}

function createChart(chartContainer) {
    return LightweightCharts.createChart(chartContainer, {
        width: chartContainer.clientWidth,
        height: chartContainer.clientHeight,
        timeScale: {
            tickMarkFormatter: (time) => {
                // time ist der UNIX-Timestamp in Sekunden
                const date = new Date(time * 1000);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            },
        },
    });
}

function getLineSeriesData(data) {
    return data.enrichedDataPoints.map((enrichedDataPoint) => {
        return {
            time: enrichedDataPoint.dataPoint.x / 1000,
            value: parseFloat(enrichedDataPoint.dataPoint.y),
        };
    });
}

function addLineSeries(chart, dataPoints) {
    const series = chart.addSeries(LightweightCharts.LineSeries, {
        color: '#2962FF',
    });
    series.setData(dataPoints);
}
