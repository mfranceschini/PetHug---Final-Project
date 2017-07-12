var resemble = require('node-resemble-js');
var express = require('express');
var app = express();

app.post('/pet', function (req, res) {
  console.log ('requisicao recebida');
  console.log (req.query.img1);
  console.log (req.query.img2);

  var diff = resemble(req.query.img1).compareTo(req.query.img2).ignoreAntialiasing().onComplete(function(data){
    console.log("Diferença entre as imagens: " + data.misMatchPercentage);
    res.end('Diferença entre as imagens: ' + data.misMatchPercentage);
  });
});

app.listen(3000, function (err) {
  if (err) {
    throw err
  }
  console.log('Server started on port 3000')
})