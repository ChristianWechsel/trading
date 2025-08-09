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
                const yValueSource = formData.get('yValueSource');
                const moneyManagement = formData.get('moneyManagement');
                const riskManagement = formData.get('riskManagement');
                const initialCapital = formData.get('initialCapital');
                const swingPointDetectionAtrFactor = formData.get('swingPointDetectionAtrFactor');
                const swingPointDetectionRelativeThreshold = formData.get('swingPointDetectionRelativeThreshold');
                const trendDetectionAtrFactor = formData.get('trendDetectionAtrFactor');
                const trendDetectionRelativeThreshold = formData.get('trendDetectionRelativeThreshold');
                const riskManagementAtrFactor = formData.get('riskManagementAtrFactor');

                if (symbol && exchange && steps.length > 0) {
                    const chartData = await loadChartData(
                        symbol,
                        exchange,
                        from,
                        to,
                        steps,
                        yValueSource,
                        moneyManagement,
                        riskManagement,
                        initialCapital,
                        swingPointDetectionAtrFactor,
                        swingPointDetectionRelativeThreshold,
                        trendDetectionAtrFactor,
                        trendDetectionRelativeThreshold,
                        riskManagementAtrFactor,
                    );

                    // Clear previous result
                    while (analysisContainer.firstChild) {
                        analysisContainer.removeChild(analysisContainer.firstChild);
                    }

                    // Create result structure
                    const resultDiv = document.createElement('div');
                    resultDiv.className = 'analysis-result';

                    const heading = document.createElement('h2');
                    heading.textContent = 'Analyse Ergebnis';
                    resultDiv.appendChild(heading);

                    // Account
                    const accountDiv = document.createElement('div');
                    accountDiv.className = 'account-result';
                    const accountHeading = document.createElement('h3');
                    accountHeading.textContent = 'Account';
                    accountDiv.appendChild(accountHeading);
                    const accountCapital = document.createElement('p');
                    accountCapital.textContent = `Initialkapital: ${chartData.account?.initialCapital ?? '-'}`;
                    accountDiv.appendChild(accountCapital);
                    resultDiv.appendChild(accountDiv);

                    // Portfolio
                    const portfolioDiv = document.createElement('div');
                    portfolioDiv.className = 'portfolio-result';
                    const portfolioHeading = document.createElement('h3');
                    portfolioHeading.textContent = 'Portfolio';
                    portfolioDiv.appendChild(portfolioHeading);
                    const portfolioValue = document.createElement('p');
                    portfolioValue.textContent = `Wert: ${chartData.portfolio?.value ?? '-'}`;
                    portfolioDiv.appendChild(portfolioValue);
                    resultDiv.appendChild(portfolioDiv);

                    analysisContainer.appendChild(resultDiv);
                }
            });
        } catch (error) {
            console.error('Fehler beim Laden der Analyse-Daten:', error);
        }
    }
});

async function loadChartData(
    symbol,
    exchange,
    from,
    to,
    steps,
    yValueSource,
    moneyManagement,
    riskManagement,
    initialCapital,
    swingPointDetectionAtrFactor,
    swingPointDetectionRelativeThreshold,
    trendDetectionAtrFactor,
    trendDetectionRelativeThreshold,
    riskManagementAtrFactor,
) {
    const postData = {
        dataAggregation: {
            ticker: {
                symbol,
                exchange,
            },
        },
        steps,
        stepOptions: {
            yValueSource,
        },
    };

    // SwingPointDetection Optionen
    if (swingPointDetectionAtrFactor || swingPointDetectionRelativeThreshold) {
        postData.stepOptions.swingPointDetection = {};
        if (swingPointDetectionAtrFactor) {
            postData.stepOptions.swingPointDetection.atrFactor = parseFloat(swingPointDetectionAtrFactor);
        }
        if (swingPointDetectionRelativeThreshold) {
            postData.stepOptions.swingPointDetection.relativeThreshold = parseFloat(swingPointDetectionRelativeThreshold);
        }
    }

    // TrendDetection Optionen
    if (trendDetectionAtrFactor || trendDetectionRelativeThreshold) {
        postData.stepOptions.trendDetection = {};
        if (trendDetectionAtrFactor) {
            postData.stepOptions.trendDetection.atrFactor = parseFloat(trendDetectionAtrFactor);
        }
        if (trendDetectionRelativeThreshold) {
            postData.stepOptions.trendDetection.relativeThreshold = parseFloat(trendDetectionRelativeThreshold);
        }
    }

    // RiskManagement Optionen
    if (moneyManagement || riskManagement || initialCapital || riskManagementAtrFactor) {
        if (!postData.trading) postData.trading = {};
        if (moneyManagement) {
            postData.trading.moneyManagement = { moneyManagement };
        }
        if (riskManagement || riskManagementAtrFactor) {
            postData.trading.riskManagement = {};
            if (riskManagement) {
                postData.trading.riskManagement.riskManagement = riskManagement;
            }
            if (riskManagementAtrFactor) {
                postData.trading.riskManagement.atrFactor = parseFloat(riskManagementAtrFactor);
            }
        }
        if (initialCapital) {
            postData.trading.account = { initialCapital: parseFloat(initialCapital) };
        }
    }

    if (from || to) {
        postData.dataAggregation.range = {};
    }
    if (from) {
        postData.dataAggregation.range.from = from;
    }
    if (to) {
        postData.dataAggregation.range.to = to;
    }

    const response = await fetch('/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    if (!response.ok) throw new Error('Fehler beim Laden der Daten');
    return await response.json();
}
return `${year}-${month}-${day}`;
            },
        },
    });
}

function getChartData(enrichedDataPoints) {
    return enrichedDataPoints.map((enrichedDataPoint) => {
        return {
            time: enrichedDataPoint.dataPoint.x / 1000,
            value: parseFloat(enrichedDataPoint.dataPoint.y),
        };
    });
}

function getTrendChannelData(data) {
    const { enrichedDataPoints, trends } = data;

    const lines = trends.reduce((total, trend) => {
        const trendLineDataPoints = [];
        const returnLineDataPoints = [];
        const start = enrichedDataPoints.findIndex(
            (enrichedDataPoint) => enrichedDataPoint.dataPoint.x === trend.startPoint.x,
        );
        const end = enrichedDataPoints.findIndex(
            (enrichedDataPoint) => enrichedDataPoint.dataPoint.x === trend.endPoint.x,
        );
        const { trendLine, returnLine } = trend.channel;
        if (start > -1 && end > -1) {
            for (let i = start; i <= end; i++) {
                trendLineDataPoints.push(
                    calcTrendLineDataPoint(
                        enrichedDataPoints[i].dataPoint.x,
                        trendLine.slope,
                        trendLine.yIntercept,
                    ),
                );
                returnLineDataPoints.push(
                    calcTrendLineDataPoint(
                        enrichedDataPoints[i].dataPoint.x,
                        returnLine.slope,
                        returnLine.yIntercept,
                    ),
                );
            }
        }
        total.push(trendLineDataPoints);
        total.push(returnLineDataPoints);
        return total;
    }, []);

    return lines;
}

function calcTrendLineDataPoint(x, slope, yIntercept) {
    return { x, y: slope * x + yIntercept };
}

function addLineSeries(chart, dataPoints) {
    const series = chart.addSeries(LightweightCharts.LineSeries, {
        color: '#2962FF',
    });
    series.setData(dataPoints);
}
