var request = require('request');


// request({
//   url: 'http://localhost:3000/create_pet',
//   method: 'POST',
//   headers: {img1: '/home/matheus/TCC/test/k2.jpeg'}
// }, function(error, response, body){
//   console.log("Image 1 Labels:\n");
//   console.log(body + "\n");
//   // var i;
//   // for (i=0;i<body.length;i++){
//   //   array = body[i].push(); 
//   // }
//   // console.log(array);
//   // console.log("Image 2 Labels:\n");
//   // console.log(body.image2);
// });

var http = require('http');
var google = require('googleapis');
var Vision = require('@google-cloud/vision');
var resemble = require('node-resemble-js');
var bodyParser = require('body-parser');

// Your Google Cloud Platform project ID
const projectId = 'pethug-168423';
const GOOGLE_APPLICATION_CREDENTIALS = './PetHug-6c850c98ee05.json';

http.createServer(function(request, response) {

  console.log("Servidor criado")

  google.auth.getApplicationDefault(function(err, authClient) {
    if (err) {
      return cb(err);
    }
    if (authClient.createScopedRequired &&
        authClient.createScopedRequired()) {
      authClient = authClient.createScoped(
          ['https://www.googleapis.com/auth/devstorage.read_write']);
    }

    var storage = google.storage('v1');
    storage.buckets.list({
      auth: authClient,
      project: projectId
    });
  });

  
  if (err) {
    throw err
  }
  console.log('Server started on port 3000')

  var headers = request.headers;
  var method = request.method;
  var url = request.url;
  var body = [];

  if (method === 'POST' && url === '/create_pet') {
    console.log ('Requisicao de analise recebida!!!!');
    console.log (headers.img1);

    var analysis1;
    var index = 0;
    // Instantiates a client
    const visionClient = Vision({
      projectId: projectId
    });

    // The name of the image file to annotate
    const fileName = headers.img1;

    // Performs label detection on the image file
    analysis1 = visionClient.detectLabels(fileName)
      .then((results) => {
        const labels = results[0];
        console.log('Analysing Image...!\n');
        labels.forEach((label) => 
          console.log(label))
        return(labels);
      })
      .catch((err) => {
        console.error('ERROR:', err);
      });

    Promise.all([analysis1]).then(function(data) {
      // all loaded
      console.log("Image Analysed!\n");
      var json = JSON.stringify({ 
      image1: data[0]
      });
      res.end(json);
      console.log("Response Sent!\n")
    }, function(err) {
      console.error('ERROR:', err);
      // one or more failed
    });
  }
}).listen(3000);