$.getJSON('/config.json', function(config) {
  console.log('pubnub initialised')
  var pubnub = PUBNUB.init({
    publish_key: config['publish_key'],
    subscribe_key: config['subscribe_key'],
    ssl: (('https:' == document.location.protocol) ? true : false)
  });

  var channel = config['channel'];
  var channelList = ['lux-channel', 'temp-channel', 'noise-channel']
  var chartsList = ['#lux-chart', '#temp-chart', '#noise-chart']
  for (x in chartsList) {
    eon.chart({
      pubnub: pubnub,
      history: false,
      channel: channelList[x],
      flow: true,
      limit: 100,
      connect: flicker,
      generate: {
        bindto: chartsList[x],
        data: {
          x: 'x',
          labels: false,
          type: 'area',
          rate: 10000, //config['updatePeriod']*1000,
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%H:%M:%S'
            }
          },
        }
      }
    });
  }
});

function flicker() {
  // makes lighting bolt yellow when connected to pubnub
  $('.glyphicon-tree').addClass('on');
}
