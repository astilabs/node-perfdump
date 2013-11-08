var async = require('async');
var should = require('should');
var progressBar = require('progress');
var csv = require('csv');
var nVoisus = require('voisus');
var perfdump = require('../lib');

// global vars
var server = {
  host: "IPAddress"
};
var client = {
  host_1: "IPAddress",
  host_2: "IPAddress"
};

describe('Voisus server automated tests: ', function () {

  it('should run and automated performance test from a template with 10 clients', function(done) {
    var scn, ssn, radios, clients;
    var test_time = 30;
    var test_name = 'automated_test_1';
    var hapi = nVoisus.createHapi(server.host);
    async.waterfall([
      function(cb) {
        hapi.getTemplates(cb);
      },
      function(result, cb) {
        var template;
        for(var i in result) {
          if(result[i] === 'Basic_Example') {
            template = result[i];
          }
        }
        hapi.createScenarioFromTemplate(test_name, template, cb);
      },
      function(result, cb) {
        scn = result;
        hapi.runScenario(scn.scnId, cb);
      },
      function(result, cb) {
        hapi.getRunningSession(cb);
      },
      function(result, cb) {
        ssn = result.session_id;
        scn.getNets(cb);
      },
      function(result, cb) {
        radios = {
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Coordination') {
            radios.netId = result[i].id;
          }
        }
        scn.getRoles(cb);
      },
      function(result, cb) {
        clients = [];
        var c = {
          total_clients: 10,
          client_host: client.host_1,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Role_Ex1') {
            c.roleId = result[i].id;
          }
        }
        clients.push(c);

        var test = {
          session: ssn,
          name: test_name,
          duration: test_time,
          test_server: server.host
        };

        var perf = _createPerformanceTest(test, radios, clients);
        scn.runPerformanceTest(perf, cb);
      },
      function(result, cb) {
        var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', { total: test_time });
        var timer = setInterval(function() {
          scn.getPerformanceTestReports(function(err, result) {
            for(var i in result.items) {
              if(result.items[i].progress > 0) {
                bar.update(result.items[i].progress);
                if(bar.complete) {
                  clearInterval(timer);
                  cb(null);
                }
              }
            }
          });
        }, 1000);
      },
      function(cb) {
        var data = perfdump.reader(server.host, scn.scnId, false);
        var out = perfdump.writer(process.env.HOME+'/'+test_name+'.csv');
        data.pipe(csv()
          .on('end', function(count) {
            cb(null);
            //hapi.deleteScenario(scn.scnId, cb);
          })
          .on('error', function(error) {
            console.log(error.message);
            cb(error);
          }))
        .pipe(out);
      }
    ], function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should run and automated performance test from a template with 20 clients', function(done) {
    var scn, ssn, radios, clients;
    var test_time = 30;
    var test_name = 'automated_test_2';
    var hapi = nVoisus.createHapi(server.host);
    async.waterfall([
      function(cb) {
        hapi.getTemplates(cb);
      },
      function(result, cb) {
        var template;
        for(var i in result) {
          if(result[i] === 'Basic_Example') {
            template = result[i];
          }
        }
        hapi.createScenarioFromTemplate(test_name, template, cb);
      },
      function(result, cb) {
        scn = result;
        hapi.runScenario(scn.scnId, cb);
      },
      function(result, cb) {
        hapi.getRunningSession(cb);
      },
      function(result, cb) {
        ssn = result.session_id;
        scn.getNets(cb);
      },
      function(result, cb) {
        radios = {
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Coordination') {
            radios.netId = result[i].id;
          }
        }
        scn.getRoles(cb);
      },
      function(result, cb) {
        clients = [];
        var c = {
          total_clients: 20,
          client_host: client.host_1,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Role_Ex1') {
            c.roleId = result[i].id;
          }
        }
        clients.push(c);

        var test = {
          session: ssn,
          name: test_name,
          duration: test_time,
          test_server: server.host
        };

        var perf = _createPerformanceTest(test, radios, clients);
        scn.runPerformanceTest(perf, cb);
      },
      function(result, cb) {
        var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', { total: test_time });
        var timer = setInterval(function() {
          scn.getPerformanceTestReports(function(err, result) {
            for(var i in result.items) {
              if(result.items[i].progress > 0) {
                bar.update(result.items[i].progress);
                if(bar.complete) {
                  clearInterval(timer);
                  cb(null);
                }
              }
            }
          });
        }, 1000);
      },
      function(cb) {
        var data = perfdump.reader(server.host, scn.scnId, false);
        var out = perfdump.writer(process.env.HOME+'/'+test_name+'.csv');
        data.pipe(csv()
          .on('end', function(count) {
            cb(null);
            //hapi.deleteScenario(scn.scnId, cb);
          })
          .on('error', function(error) {
            console.log(error.message);
            cb(error);
          }))
        .pipe(out);
      }
    ], function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should run and automated performance test from a template with 30 clients', function(done) {
    var scn, ssn, radios, clients;
    var test_time = 30;
    var test_name = 'automated_test_3';
    var hapi = nVoisus.createHapi(server.host);
    async.waterfall([
      function(cb) {
        hapi.getTemplates(cb);
      },
      function(result, cb) {
        var template;
        for(var i in result) {
          if(result[i] === 'Basic_Example') {
            template = result[i];
          }
        }
        hapi.createScenarioFromTemplate(test_name, template, cb);
      },
      function(result, cb) {
        scn = result;
        hapi.runScenario(scn.scnId, cb);
      },
      function(result, cb) {
        hapi.getRunningSession(cb);
      },
      function(result, cb) {
        ssn = result.session_id;
        scn.getNets(cb);
      },
      function(result, cb) {
        radios = {
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Coordination') {
            radios.netId = result[i].id;
          }
        }
        scn.getRoles(cb);
      },
      function(result, cb) {
        clients = [];
        var c = {
          total_clients: 30,
          client_host: client.host_1,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Role_Ex1') {
            c.roleId = result[i].id;
          }
        }
        clients.push(c);

        var test = {
          session: ssn,
          name: test_name,
          duration: test_time,
          test_server: server.host
        };

        var perf = _createPerformanceTest(test, radios, clients);
        scn.runPerformanceTest(perf, cb);
      },
      function(result, cb) {
        var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', { total: test_time });
        var timer = setInterval(function() {
          scn.getPerformanceTestReports(function(err, result) {
            for(var i in result.items) {
              if(result.items[i].progress > 0) {
                bar.update(result.items[i].progress);
                if(bar.complete) {
                  clearInterval(timer);
                  cb(null);
                }
              }
            }
          });
        }, 1000);
      },
      function(cb) {
        var data = perfdump.reader(server.host, scn.scnId, false);
        var out = perfdump.writer(process.env.HOME+'/'+test_name+'.csv');
        data.pipe(csv()
          .on('end', function(count) {
            cb(null);
            //hapi.deleteScenario(scn.scnId, cb);
          })
          .on('error', function(error) {
            console.log(error.message);
            cb(error);
          }))
        .pipe(out);
      }
    ], function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should run and automated performance test from a template with 40 clients', function(done) {
    var scn, ssn, radios, clients;
    var test_time = 30;
    var test_name = 'automated_test_4';
    var hapi = nVoisus.createHapi(server.host);
    async.waterfall([
      function(cb) {
        hapi.getTemplates(cb);
      },
      function(result, cb) {
        var template;
        for(var i in result) {
          if(result[i] === 'Basic_Example') {
            template = result[i];
          }
        }
        hapi.createScenarioFromTemplate(test_name, template, cb);
      },
      function(result, cb) {
        scn = result;
        hapi.runScenario(scn.scnId, cb);
      },
      function(result, cb) {
        hapi.getRunningSession(cb);
      },
      function(result, cb) {
        ssn = result.session_id;
        scn.getNets(cb);
      },
      function(result, cb) {
        radios = {
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Coordination') {
            radios.netId = result[i].id;
          }
        }
        scn.getRoles(cb);
      },
      function(result, cb) {
        clients = [];
        var c = {
          total_clients: 40,
          client_host: client.host_1,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Role_Ex1') {
            c.roleId = result[i].id;
          }
        }
        clients.push(c);

        var test = {
          session: ssn,
          name: test_name,
          duration: test_time,
          test_server: server.host
        };

        var perf = _createPerformanceTest(test, radios, clients);
        scn.runPerformanceTest(perf, cb);
      },
      function(result, cb) {
        var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', { total: test_time });
        var timer = setInterval(function() {
          scn.getPerformanceTestReports(function(err, result) {
            for(var i in result.items) {
              if(result.items[i].progress > 0) {
                bar.update(result.items[i].progress);
                if(bar.complete) {
                  clearInterval(timer);
                  cb(null);
                }
              }
            }
          });
        }, 1000);
      },
      function(cb) {
        var data = perfdump.reader(server.host, scn.scnId, false);
        var out = perfdump.writer(process.env.HOME+'/'+test_name+'.csv');
        data.pipe(csv()
          .on('end', function(count) {
            cb(null);
            //hapi.deleteScenario(scn.scnId, cb);
          })
          .on('error', function(error) {
            console.log(error.message);
            cb(error);
          }))
        .pipe(out);
      }
    ], function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should run and automated performance test from a template with 50 clients', function(done) {
    var scn, ssn, radios, clients;
    var test_time = 30;
    var test_name = 'automated_test_5';
    var hapi = nVoisus.createHapi(server.host);
    async.waterfall([
      function(cb) {
        hapi.getTemplates(cb);
      },
      function(result, cb) {
        var template;
        for(var i in result) {
          if(result[i] === 'Basic_Example') {
            template = result[i];
          }
        }
        hapi.createScenarioFromTemplate(test_name, template, cb);
      },
      function(result, cb) {
        scn = result;
        hapi.runScenario(scn.scnId, cb);
      },
      function(result, cb) {
        hapi.getRunningSession(cb);
      },
      function(result, cb) {
        ssn = result.session_id;
        scn.getNets(cb);
      },
      function(result, cb) {
        radios = {
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Coordination') {
            radios.netId = result[i].id;
          }
        }
        scn.getRoles(cb);
      },
      function(result, cb) {
        clients = [];
        var c = {
          total_clients: 50,
          client_host: client.host_1,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Role_Ex1') {
            c.roleId = result[i].id;
          }
        }
        clients.push(c);

        var test = {
          session: ssn,
          name: test_name,
          duration: test_time,
          test_server: server.host
        };

        var perf = _createPerformanceTest(test, radios, clients);
        scn.runPerformanceTest(perf, cb);
      },
      function(result, cb) {
        var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', { total: test_time });
        var timer = setInterval(function() {
          scn.getPerformanceTestReports(function(err, result) {
            for(var i in result.items) {
              if(result.items[i].progress > 0) {
                bar.update(result.items[i].progress);
                if(bar.complete) {
                  clearInterval(timer);
                  cb(null);
                }
              }
            }
          });
        }, 1000);
      },
      function(cb) {
        var data = perfdump.reader(server.host, scn.scnId, false);
        var out = perfdump.writer(process.env.HOME+'/'+test_name+'.csv');
        data.pipe(csv()
          .on('end', function(count) {
            cb(null);
            //hapi.deleteScenario(scn.scnId, cb);
          })
          .on('error', function(error) {
            console.log(error.message);
            cb(error);
          }))
        .pipe(out);
      }
    ], function(err) {
      should.not.exist(err);
      done();
    });
  });

  it('should run and automated performance test from a template with 60 clients with two client hosts', function(done) {
    var scn, ssn, radios, clients;
    var test_time = 30;
    var test_name = 'automated_test_6';
    var hapi = nVoisus.createHapi(server.host);
    async.waterfall([
      function(cb) {
        hapi.getTemplates(cb);
      },
      function(result, cb) {
        var template;
        for(var i in result) {
          if(result[i] === 'Basic_Example') {
            template = result[i];
          }
        }
        hapi.createScenarioFromTemplate(test_name, template, cb);
      },
      function(result, cb) {
        scn = result;
        hapi.runScenario(scn.scnId, cb);
      },
      function(result, cb) {
        hapi.getRunningSession(cb);
      },
      function(result, cb) {
        ssn = result.session_id;
        scn.getNets(cb);
      },
      function(result, cb) {
        radios = {
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Coordination') {
            radios.netId = result[i].id;
          }
        }
        scn.getRoles(cb);
      },
      function(result, cb) {
        clients = [];
        var c1 = {
          total_clients: 30,
          client_host: client.host_1,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        var c2 = {
          total_clients: 30,
          client_host: client.host_2,
          test_rx: true,
          randomize: false,
          host: server.host,
          scnId: scn.scnId
        };
        for(var i in result) {
          if(result[i].name === 'Role_Ex1') {
            c1.roleId = result[i].id;
            c2.roleId = result[i].id;
          }
        }
        clients.push(c1);
        clients.push(c2);

        var test = {
          session: ssn,
          name: test_name,
          duration: test_time,
          test_server: server.host
        };

        var perf = _createPerformanceTest(test, radios, clients);
        scn.runPerformanceTest(perf, cb);
      },
      function(result, cb) {
        var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', { total: test_time });
        var timer = setInterval(function() {
          scn.getPerformanceTestReports(function(err, result) {
            for(var i in result.items) {
              if(result.items[i].progress > 0) {
                bar.update(result.items[i].progress);
                if(bar.complete) {
                  clearInterval(timer);
                  cb(null);
                }
              }
            }
          });
        }, 1000);
      },
      function(cb) {
        var data = perfdump.reader(server.host, scn.scnId, false);
        var out = perfdump.writer(process.env.HOME+'/'+test_name+'.csv');
        data.pipe(csv()
          .on('end', function(count) {
            cb(null);
            //hapi.deleteScenario(scn.scnId, cb);
          })
          .on('error', function(error) {
            console.log(error.message);
            cb(error);
          }))
        .pipe(out);
      }
    ], function(err) {
      should.not.exist(err);
      done();
    });
  });

});

/*  test object
 *
 *  session:      running session id (session_id)
 *  name:         name of the performance test
 *  duration:     duration of the test
 *  test_server:  ip of the server running the test
 *  server:       ip of the server the cients will connect to
*/

var _createPerformanceTest = function(test, radios, clients) {
  // create the json used to run the performance test
  var obj = {
    description: "automated test",
    radios: _createRadios(radios),
    clients: _createClients(clients),
    predelay: 10.0,
    session: test.session,
    kill_all_remote: true,
    duration: test.duration,
    test_server: test.test_server,
    server: test.server || test.test_server,
    randomize: {
      tx_select: true,
      interval: 1.0,
      rx_select: true,
      connection: false,
      role: false,
      net: true,
      ptt: true,
      world_position: true
    },
    id: "performance_test",
    name: test.name
  };

  return obj;
};

/*  clients object
 *
 *  total_clients:  number of total clients
 *  test_rx:        test receive audio
 *  host:           ip of the server
 *  client_host:    ip of the client 
 *  scnId:          scenario id
 *  roleId:         role id
 *  randomize:      randomize client
*/

var _createClients = function(clients) {
  var obj = [];

  for(var i in clients) {
    for(var j = 0; j < clients[i].total_clients; j++) {
      var client = {
        test_tx: false,
        tone: false,
        test_rx: clients[i].test_rx || true,
        host: clients[i].client_host,
        role: 'https://'+clients[i].host+'/api/scenarios/'+clients[i].scnId+'/roles/'+clients[i].roleId+'/',
        randomize: clients[i].randomize || false
      };
      obj.push(client);
    }
  }

  return obj;
};

/*  radios object
 *
 *  host:   ip of the server
 *  scnId:  scenario id
 *  netId:  net id
*/

var _createRadios = function(radios) {
  var obj = [];

  var radio = {
    sound: null,
    net: 'https://'+radios.host+'/api/scenarios/'+radios.scnId+'/nets/'+radios.netId+'/',
    tone_gain: 1.0,
    tone_freq: 140.6,
    test_rx: false
  };

  obj.push(radio);

  return obj;
};
