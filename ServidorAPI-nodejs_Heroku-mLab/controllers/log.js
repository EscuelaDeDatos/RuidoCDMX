var mongoose = require('mongoose');
var Log = mongoose.model('Log');

// configuración de tweet al rebasar cierto valor
var max_dec = 470,
  twett = "el ruido #ruidoCDMX rebasa los 53(dB). #Arduino #hagamosdata cc:@PhiRequiem";

// conector a al API de twitter
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'CONSUMERKEY',
  consumer_secret: 'CONSUMERSECRET',
  access_token_key: 'TOKENKEY',
  access_token_secret: 'TOKENSECRET'
});

//obtengo fecha y hora actual

function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Japan)
    // for your timezone just multiply +/-GMT by 36000000
    var datestr = new Date(time -18000000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}


//GET - Return all registers
exports.findAll = function(req, res) {
 Log.find(function(err, logs) {
 if(err) res.send(500, err.message);
 console.log('GET /logs')
 res.status(200).jsonp(logs);
 });
};

//GET - Return a register with specified ID
exports.findById = function(req, res) {
 Log.findById(req.params.id, function(err, log) {
 if(err) return res.send(500, err.message);
 console.log('GET /logs/' + req.params.id);
 res.status(200).jsonp(log);
 });
};

//GET - Insert a new register
exports.add = function(req, res) {
  //console.log('Insert');
  var log = new Log({
  	arduino_id: req.query.arduino_id,
	  valor: req.query.valor,
		datetime: getDateString()
  });


  // Para grafica en tiempo real usando plot.ly
  var plotly = require('plotly')('USERPLOTLY','TOKENPLOTLY');
  var archivo = "detectorruido-" + req.query.arduino_id;
  var data = [{x:[], y:[], stream:{token:'TOKENPLOTLY', maxpoints:500}}];
  var graphOptions = {fileopt : "extend", filename : archivo};
  var streamObject = JSON.stringify({ x : getDateString(), y : req.query.valor });
  plotly.plot(data,graphOptions,function() {
    var stream = plotly.stream('TOKENPLOTLY', function (res) {
      console.log(res);
    });
    stream.write(streamObject+'\n');
  });
  

  //enviar un twett al rebasar un valor
  if (req.query.valor >= max_dec) {
   client.post('statuses/update', {status: twett}, function(error, tweet, response) {
    if (!error) {
      console.log(tweet);
    }
  });
  }



  log.save(function(err, log) {
  if(err) return res.send(500, err.message);
  res.status(200).jsonp(log);
  //res.send("Dato Agregado");
  });
};