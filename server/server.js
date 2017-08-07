var google = require('googleapis');
var Vision = require('@google-cloud/vision');
var resemble = require('node-resemble-js');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var fs = require('fs');
var cors = require('cors')
var app = express();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

// Your Google Cloud Platform project ID
const projectId = 'pethug-168423';
const GOOGLE_APPLICATION_CREDENTIALS = './PetHug-6c850c98ee05.json';
const conString = process.env.DATABASE_URL || 'postgres://pethug:senha@localhost:5432/pethug';

app.post('/create_user', function (req, res) {
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'INSERT INTO public."Usuario"(nome, email, senha) VALUES ($1, $2, $3)',[userData.nome, userData.email, userData.senha],
      function(err, result) {
        if (err) {
          console.log("Deu erro")
          console.log(err);
        } else {
          console.log("User Created")
          var json = JSON.stringify({ 
            success: "sucesso"
          });
          res.end(json)
        }
      });
      query.on('end', () => { client.end(); });
  });
})

app.post('/get_user', function (req, res) {
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  var promise;
  console.log(userData.email)
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
      'SELECT * FROM public."Usuario"')// WHERE email=$1', userData.email);
    promise = query.on('row', function(row) {
        console.log("Recebeu usuários")
        result.push(row)
      });
    Promise.all([promise]).then(function(data) {
      var i, json;
      var found = false;
      for (i=0;i<result.length;i++){
        if (result[i].email == userData.email){
          if (result[i].senha == userData.senha){
            found = true
            json = JSON.stringify({ 
              status: 'sucesso',
              nome: result[i].nome,
              id: result[i].id
            });
            res.end(json);
            console.log("Response Sent!\n")
            break
          }
        }
      }
      if (!found){
        json = JSON.stringify({ 
          status: 'erro',
        });
        res.end(json);
        console.log("Error response Sent!\n")
      }
      query.on('end', () => { client.end(); });
    })
  });
})

//FUNCAO USADA PARA MONITORAMENTO DE ANIMAIS DESAPARECIDOS
app.get('/pet', function (req, res) { 

  console.log ('requisicao recebida');
  console.log (req.body.img1);
  console.log (req.body.img2);

  var analysis1;
  var analysis2;
  var index = 0;
  var result= []
  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId
  });

  // The name of the image file to annotate
  const fileName = req.body.img1;
  const fileName2 = req.body.img2;

  //Get all lost animals
  var client = new pg.Client(conString);
  console.log("Lista de Animais Perdidos")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");
    // console.log (client);

    const query = client.query(
    'SELECT * FROM public."Animal_Perdido"');
    promise = new Promise(function(resolve, reject) {
      query.on('row', function(row) {
        console.log("Recebeu os animais perdidos")
        result.push(row)
      });
      Promise.resolve(true)
    })
    Promise.all([promise]).then(function(data) {
      console.log("promise resolvida")
      var result2 = []
      query.on('end', () => { client.end(); });
      const query2 = client.query(
      'SELECT * FROM public."Animal" WHERE id=$1', result.animal_id);
      query2.on('row', function(row) {
        console.log("Recebeu os animais")
        result2.push(row)
        console.log(result2)
      });
    })
    
  })


  // Performs label detection on the image file
  // analysis1 = visionClient.detectLabels(fileName)
  //   .then((results) => {
  //     const labels = results[0];
  //     console.log('Image 1 analysed!\n');
  //     labels.forEach((label) => 
  //       console.log(label))
  //     return(labels);
  //   })
  //   .catch((err) => {
  //     console.error('ERROR:', err);
  //   });

  // analysis2 = visionClient.detectLabels(fileName2)
  //   .then((results) => {
  //     const labels = results[0];
  //     console.log('Image 2 analysed!\n');
  //     labels.forEach((label) => 
  //       console.log(label))
  //     return(labels);
  //   })
  //   .catch((err) => {
  //     console.error('ERROR:', err);
  //     return(err);
  //   });

  // Promise.all([analysis1, analysis2]).then(function(data) {
  //   // all loaded
  //   console.log("All Images Analysed!\n");
  //   var json = JSON.stringify({ 
  //   image1: data[0], 
  //   image2: data[1]
  //   });
  //   res.end(json);
  //   console.log("Response Sent!\n")
  // }, function(err) {
  //   console.error('ERROR:', err);
  //   // one or more failed
  // });

    // var diff = resemble(req.query.img1).compareTo(req.query.img2).ignoreAntialiasing().onComplete(function(data){
    //   console.log("Diferença entre as imagens: " + data.misMatchPercentage);
    //   res.end('Diferença entre as imagens: ' + data.misMatchPercentage);
    // });

  });


// FUNCAO USADA DURANTE O CADASTRO DE UM NOVO ANIMAL
// UTILIZADA PARA SUGERIR ESPÉCIE E RAÇA DO ANIMAL
app.post('/create_pet', function (req, res) {

  console.log ('Requisicao de analise recebida!');
  // console.log (req);

  var analysis1;
  var index = 0;
  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId
  });

  // The name of the image file to annotate
  if (req.body.img1) {
    var fileName = req.body.img1;

    function decodeBase64Image(dataString) {
      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }

      response.type = matches[1];
      response.data = new Buffer(matches[2], 'base64');

      return response;
    }

    var imageBuffer = decodeBase64Image(fileName);
    var random = Math.random() * (9999 - 1000) + 1000
    random = random.toPrecision(4)
    const imagePath = 'images/animal' + random + '.png'

    createFile = (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
          if(err){
            throw(err);
          }
          else{
            Promise.resolve()
          }
      }))

    Promise.all([createFile]).then(function(data) {
      // all loaded
      visionClient.detectLabels(imagePath)
      .then((results) => {
        const labels = results[0];
        console.log('Analysing Image...!\n');
        labels.forEach((label) =>
          console.log(label));
        console.log("Image Analysed!\n");
        var json = JSON.stringify({ 
        image1: labels
        });
        res.end(json);
        console.log("Response Sent!\n")
        require('fs').unlinkSync(imagePath)
        console.log("Image Deleted: " + imagePath)
      })
      .catch((err) => {
        console.error('ERROR:', err);
        res.end('erro')
      });
    }, function(err) {
      console.error('ERROR:', err);
      // one or more failed
    });
  }
  else if (req.body.form){
    var form = req.body.form
    console.log("Salvando Animal no BD")
    var client = new pg.Client(conString);
    var result = [];
    client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");

      if (form.image){
        function decodeBase64Image(dataString) {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

          if (matches.length !== 3) {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }
        var imageBuffer = decodeBase64Image(form.image);
        var random = Math.random() * (9999 - 1000) + 1000
        random = random.toPrecision(4)
        const imagePath = 'images/db/animal' + random + '.png'

        promise = new Promise(function(resolve, reject) {
          (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
            if(err){
              console.log("Erro ao criar imagem")
              console.log(err);
            }
          }))
        })
      // }

      // Promise.all([promise]).then(function(data) {
        console.log("Dentro promise - depois de criar imagem")
        console.log(imagePath)
        const path = 'home/matheus/TCC/server/' + imagePath
        const query = client.query(
        'INSERT INTO public."Animal"(nome, sexo, idade, descricao, peso, status_id, especie_id, raca_id, porte_id, imagem, responsavel_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',[form.name, form.gender, form.age, form.about, form.weight, form.status, form.species, form.breed, form.size, path, form.user],
          function(err, result) {
            if (err) {
              console.log("Deu erro")
              console.log(err);
            } else {
              console.log("Animal Inserted")
              var json = JSON.stringify({ 
                success: "sucesso"
              });
              res.end(json)
            }
          });
        query.on('end', () => { client.end(); });
      // })
    }
    })
  }
});

// FUNCAO PARA LISTAR TODOS OS ANIMAIS CADASTRADOS
app.get('/pet_list', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Lista de Animais")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");
    console.log (client);

    const query = client.query(
    'SELECT * FROM public."Animal"');
    animalPromise = query.on('row', function(row) {
      console.log("Recebeu os animais")
      result.push(row)
    });

    Promise.all([animalPromise]).then(function(data) {
      console.log("Todos os animais retornados")
      var json = JSON.stringify({ 
        animals: result
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

// FUNCAO PARA CARREGAR DADOS DE CADASTRO (ESPECIE, RAÇA, ETC)
app.get('/animal_data', function (req, res) {
  resultSpecies = []
  resultBreeds = []
  resultSizes = []
  resultStatus = []
  var client = new pg.Client(conString);
  console.log("Dados dos Animais")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'SELECT * FROM public."Especie"');
    promiseSpecies = query.on('row', function(row) {
      resultSpecies.push(row)
    });

    const query2 = client.query(
    'SELECT * FROM public."Raca"');
    promiseBreeds = query2.on('row', function(row) {
      resultBreeds.push(row)
    });

    const query3 = client.query(
    'SELECT * FROM public."Porte"');
    promiseSize = query3.on('row', function(row) {
      resultSizes.push(row)
    });
    
    const query4 = client.query(
    'SELECT * FROM public."Status"');
    promiseStatus = query4.on('row', function(row) {
      resultStatus.push(row)
    });
    Promise.all([promiseSpecies, promiseBreeds, promiseSize, promiseStatus]).then(function(data) {
      console.log("Todas as consultas realizadas")
      var json = JSON.stringify({ 
        species: resultSpecies,
        breeds: resultBreeds,
        size: resultSizes,
        status: resultStatus,
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})


app.listen(3000, function (err) {

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
})
