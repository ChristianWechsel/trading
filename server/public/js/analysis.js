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
                const swingPointDetectionAtrFactor = formData.get(
                    'swingPointDetectionAtrFactor',
                );
                const swingPointDetectionRelativeThreshold = formData.get(
                    'swingPointDetectionRelativeThreshold',
                );
                const trendDetectionAtrFactor = formData.get('trendDetectionAtrFactor');
                const trendDetectionRelativeThreshold = formData.get(
                    'trendDetectionRelativeThreshold',
                );
                const riskManagementAtrFactor = formData.get('riskManagementAtrFactor');

                if (symbol && exchange && steps.length > 0) {
                    const analysisData = await retrieveAnalysisData(
                        symbol,
                        exchange,
                        steps,
                        from,
                        to,
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
                    updateAccountBalances(analysisData);
                }
            });
        } catch (error) {
            console.error('Fehler beim Laden der Analyse-Daten:', error);
        }
    }
});

async function retrieveAnalysisData(
    // required
    symbol,
    exchange,
    steps,
    // optional
    from,
    to,
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
        stepOptions: {}
    };

    if (yValueSource) {
        postData.stepOptions.yValueSource = yValueSource;
    }

    // SwingPointDetection Optionen
    if (swingPointDetectionAtrFactor || swingPointDetectionRelativeThreshold) {
        postData.stepOptions.swingPointDetection = {};
        if (swingPointDetectionAtrFactor) {
            postData.stepOptions.swingPointDetection.atrFactor = parseFloat(
                swingPointDetectionAtrFactor,
            );
        }
        if (swingPointDetectionRelativeThreshold) {
            postData.stepOptions.swingPointDetection.relativeThreshold = parseFloat(
                swingPointDetectionRelativeThreshold,
            );
        }
    }

    // TrendDetection Optionen
    if (trendDetectionAtrFactor || trendDetectionRelativeThreshold) {
        postData.stepOptions.trendDetection = {};
        if (trendDetectionAtrFactor) {
            postData.stepOptions.trendDetection.atrFactor = parseFloat(
                trendDetectionAtrFactor,
            );
        }
        if (trendDetectionRelativeThreshold) {
            postData.stepOptions.trendDetection.relativeThreshold = parseFloat(
                trendDetectionRelativeThreshold,
            );
        }
    }

    // RiskManagement Optionen
    if (
        moneyManagement ||
        riskManagement ||
        initialCapital ||
        riskManagementAtrFactor
    ) {
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
                postData.trading.riskManagement.atrFactor = parseFloat(
                    riskManagementAtrFactor,
                );
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

function updateAccountBalances(analysisData) {
    // Anfangskontostand
    const initialBalance = analysisData.options.options.account.defaults.initialCapital;
    document.getElementById('initial-account-balance').textContent =
        `Anfangskontostand: ${Number(initialBalance).toFixed(2)}`;

    // Endkontostand
    const endBalance = analysisData.account.cash;
    document.getElementById('account-balance').textContent =
        `Endkontostand: ${Number(endBalance).toFixed(2)}`;
}
