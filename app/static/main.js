var app = angular.module('elecMonitor', []);

app.controller('ctrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $rootScope.latest = 0;
    $rootScope.spike = 0;
  }
]);

$.getJSON('/config.json', function(config) {
  console.log('pubnub initialised')
  var pubnub = PUBNUB.init({
    publish_key: config['publish_key'],
    subscribe_key: config['subscribe_key'],
    ssl: (('https:' == document.location.protocol) ? true : false)
  });

  var channel = config['channel'];
  var spike_channel = 'test'//config['spike_channel']

  pubnub.subscribe({
    channel: spike_channel,
    message: function(m) {
      update(m, spike_channel)
    },
    error: function(error) {
      // Handle error here
      console.log(JSON.stringify(error));
    }
  })

  eon.chart({
    pubnub: pubnub,
    history: true,
    channel: channel,
    flow: true,
    limit: 50,
    message: function(message, channel) {
      update(message, channel[2])
    },
    connect: flicker,
    generate: {
      bindto: '#chart',
      data: {
        x: 'x',
        labels: false,
        type: 'area',
        rate: 100,//config['updatePeriod']*1000,
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

});

function update(message, channel) {
  // get electricity reading and time stamp from message
  var stamp = message['columns'][0][1];
   // convert timestamp to
  var date = niceStamp(stamp);
  var sensorList = message['columns'].slice(1);
  console.log(sensorList)

  // is this the worst way to do this? wtf angular?
  var elem = angular.element(document.querySelector('[ng-app]'));
  var injector = elem.injector();
  var $rootScope = injector.get('$rootScope');

  $rootScope.$apply(function() {
    $rootScope.latestRecordings = message['columns'];
    $rootScope.sensorValues = sensorList;
    $rootScope.date = date;
  });
}

function flicker() {
  // makes lighting bolt yellow when connected to pubnub
  $('.glyphicon-tree').addClass('on');
}

function niceStamp(stamp) {
  // Create a date object with the current time
  var timestamp = new Date(stamp);

  // Create an array with the current month, day and time
  var date = [timestamp.getMonth() + 1, timestamp.getDate(), timestamp.getFullYear()];

  // Create an array with the current hour, minute and second
  var time = [timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds()];

  // Determine AM or PM suffix based on the hour
  var suffix = (time[0] < 12) ? "AM" : "PM";

  // Convert hour from military time
  time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

  // If hour is 0, set it to 12
  time[0] = time[0] || 12;

  // If seconds and minutes are less than 10, add a zero
  for (var i = 1; i < 3; i++) {
    if (time[i] < 10) {
      time[i] = "0" + time[i];
    }
  }

  // Return the formatted string
  return date.join("/") + " " + time.join(":") + " " + suffix;
}
