function getById(id) {
    return document.getElementById(id)
}

function initConfigValues(){
    config.dataTable.index = 0;
    config.sma.indexes = [];
    config.sma.values = [];
    config.ema.indexes = [];
    config.ema.values = [];
    config.bbands.indexes = [];
    config.bbands.up = [];
    config.bbands.mid = [];
    config.bbands.down = [];
    config.ichimoku.indexes = [];
    config.ichimoku.tenkan = [];
    config.ichimoku.kijun = [];
    config.ichimoku.senkouA= [];
    config.ichimoku.senkouB= [];
    config.ichimoku.chikou = [];
    config.volume.index = [];
    config.rsi.indexes = [];
    config.macd.indexes = [];
    config.macd.periods = [];
    config.macd.values = [];
    config.hv.indexes = [];
    config.hv.periods = [];
    config.hv.values = [];
    config.events.indexes = [];
    config.events.values = [];
}

function drawChart(dataTable) {
    var chartDiv = chart_div;
    var charts = [];
    var dashboard = new google.visualization.Dashboard(chartDiv);
    var mainChart = new google.visualization.ChartWrapper({
        chartType: 'ComboChart',
        containerId: 'chart_div',
        options: {
            hAxis: {'slantedText': false},
            legend: {'position': 'none'},
            candlestick: {
                fallingColor: { strokeWidth: 0, fill: '#a52714' },
                risingColor: { strokeWidth: 0, fill: '#0f9d58' }
            },
            seriesType: 'candlesticks',
            series: {}
        },
        view: {
            columns: [
                {
                    calc: function(d, rowIndex) {
                        return d.getFormattedValue(rowIndex, 0);
                    },
                    type: 'string'

                }, 1, 2, 3, 4
            ]

        }

    });
    charts.push(mainChart);

    var options = mainChart.getOptions();
    var view = mainChart.getView();

    if (getById('inputSma').checked) {
        for (i = 0; i < config.sma.indexes.length; i++) {
            options.series[config.sma.indexes[i]] = {type: 'line'};
            view.columns.push(config.candlestick.numViews + config.sma.indexes[i]);
        }
    }

    if (getById('inputEma').checked) {
        for (i = 0; i < config.ema.indexes.length; i++) {
            options.series[config.ema.indexes[i]] = {type: 'line'};
            view.columns.push(config.candlestick.numViews + config.ema.indexes[i]);
        }
    }

    if (getById('inputBBands').checked) {
        for (i = 0; i < config.bbands.indexes.length; i++) {
            options.series[config.bbands.indexes[i]] = {
                type: 'line',
                color: 'blue',
                lineWidth: 1
            };
            view.columns.push(config.candlestick.numViews + config.bbands.indexes[i])
        }
    }

    if (getById('inputIchimoku').checked) {
        for (i = 0; i < config.ichimoku.indexes.length; i++) {
            options.series[config.ichimoku.indexes[i]] = {
                type: 'line',
                lineWidth: 1
            };
            view.columns.push(config.candlestick.numViews + config.ichimoku.indexes[i]);
        }
    }

    if (config.events.indexes.length > 0) {
        options.series[config.events.indexes[0]] = {
            'type': 'line',
            tooltip: 'none',
            enableInteractivity: false,
            lineWidth: 0
        };
        view.columns.push(config.candlestick.numViews + config.events.indexes[0]);
        view.columns.push(config.candlestick.numViews + config.events.indexes[1]);
    }

    if (getById('inputVolume').checked) {
        if (getById('volume_div') === null) {
            getById('technical_div').insertAdjacentHTML('beforebegin', "<div id='volume_div' class='bottom_chart'>" +
                    "<span class='technical_title'>Volume</span>" +
                    "<div id='volume_chart'></div>" +
                    "</div>");
        }
        var volumeChart = new google.visualization.ChartWrapper({
            'chartType': 'ColumnChart',
            'containerId': 'volume_chart',
            'options': {
                'hAxis': {'slantedText': false},
                'legend': {'position': 'none'},
                'series': {}
            },
            'view': {
                'columns': [ { 'type': 'string' }, 5]
            }
        });
        charts.push(volumeChart)
    }

    if (getById('inputRsi').checked) {
        if (getById('rsi_div') === null) {
            getById('technical_div').insertAdjacentHTML('beforebegin',
                    "<div id='rsi_div' class='bottom_chart'>" +
                    "<span class='technical_title'>RSI</span>" +
                    "<div id='rsi_chart'></div>" +
                    "</div>")
        }
        var up = config.candlestick.numViews + config.rsi.indexes['up'];
        var value = config.candlestick.numViews + config.rsi.indexes['value'];
        var down = config.candlestick.numViews + config.rsi.indexes['down'];
        var rsiChart = new google.visualization.ChartWrapper({
            'chartType': 'LineChart',
            'containerId': 'rsi_chart',
            'options': {
                'hAxis': {'slantedText': false},
                'legend': {'position': 'none'},
                'series': {
                    0: {color: 'black', lineWidth: 1},
                    1: {color: '#e2431e'},
                    2: {color: 'black', lineWidth: 1}
                }
            },
            'view': {
                'columns': [ { 'type': 'string' }, up, value, down]
            }
        });
        charts.push(rsiChart)
    }

    if (getById('inputMacd').checked) {
        if (config.macd.indexes.length == 0) { return }
        if (getById('macd_div')  === null) {
            getById('technical_div').insertAdjacentHTML('beforebegin',
                    "<div id='macd_div'>" +
                    "<span class='technical_title'>MACD</span>" +
                    "<div id='macd_chart'></div>" +
                    "</div>")
        }
        var macdColumns = [{'type': 'string'}];

        macdColumns.push(config.candlestick.numViews + config.macd.indexes[2]);
        macdColumns.push(config.candlestick.numViews + config.macd.indexes[0]);
        macdColumns.push(config.candlestick.numViews + config.macd.indexes[1]);
        var macdChart = new google.visualization.ChartWrapper({
            'chartType': 'ComboChart',
            'containerId': 'macd_chart',
            'options': {
                legend: {'position': 'none'},
                seriesType: 'bars',
                series: {
                    1: {type: 'line', lineWidth: 1},
                    2: {type: 'line', lineWidth: 1}
                }
            },
            'view': {
                'columns': macdColumns
            }
        });
        charts.push(macdChart)
    }

    if (getById('inputHv').checked) {
        if (config.hv.indexes.length == 0) { return }
        if (getById('hv_div') === null) {
            getById('technical_div').insertAdjacentHTML('beforebegin',
                    "<div id='hv_div'>" +
                    "<span class='technical_title'>Hv</span>" +
                    "<div id='hv_chart'></div>" +
                    "</div>")
        }
        var hvSeries = {};
        var hvColumns = [{'type': 'string'}];

        for (i = 0; i < config.hv.indexes.length; i++) {
            hvSeries[config.hv.indexes[i]] = {lineWidth: 1};
            hvColumns.push(config.candlestick.numViews + config.hv.indexes[i]);
        }
        var hvChart = new google.visualization.ChartWrapper({
            'chartType': 'LineChart',
            'containerId': 'hv_chart',
            'options': {
                'legend': {'position': 'none'},
                'series': hvSeries
            },
            'view': {
                'columns': hvColumns
            }
        });
        charts.push(hvChart)
    }

    var controlWrapper = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': 'filter_div',
        'options': {
            'filterColumnIndex': 0,
            'ui': {
                'chartType': 'LineChart',
                'chartView': {
                    'columns': [0, 4]
                }
            }
        }
    });

    dashboard.bind(controlWrapper, charts);
    dashboard.draw(dataTable);
}

function send() {
    var request = new XMLHttpRequest();
    var url = new URL(appUrl  + '/api/candle');

    if (getById('inputSma').checked) {
        url.searchParams.append('sma', true);
        url.searchParams.append('smaPeriod1', getById('inputSmaPeriod1').value);
        url.searchParams.append('smaPeriod2', getById('inputSmaPeriod2').value);
        url.searchParams.append('smaPeriod3', getById('inputSmaPeriod3').value);
    }
    if (getById('inputEma').checked) {
        url.searchParams.append('ema', true);
        url.searchParams.append('emaPeriod1', getById('inputEmaPeriod1').value);
        url.searchParams.append('emaPeriod2', getById('inputEmaPeriod2').value);
        url.searchParams.append('emaPeriod3', getById('inputEmaPeriod3').value);
    }
    if (getById('inputBBands').checked) {
        url.searchParams.append('bbands', true);
        url.searchParams.append('bbandsN', getById('inputBBandsN').value);
        url.searchParams.append('bbandsK', getById('inputBBandsK').value);
    }
    if (getById('inputIchimoku').checked) {
        url.searchParams.append('ichimoku', true);
    }
    if (getById('inputRsi').checked) {
        url.searchParams.append('rsi', true);
        url.searchParams.append('rsiPeriod', getById('inputRsiPeriod').value);
    }
    if (getById('inputMacd').checked) {
        url.searchParams.append('macd', true);
        url.searchParams.append('macdPeriod1', getById('inputMacdPeriod1').value);
        url.searchParams.append('macdPeriod2', getById('inputMacdPeriod2').value);
        url.searchParams.append('macdPeriod3', getById('inputMacdPeriod3').value);
    }
    if (getById('inputHv').checked) {
        url.searchParams.append('hv', true);
        url.searchParams.append('hvPeriod1', getById('inputHvPeriod1').value);
        url.searchParams.append('hvPeriod2', getById('inputHvPeriod2').value);
        url.searchParams.append('hvPeriod3', getById('inputHvPeriod3').value);
    }

    request.open('GET', url, true);

    request.onload = function (e) {
        if (request.status != 200) {
            console.log('failed to GET request')
        } else {
            // 取得成功
            var data = JSON.parse(request.response);
            initConfigValues();
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn('datetime', 'Date');
            dataTable.addColumn('number', 'Low');
            dataTable.addColumn('number', 'Open');
            dataTable.addColumn('number', 'Close');
            dataTable.addColumn('number', 'High');
            dataTable.addColumn('number', 'Volume');

            if (data.smas != undefined) {
                for (i = 0; i < data.smas.length; i++){
                    var smaData = data.smas[i];
                    if (smaData.length == 0){ continue; }
                    config.dataTable.index += 1;
                    config.sma.indexes[i] = config.dataTable.index;
                    dataTable.addColumn('number', 'SMA' + smaData.period.toString());
                    config.sma.values[i] = smaData.values
                }
            }

            if (data.emas != undefined) {
                for (i = 0; i < data.emas.length; i++){
                    var emaData = data.emas[i];
                    if (emaData.length == 0){ continue; }
                    config.dataTable.index += 1;
                    config.ema.indexes[i] = config.dataTable.index;
                    dataTable.addColumn('number', 'EMA' + emaData.period.toString());
                    config.ema.values[i] = emaData.values
                }
            }

            if (data.bbands != undefined) {
                var n = data.bbands.n;
                var k = data.bbands.k;
                var up = data.bbands.up;
                var mid = data.bbands.mid;
                var down = data.bbands.down;
                config.dataTable.index += 1;
                config.bbands.indexes[0] = config.dataTable.index;
                config.dataTable.index += 1;
                config.bbands.indexes[1] = config.dataTable.index;
                config.dataTable.index += 1;
                config.bbands.indexes[2] = config.dataTable.index;
                dataTable.addColumn('number', 'BBands Up(' + n + ',' + k + ')');
                dataTable.addColumn('number', 'BBands Mid(' + n + ',' + k + ')');
                dataTable.addColumn('number', 'BBands Down(' + n + ',' + k + ')');
                config.bbands.up = up;
                config.bbands.mid = mid;
                config.bbands.down = down;
            }

            if (data.ichimoku != undefined) {
                var tenkan = data.ichimoku.tenkan;
                var kijun = data.ichimoku.kijun;
                var senkouA = data.ichimoku.senkoua;
                var senkouB = data.ichimoku.senkoub;
                var chikou = data.ichimoku.chikou;

                config.dataTable.index += 1;
                config.ichimoku.indexes[0] = config.dataTable.index;
                config.dataTable.index += 1;
                config.ichimoku.indexes[1] = config.dataTable.index;
                config.dataTable.index += 1;
                config.ichimoku.indexes[2] = config.dataTable.index;
                config.dataTable.index += 1;
                config.ichimoku.indexes[3] = config.dataTable.index;
                config.dataTable.index += 1;
                config.ichimoku.indexes[4] = config.dataTable.index;

                config.ichimoku.tenkan = tenkan;
                config.ichimoku.kijun = kijun;
                config.ichimoku.senkouA = senkouA;
                config.ichimoku.senkouB = senkouB;
                config.ichimoku.chikou = chikou;

                dataTable.addColumn('number', 'Tenkan');
                dataTable.addColumn('number', 'Kijun');
                dataTable.addColumn('number', 'SenkouA');
                dataTable.addColumn('number', 'SenkouB');
                dataTable.addColumn('number', 'Chikou');
            }

            if (data.rsi != undefined ){
                config.dataTable.index += 1;
                config.rsi.indexes.up = config.dataTable.index;
                config.dataTable.index += 1;
                config.rsi.indexes.value = config.dataTable.index;
                config.dataTable.index += 1;
                config.rsi.indexes.down = config.dataTable.index;
                config.rsi.period = data.rsi.period;
                config.rsi.values = data.rsi.values;
                dataTable.addColumn('number', 'RSI Thread');
                dataTable.addColumn('number', 'RSI(' + config.rsi.period + ')');
                dataTable.addColumn('number', 'RSI Thread');
            }

            if (data.macd != undefined) {
                var macdData = data.macd;
                var fast_period = macdData.fast_period.toString();
                var slow_period = macdData.slow_period.toString();
                var signal_period = macdData.signal_period.toString();
                var macd = macdData.macd;
                var macd_signal = macdData.macd_signal;
                var macd_hist = macdData.macd_hist;

                config.dataTable.index += 1;
                config.macd.indexes[0] = config.dataTable.index;
                config.dataTable.index += 1;
                config.macd.indexes[1] = config.dataTable.index;
                config.dataTable.index += 1;
                config.macd.indexes[2] = config.dataTable.index;
                var speriods = '(' + fast_period + ',' + slow_period + ',' + signal_period +')';
                dataTable.addColumn('number', 'MD' + speriods);
                dataTable.addColumn('number', 'MS' + speriods);
                dataTable.addColumn('number', 'HT' + speriods);
                config.macd.values[0] = macd;
                config.macd.values[1] = macd_signal;
                config.macd.values[2] = macd_hist;
                config.macd.periods[0] = fast_period;
                config.macd.periods[1] = slow_period;
                config.macd.periods[2] = signal_period;
            }

            if (data.hvs != undefined) {
                for (i = 0; i < data.hvs.length; i++){
                    var hvData = data.hvs[i];
                    if (hvData.length == 0){ continue; }

                    var period = hvData.period.toString();
                    var value = hvData.values;

                    config.dataTable.index += 1;
                    config.hv.indexes[i] = config.dataTable.index;

                    dataTable.addColumn('number', 'HV(' + period + ')');
                    config.hv.values[i] = hvData.values;
                    config.hv.periods[i] = period;
                }
            }

            if (data.events != undefined) {
                config.dataTable.index += 1;
                config.events.indexes[0] = config.dataTable.index;
                config.dataTable.index += 1;
                config.events.indexes[1] = config.dataTable.index;

                config.events.values = data.events.signals;
                config.events.first = config.events.values.shift();

                dataTable.addColumn('number', 'Marker');
                dataTable.addColumn({type:'string', role:'annotation'});

                if (data.events.profit != undefined) {
                    profit = String(Math.round(data.events.profit * 100) / 100);
                } else {
                    profit = 0;
                }
                getById('profit').innerHTML = profit;
            }

            var googleChartData = [];
            var candles = data.candles;

            for(var i=0; i < candles.length; i++){
                var candle = candles[i];
                var date = new Date(candle.time);
                var datas = [date, candle.low, candle.open, candle.close, candle.high, candle.volume];

                if (data.smas != undefined) {
                    for (j = 0; j < config.sma.values.length; j++) {
                        if (config.sma.values[j][i] == 0) {
                            datas.push(null);
                        } else {
                            datas.push(config.sma.values[j][i]);
                        }
                    }
                }

                if (data.emas != undefined) {
                    for (j = 0; j < config.ema.values.length; j++) {
                        if (config.ema.values[j][i] == 0) {
                            datas.push(null);
                        } else {
                            datas.push(config.ema.values[j][i]);
                        }
                    }
                }

                if (data.bbands != undefined) {
                    if (config.bbands.up[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.bbands.up[i]);
                    }
                    if (config.bbands.mid[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.bbands.mid[i]);
                    }
                    if (config.bbands.down[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.bbands.down[i]);
                    }
                }

                if (data.ichimoku != undefined) {
                    if (config.ichimoku.tenkan[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.ichimoku.tenkan[i]);
                    }
                    if (config.ichimoku.kijun[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.ichimoku.kijun[i]);
                    }
                    if (config.ichimoku.senkouA[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.ichimoku.senkouA[i]);
                    }
                    if (config.ichimoku.senkouB[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.ichimoku.senkouB[i]);
                    }
                    if (config.ichimoku.chikou[i] == 0) {
                        datas.push(null);
                    } else {
                        datas.push(config.ichimoku.chikou[i]);
                    }
                }

                if (data.events != undefined) {
                    var event = config.events.first
                    if (event == undefined) {
                        datas.push(null);
                        datas.push(null);
                    }else if(event.time == candle.time) {
                        datas.push(candle.high + 1);
                        datas.push(event.side);
                        config.events.first = config.events.values.shift();
                    }else{
                        datas.push(null);
                        datas.push(null);
                    }
                }

                if (data.rsi != undefined){
                    datas.push(config.rsi.up);
                    if (config.rsi.values[i] == 0) {
                        datas.push(null);
                    }else{
                        datas.push(config.rsi.values[i]);
                    }
                    datas.push(config.rsi.down);
                }

                if (data.macd != undefined) {
                    for (j = 0; j < config.macd.values.length; j++) {
                        if (config.macd.values[j][i] == 0) {
                            datas.push(null);
                        } else {
                            datas.push(config.macd.values[j][i]);
                        }
                    }
                }

                if (data.hvs != undefined) {
                    for (j = 0; j < config.hv.values.length; j++) {
                        if (config.hv.values[j][i] == 0) {
                            datas.push(null);
                        } else {
                            datas.push(config.hv.values[j][i]);
                        }
                    }
                }

                googleChartData.push(datas)
            }

            dataTable.addRows(googleChartData);
            drawChart(dataTable);
        }
    };
    request.send(null)
}

setInterval('send()', 1000 * 60)
window.onload = function () {
    send();
    ids = [
        'inputSma', 'inputSmaPeriod1', 'inputSmaPeriod2',
        'inputSmaPeriod3', 'inputEma', 'inputEmaPeriod1', 
        'inputEmaPeriod2', 'inputEmaPeriod3', 'inputBBands', 'inputBBandsN', 'inputBBandsK', 'inputIchimoku'
    ];
    ids.forEach(id => {
        getById(id).addEventListener('change', (e) => {
            send();
        });
    });
    getById('inputVolume').addEventListener('change', (e) => {
        if (e.target.checked) {
            drawChart(config.dataTable.value);
        } else {
            getById('volume_div').remove();
        }
        send();
    });
    getById('inputRsi').addEventListener('change', (e) => {
        if (!e.target.checked) {
            getById('rsi_div').remove();
        }
        send();
    });
    getById('inputMacd').addEventListener('change', (e) => {
        if (!e.target.checked) {
            getById('macd_div').remove();
        }
        send();
    });
    getById('inputHv').addEventListener('change', (e) => {
        if (!e.target.checked) {
            getById('hv_div').remove();
        }
        send();
    });
}