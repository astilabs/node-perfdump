var async = require('async');
var should = require('should');
var progressBar = require('progress');
var csv = require('csv');
var nVoisus = require('voisus');
var perfdump = require('../lib');

// if not using load balancer, use the host ip for loadBalancer
var server = {
  host: "IPAddress",
  loadBalancer: "IPAddress"
};
var client = {
  host_1: "IPAddress",
  host_2: "IPAddress",
  host_3: "IPAddress",
  host_4: "IPAddress",
  host_5: "IPAddress"
};

// if this is set, all test will default to this value
var test_duration = 300;
var test_delay;
var lb_wait = 20000; // wait time to make up for cloud servers

describe('Voisus server automated tests: ', function () {
  it('should run and automated performance test from a template with 10 clients', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_1 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 10,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });

  it('should run and automated performance test from a template with 20 clients', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_2 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 20,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });

  it('should run and automated performance test from a template with 30 clients', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_3 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 30,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });

  it('should run and automated performance test from a template with 40 clients', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_4 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 40,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });

  it('should run and automated performance test from a template with 50 clients', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_5 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 50,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });

  it.skip('should run and automated performance test from a template with 60 clients with two client hosts', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_6 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 30,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      },
      {
        total_clients: 30,
        client_host: client.host_2,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });

  it.skip('should run and automated performance test from a template with 200 clients with 5 client hosts', function(done) {
    var d = new Date();
    var timestamp = d.getHours()+'.'+d.getMinutes()+'.'+d.getSeconds();
    var test = {
      name: 'automated_test_7 - '+timestamp,
      duration: test_duration || 30,
      preDelay: test_delay || 10,
      template: 'Basic_Example',
      net: 'Coordination',
      role: 'Role_Ex1'
    };
    var radios = {
      host: server.host,
      freq: 140.6
    };
    var clients = [
      {
        total_clients: 40,
        client_host: client.host_1,
        test_rx: true,
        randomize: false,
        host: server.host
      },
      {
        total_clients: 40,
        client_host: client.host_2,
        test_rx: true,
        randomize: false,
        host: server.host
      },
      {
        total_clients: 40,
        client_host: client.host_3,
        test_rx: true,
        randomize: false,
        host: server.host
      },
      {
        total_clients: 40,
        client_host: client.host_4,
        test_rx: true,
        randomize: false,
        host: server.host
      },
      {
        total_clients: 40,
        client_host: client.host_5,
        test_rx: true,
        randomize: false,
        host: server.host
      }
    ];
    createTemplateTest(test, radios, clients, function(err) {
      done();
    });
  });
});

var createTemplateTest = function(test, radios, clients, callback) {
  var scn, ssn;
  var hapi = nVoisus.createHapi(server.host);
  async.waterfall([
    function(cb) {
      hapi.getTemplates(cb);
    },
    function(result, cb) {
      var template;
      for(var i in result) {
        if(result[i] === test.template) {
          template = result[i];
        }
      }
      hapi.createScenarioFromTemplate(test.name, template, cb);
    },
    function(result, cb) {
      scn = result;
      var dObj = {
        "eth": 'eth2'
      };
      setTimeout(function() {
        scn.putDis(dObj, cb);
      }, lb_wait || 0);
    },
    function(result, cb) {
      setTimeout(function() {
        hapi.runScenario(scn.scnId, cb);
      }, lb_wait || 0);
    },
    function(result, cb) {
      hapi.getRunningSession(cb);
    },
    function(result, cb) {
      ssn = result.session_id;
      scn.getNets(cb);
    },
    function(result, cb) {
      radios.scnId = scn.scnId;
      for(var i in result) {
        if(result[i].name === test.net) {
          radios.netId = result[i].id;
        }
      }
      scn.getRoles(cb);
    },
    function(result, cb) {
      for(var i in clients) {
        clients[i].scnId = scn.scnId;
      }
      for(var j in result) {
        if(result[j].name === test.role) {
          for(var k in clients) {
            clients[k].roleId = result[j].id;
          }
        }
      }

      var config = {
        session: ssn,
        name: test.name,
        duration: test.duration,
        preDelay: test.preDelay,
        test_server: server.host,
        server: server.loadBalancer
      };

      var perf = _createPerformanceTest(config, radios, clients);
      scn.runPerformanceTest(perf, cb);
    },
    function(result, cb) {
      var bar = new progressBar('[:bar] :percent  elapsed: :elapsed', {
        total: test.duration,
        width: 50
      });
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
      }, 2500);
    },
    function(cb) {
      var data = perfdump.reader(server.host, scn.scnId, false);
      var out = perfdump.writer(process.env.HOME+'/'+test.name+'.csv');
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
    callback();
  });
};

/*  test object
 *
 *  session:      running session id (session_id)
 *  name:         name of the performance test
 *  duration:     duration of the test
 *  test_server:  ip of the server running the test
 *  server:       ip of the server the cients will connect to
 *  preDelay:     time to wait before test begins
*/

var _createPerformanceTest = function(test, radios, clients) {
  // create the json used to run the performance test
  var obj = {
    description: "automated test",
    radios: _createRadios(radios),
    clients: _createClients(clients),
    predelay: test.preDelay,
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
    tone_freq: radios.freq || 140.6,
    test_rx: false
  };

  obj.push(radio);

  return obj;
};
