var fs = require('fs');
var stream = require('stream');
var async = require('async');
var nVoisus = require('voisus');

var api = {};
module.exports = api;

var inStream = {};
var outStream = {};

var serverInStream;
var serverOutStream;

var clientInStream;
var clientOutStream;

api.reader = function(host, scenario, ignore) {
  serverInStream = new stream();
  serverInStream.readable = true;

  clientInStream = new stream();
  clientInStream.readable = true;

  inStream.server = serverInStream;
  inStream.client = clientInStream;

  _grabData(host, scenario, ignore);
  return inStream;
};

api.writer = function(outfile) {
  var d = new Date();
  var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();

  serverOutStream = fs.createWriteStream(outfile+'-Server-'+timestamp+'.csv');
  serverOutStream.writable = true;

  clientOutStream = fs.createWriteStream(outfile+'-Client-'+timestamp+'.csv');
  clientOutStream.writable = true;

  outStream.server = serverOutStream;
  outStream.client = clientOutStream;

  return outStream;
};

_grabData = function(host, scenario, ignore) {
  console.log('Connecting to: %s on scenario: %s', host, scenario);
  var hapi = nVoisus.createHapi(host);
  async.waterfall([
    function(cb) {
      hapi.getScenarios(cb);
    },
    function(result, cb) {
      for(var i in result) {
        if(result[i].id === scenario) {
          scn = result[i].id;
        }
      }
      hapi.createScenarioFromId(scn, cb);
    },
    function(result, cb) {
      scn = result;
      scn.getPerformanceTestReports(cb);
    },
    function(result, cb) {
      // create the server header
      var serverData = {
        name: "Test Name",
        total_clients: "Total Clients",
        server: "Server Version",
        memory: "Memory",
        cpu_count: "CPU Count",
        memory_used: "Memory Used",
        memory_free: "Memory Free",
        cpu0: "CPU0 %",
        cpu1: "CPU1 %",
        cpu2: "CPU2 %",
        cpu3: "CPU3 %",
        clientGlitches: 'Client Glitches',
        ace_operator_overrun: "Ace-operator Overruns",
        ace_operator_underruns: "Ace-operator Underruns",
        ace_operator_frame_rate: "Ace-operator Frame Rate",
        ace_operator_avg_frame_rate: "Ace-operator Average Frame Rate",
        ace_operator_max_time: "Ace-operator Max Time",
        ace_operator_worst_time: "Ace-operator Worst Time",
        ace_operator_avg_time: "Ace-operator Average Time",
        ace_radio_overrun: "Ace-Radio Overruns",
        ace_radio_underruns: "Ace-Radio Underruns",
        ace_radio_frame_rate: "Ace-Radio Frame Rate",
        ace_radio_avg_frame_rate: "Ace-Radio Average Frame Rate",
        ace_radio_max_time: "Ace-Radio Max Time",
        ace_radio_worst_time: "Ace-Radio Worst Time",
        ace_radio_avg_time: "Ace-Radio Average Time"
      };
      serverInStream.emit('data', serverData);

      // create the client header
      var clientData = {
        test_name: "Test Name",
        host: "Host",
        test_tx: "Test TX",
        test_rx: "Test RX",
        tone: "Tone",
        randomize: "Randomize",
        rms: "RMS",
        samples: "Samples",
        total_samples: "Total Samples",
        freq: "Freq",
        Peak: "Peak",
        overruns: "Overruns",
        underruns: "Underruns",
        glitches: "Glitches",
        role: "Role Url"
      };
      clientInStream.emit('data', clientData);

      for(var i in result.items) {
        // check to see if we want to ignore tests
        if(ignore === 'true' && result.items[i].complete === false) {
          console.log('ignored: '+result.items[i].name);
          continue;
        }
        
        serverData.name = result.items[i].name;
        serverData.total_clients = result.items[i].summary.total_clients;
        serverData.server = result.items[i].server.ace_version;
        serverData.memory = result.items[i].server.memory;
        serverData.cpu_count = result.items[i].server.cpu_count;
        serverData.memory_used = result.items[i].loading.memory_used;
        serverData.memory_free = result.items[i].loading.memory_free;
        serverData.cpu0 = result.items[i].loading.cpu_percent[0];
        serverData.cpu1 = result.items[i].loading.cpu_percent[1];
        serverData.cpu2 = result.items[i].loading.cpu_percent[2];
        serverData.cpu3 = result.items[i].loading.cpu_percent[3];

        for(var j in result.items[i].cfi_programs) {
          if(result.items[i].cfi_programs[j].process === 'ace-operator') {
            serverData.ace_operator_overrun = result.items[i].cfi_programs[j].sas.overruns;
            serverData.ace_operator_underruns = result.items[i].cfi_programs[j].sas.underruns;
            serverData.ace_operator_frame_rate = result.items[i].cfi_programs[j].sas.frame_rate;
            serverData.ace_operator_avg_frame_rate = result.items[i].cfi_programs[j].rtexec.avg_frame_rate;
            serverData.ace_operator_max_time = result.items[i].cfi_programs[j].rtexec.max_time*1000;
            serverData.ace_operator_worst_time = result.items[i].cfi_programs[j].rtexec.worst_time*1000;
            serverData.ace_operator_avg_time = result.items[i].cfi_programs[j].rtexec.avg_time*1000;
          }
          if(result.items[i].cfi_programs[j].process === 'ace-radio') {
            serverData.ace_radio_overrun = result.items[i].cfi_programs[j].sas.overruns;
            serverData.ace_radio_underruns = result.items[i].cfi_programs[j].sas.underruns;
            serverData.ace_radio_frame_rate = result.items[i].cfi_programs[j].sas.frame_rate;
            serverData.ace_radio_avg_frame_rate = result.items[i].cfi_programs[j].rtexec.avg_frame_rate;
            serverData.ace_radio_max_time = result.items[i].cfi_programs[j].rtexec.max_time*1000;
            serverData.ace_radio_worst_time = result.items[i].cfi_programs[j].rtexec.worst_time*1000;
            serverData.ace_radio_avg_time = result.items[i].cfi_programs[j].rtexec.avg_time*1000;
          }
        }
        
        serverData.clientGlitches = 0;
        for(var k in result.items[i].clients) {
          clientData.test_name = serverData.name
          clientData.host = result.items[i].clients[k].host;
          clientData.test_tx = result.items[i].clients[k].test_tx.toString();
          clientData.test_rx = result.items[i].clients[k].test_rx.toString();
          clientData.tone = result.items[i].clients[k].tone.toString();
          clientData.randomize = result.items[i].clients[k].randomize.toString();
          clientData.rms = result.items[i].clients[k].audio_left.rms;
          clientData.samples = result.items[i].clients[k].audio_left.samples;
          clientData.total_samples = result.items[i].clients[k].audio_left.total_samples;
          if (result.items[i].clients[k].audio_left.peaks.length) {
            clientData.freq = result.items[i].clients[k].audio_left.peaks[0].freq;
            clientData.Peak = result.items[i].clients[k].audio_left.peaks[0].value;
          }
          clientData.overruns = result.items[i].clients[k].audio_left.overruns;
          clientData.underruns = result.items[i].clients[k].audio_left.underruns;
          clientData.glitches = result.items[i].clients[k].audio_left.glitches;
          serverData.clientGlitches += clientData.glitches
          clientData.role = result.items[i].clients[k].role;
          
          clientInStream.emit('data', clientData);
        }
        console.log('wrote: '+serverData.name);
        serverInStream.emit('data', serverData);
      }
      serverInStream.emit('end');
      clientInStream.emit('end');
      cb(null);
    }
  ], function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log('Complete');
    }
  });
};
