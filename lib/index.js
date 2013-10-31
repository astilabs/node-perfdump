var fs = require('fs');
var stream = require('stream');
var async = require('async');
var nVoisus = require('voisus');

var api = {};
module.exports = api;

var inStream;
var outStream;

api.reader = function(host, scenario, ignore) {
  inStream = new stream();
  inStream.readable = true;
  _grabData(host, scenario, ignore);
  return inStream;
};

api.writer = function(outfile) {
  outStream = fs.createWriteStream(outfile);
  outStream.writable = true;
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
      // create the header
      var data = {
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
      inStream.emit('data', data);

      for(var i in result.items) {
        // check to see if we want to ignore tests
        if(ignore === 'true' && result.items[i].complete === false) {
          console.log('False: '+result.items[i].name);
          continue;
        }
        
        data.name = result.items[i].name;
        data.total_clients = result.items[i].summary.total_clients;
        data.server = result.items[i].server.ace_version;
        data.memory = result.items[i].server.memory;
        data.cpu_count = result.items[i].server.cpu_count;
        data.memory_used = result.items[i].loading.memory_used;
        data.memory_free = result.items[i].loading.memory_free;
        data.cpu0 = result.items[i].loading.cpu_percent[0];
        data.cpu1 = result.items[i].loading.cpu_percent[1];
        data.cpu2 = result.items[i].loading.cpu_percent[2];
        data.cpu3 = result.items[i].loading.cpu_percent[3];

        for(var j in result.items[i].cfi_programs) {
          if(result.items[i].cfi_programs[j].process === 'ace-operator') {
            data.ace_operator_overrun = result.items[i].cfi_programs[j].sas.overruns;
            data.ace_operator_underruns = result.items[i].cfi_programs[j].sas.underruns;
            data.ace_operator_frame_rate = result.items[i].cfi_programs[j].sas.frame_rate;
            data.ace_operator_avg_frame_rate = result.items[i].cfi_programs[j].rtexec.avg_frame_rate;
            data.ace_operator_max_time = result.items[i].cfi_programs[j].rtexec.max_time*1000;
            data.ace_operator_worst_time = result.items[i].cfi_programs[j].rtexec.worst_time*1000;
            data.ace_operator_avg_time = result.items[i].cfi_programs[j].rtexec.avg_time*1000;
          }
          if(result.items[i].cfi_programs[j].process === 'ace-radio') {
            data.ace_radio_overrun = result.items[i].cfi_programs[j].sas.overruns;
            data.ace_radio_underruns = result.items[i].cfi_programs[j].sas.underruns;
            data.ace_radio_frame_rate = result.items[i].cfi_programs[j].sas.frame_rate;
            data.ace_radio_avg_frame_rate = result.items[i].cfi_programs[j].rtexec.avg_frame_rate;
            data.ace_radio_max_time = result.items[i].cfi_programs[j].rtexec.max_time*1000;
            data.ace_radio_worst_time = result.items[i].cfi_programs[j].rtexec.worst_time*1000;
            data.ace_radio_avg_time = result.items[i].cfi_programs[j].rtexec.avg_time*1000;
          }
        }
        console.log('wrote: '+data.name);
        inStream.emit('data', data);
      }
      inStream.emit('end');
      cb(null);
    }
  ], function(err) {
    console.log('Complete');
  });
};
