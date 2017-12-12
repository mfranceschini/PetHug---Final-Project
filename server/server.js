var google = require('googleapis');
var Vision = require('@google-cloud/vision');
var resemble = require('node-resemble-js');
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var pg = require('pg');
var fs = require('fs');
var cors = require('cors')
var app = express();
var OneSignal = require('onesignal-node');

var serverClient;

require('dotenv').config()

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

// Your Google Cloud Platform project ID
const projectId = 'pethug-168423';
const GOOGLE_APPLICATION_CREDENTIALS = './PetHug-6c850c98ee05.json';
const conString = process.env.DATABASE_URL || 'postgres://pethug:senha@localhost:5432/pethug';

app.post('/set_device', function (req, res) {
  console.log("Função Setar Dispositivo")
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  console.log(userData)
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'INSERT INTO public."Usuario_dispositivo"(usuario_id, dispositivo) VALUES ($1, $2)',[userData.usuario_id, userData.dispositivo],
      function(err, result) {
        if (err) {
          if (err.code == '23505') {
            console.log("Já existe cadastrado!!!")
            const query = client.query(
              'UPDATE public."Usuario_dispositivo" SET dispositivo=($1) WHERE usuario_id=($2)',[userData.dispositivo, userData.usuario_id],
                function(err, result) {
                  if (err){
                    console.log("Erro ao atualizar dispositivo!")
                    console.log(Err)
                  }
                  else {
                    console.log("\n\nDispositivo Atualizado!!\n\n")
                    var myClient = new OneSignal.Client({
                      userAuthKey: "'" + userData.usuario_id + "'",
                      // note that "app" must have "appAuthKey" and "appId" keys
                      app: { appAuthKey: 'YWJkMTZlMGItYzM1Ni00NjZiLWFiYmQtMmM0MmQ2MWI5ZDI2', appId: '682f1efd-6ede-46bd-b6dc-102ecf7fac50' }
                    });
                    var json = JSON.stringify({ 
                      success: "success"
                    });
                    res.end(json)
                  }
                })
          }
          else {
            console.log("Deu erro")
            console.log(err);
            var json = JSON.stringify({ 
              success: "error"
            });
            res.end(json)
          }
        } else {
          console.log("\n\nDispositivo adicionado!!\n\n")
          var myClient = new OneSignal.Client({
            userAuthKey: "'" + userData.usuario_id + "'",
            // note that "app" must have "appAuthKey" and "appId" keys
            app: { appAuthKey: 'YWJkMTZlMGItYzM1Ni00NjZiLWFiYmQtMmM0MmQ2MWI5ZDI2', appId: '682f1efd-6ede-46bd-b6dc-102ecf7fac50' }
          });
          var json = JSON.stringify({ 
            success: "success"
          });
          res.end(json)
        }
        query.on('end', () => { client.end(); });                  
      });
  });  
})

app.post('/create_user', function (req, res) {
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'INSERT INTO public."Usuario"(nome, email, senha, tipo) VALUES ($1, $2, $3, $4)',[userData.nome, userData.email, userData.senha, userData.tipo],
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

app.post('/verify_facebook', function (req, res) {
  console.log("Dentro Funcao Verificar Facebook")
  var client = new pg.Client(conString);
  var result = []
  var result_id = []
  var userData = req.body
  console.log(userData)
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'SELECT * FROM public."Social" WHERE facebook_id=($1)',[userData.facebook_id],
      function(err, result) {
        if (err) {
          console.log("Erro Verify Facebook")
          console.log(err);
          query.on('end', () => { client.end(); });          
        } else {
          if (result.rowCount == 1){
            result_id = result.rows[0].id
            console.log("Facebook User Exist!")
            const query2 = client.query(
              'SELECT * FROM public."Usuario" WHERE id=($1)',[result_id],
            function(err, resp){
              if (err) {
                console.log("Erro Get User Data")
                console.log(err);
              } else {
                if (resp.rowCount == 1){
                  console.log("User has Link With Facebook!")
                  var json = JSON.stringify({ 
                    success: "existe",
                    id: result_id,
                    nome: resp.rows[0].nome,
                    email: resp.rows[0].email,
                    tipo: resp.rows[0].tipo
                  });
                  res.end(json)
                }
              }
            })
            query2.on('end', () => { client.end(); });
          }
          else if (result.rowCount == 0){
            console.log("Facebook User DONT Exist!")
            var json = JSON.stringify({ 
              success: "nao_existe"
            });
            res.end(json)
            query.on('end', () => { client.end(); });            
          }
        }
      });      
  });
})

app.post('/create_facebook_user', function (req, res) {
  console.log("Funcao Criar Usuario Facebook")
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'INSERT INTO public."Usuario"(nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id',[userData.nome, userData.email, userData.senha, userData.tipo],
      function(err, result) {
        if (err) {
          console.log("Deu erro")
          console.log(err);
          query.on('end', () => { client.end(); });          
        } else {
          const query2 = client.query(
            'INSERT INTO public."Social"(id, facebook_id, instagram_id) VALUES ($1, $2, $3)',[result.rows[0].id, userData.facebook_id, userData.instagram_id],
              function(err, result2) {
                if (err){
                  console.log("Erro ao inserir em Social")
                  console.log(err)
                }
                else {
                  console.log(result2)
                  let json = JSON.stringify({ 
                    status: 'sucesso'
                  });
                  res.end(json);
                  console.log("Facebook User Created!")
                  
                }
              })
          query2.on('end', () => { client.end(); });
        }
      });
  });
})

app.post('/verify_instagram', function (req, res) {
  console.log("Dentro Funcao Verificar Instagram")
  var client = new pg.Client(conString);
  var result = []
  var result_id = []
  var userData = req.body
  console.log(userData.instagram_id)
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'SELECT * FROM public."Social" WHERE instagram_id=($1)',[userData.instagram_id],
      function(err, result) {
        if (err) {
          console.log("Erro Verify Instagram")
          console.log(err);
          query.on('end', () => { client.end(); });          
        } else {
          if (result.rowCount == 1){
            result_id = result.rows[0].id
            console.log("Instagram User Exist!")
            const query2 = client.query(
              'SELECT * FROM public."Usuario" WHERE id=($1)',[result_id],
            function(err, resp){
              if (err) {
                console.log("Erro Get User Data")
                console.log(err);
              } else {
                if (resp.rowCount == 1){
                  console.log("User has Link With Instagram!")
                  var json = JSON.stringify({ 
                    success: "existe",
                    id: result_id,
                    nome: resp.rows[0].nome,
                    email: resp.rows[0].email,
                    tipo: resp.rows[0].tipo
                  });
                  res.end(json)
                }
              }
            })
            query2.on('end', () => { client.end(); });
          }
          else if (result.rowCount == 0){
            console.log("Instagram User DONT Exist!")
            var json = JSON.stringify({ 
              success: "nao_existe"
            });
            res.end(json)
            query.on('end', () => { client.end(); });            
          }
        }
      });      
  });
})

app.post('/create_instagram_user', function (req, res) {
  console.log("Funcao Criar Usuario Instagram")
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
    'INSERT INTO public."Usuario"(nome, email, senha, tipo) VALUES ($1, $2, $3, $4) RETURNING id',[userData.nome, userData.email, userData.senha, userData.tipo],
      function(err, result) {
        if (err) {
          console.log("Deu erro")
          console.log(err);
          query.on('end', () => { client.end(); });          
        } else {
          const query2 = client.query(
            'INSERT INTO public."Social"(id, facebook_id, instagram_id) VALUES ($1, $2, $3)',[result.rows[0].id, userData.facebook_id, userData.instagram_id],
              function(err, result2) {
                if (err){
                  console.log("Erro ao inserir em Social")
                  console.log(err)
                }
                else {
                  console.log(result2)
                  let json = JSON.stringify({ 
                    status: 'sucesso'
                  });
                  res.end(json);
                  console.log("Instagram User Created!")
                }
              })
          query2.on('end', () => { client.end(); });
        }
      });
  });
})

app.post('/get_user', function (req, res) {
  console.log("Dentro get_user")
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  var promise;
  client.connect(function (err) {
      if (err) throw err;
      console.log ("Conexão Estabelecida!");
    const query = client.query(
      'SELECT * FROM public."Usuario"')// WHERE email=$1', userData.email);
    promise = query.on('row', function(row) {
        result.push(row)
      });
    Promise.all([promise]).then(function(data) {
      console.log("Recebeu usuários")
      var i, json;
      var found = false;
      for (i=0;i<result.length;i++){
        if (result[i].email == userData.email){
          if (result[i].senha == userData.senha){
            found = true
            json = JSON.stringify({ 
              status: 'sucesso',
              email: result[i].email,
              nome: result[i].nome,
              id: result[i].id,
              tipo: result[i].tipo
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

app.post('/get_user_data', function (req, res) {
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  var promise;
  console.log(JSON.stringify(userData))
  client.connect(function (err) {
    if (err) throw err;
    console.log ("Conexão Estabelecida!");
  const query = client.query(
  'SELECT * FROM public."Usuario" WHERE id=($1)',[userData.id],
    function(err, result) {
      if (err) {
        console.log("Erro Get User Data")
        console.log(err);
      } else {
        if (result.rowCount == 1){
          console.log("User Exist!")
          var json = JSON.stringify({ 
            email: result.rows[0].email,
            nome: result.rows[0].nome
          });
          res.end(json)
        }
      }
      query.on('end', () => { client.end(); });
    });      
  });
})

app.post('/notify_interrest', function (req, res) {
  console.log("\nNotificando Interesse...")
  var client = new pg.Client(conString);
  var result = []
  var userData = req.body
  var promise;
  console.log(JSON.stringify(userData))
  client.connect(function (err) {
    if (err) throw err;
    console.log ("Conexão Estabelecida!");
  const query = client.query(
  'SELECT * FROM public."Usuario_dispositivo" WHERE usuario_id=($1)',[userData.user],
    function(err, result) {
      if (err) {
        console.log("Erro Get User Device")
        console.log(err);
      } else {
        if (result.rowCount == 1){
          console.log("Got Device!")
          console.log("Resultado! " + result.rows[0])
          console.log("\ncomeço da notificacao")
          if (userData.species == "Cachorro") {
            var firstNotification = new OneSignal.Notification({
              contents: {
                en: "Atenção, um usuário tem interesse em adotar o cachorro " + userData.animal
              }
            });
            // set target users 
            firstNotification.setTargetDevices([result.rows[0].dispositivo])
            
            // firstNotification.setTargetDevices(result.rows[0].responsavel_id)
            serverClient.sendNotification(firstNotification)
            .then(function (response) {
              console.log("Notificação Enviada!!!!")
              console.log(response.data);
            })
            .catch(function (err) {
                console.log('Something went wrong...', err);
            });
          }
          else if (userData.species == "Gato") {
            var firstNotification = new OneSignal.Notification({
              contents: {
                en: "Atenção, um usuário tem interesse em adotar o gato " + userData.animal
              }
            });
            // set target users 
            firstNotification.setTargetDevices([result.rows[0].dispositivo])
            
            // firstNotification.setTargetDevices(result.rows[0].responsavel_id)
            serverClient.sendNotification(firstNotification)
            .then(function (response) {
              console.log("Notificação Enviada!!!!")
              console.log(response.data);
            })
            .catch(function (err) {
                console.log('Something went wrong...', err);
            });
          }          
        }
      }
      query.on('end', () => { client.end(); });
    });      
  });
})

// FUNCAO USADA DURANTE O CADASTRO DE UM NOVO ANIMAL
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
      console.log("\nAnalisando imagem..")
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
      const imagePath = "./public/images/animal" + random + ".jpeg"
  
      fs.writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, 
        function(err) {
            if(err){
              return(err);
            }
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
              console.error('ERROR1:', err);
              console.log(err.errors[0].errors)
              res.end('erro')
            });
      })
    }
    else if (req.body.form){
      var form = req.body.form
      console.log("\nSalvando Animal no BD")
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
          const imagePath = "./public/images/animal" + random + ".jpeg"
          const path = 'animal'+ random + ".jpeg"
  
          promise = (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
              if(err){
                console.log("\nErro ao criar imagem")
                console.log(err);
                Promise.reject()
              }
              else {
                console.log("\nImagem criada: " + imagePath)
                Promise.resolve()
              }
            }))
  
        Promise.all([promise]).then((data) => {
          const query = client.query(
          'INSERT INTO public."Animal"(nome, sexo, idade, descricao, peso, status_id, especie_id, raca_id, porte_id, imagem, responsavel_id, contato_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',[form.name, form.gender, form.age, form.about, form.weight, form.status, form.species, form.breed, form.size, path, form.user, form.share_email],
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
        })
      }
      })
    }
  });

app.post('/create_found_pet', function (req, res) {
  
    console.log ('Criar Animal Encontrado!');
    var analysis1;
    var index = 0;
    // Instantiates a client
    const visionClient = Vision({
      projectId: projectId
    });
  
    // The name of the image file to annotate
    if (req.body.img1) {
      console.log("\nAnalisando imagem..")
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
      const imagePath = "./public/images/animal" + random + ".jpeg"

      fs.writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, 
        function(err) {
            if(err){
              return(err);
            }
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
              console.error('ERROR1:', err);
              console.log(err.errors[0].errors)
              res.end('erro')
            });
      })
    }
    else if (req.body.form){
      var form = req.body.form
      console.log("\nSalvando Animal no BD")
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
          const imagePath = "./public/images/animal" + random + ".jpeg"
          const path = 'animal'+ random + ".jpeg"
  
          promise = (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
              if(err){
                console.log("\nErro ao criar imagem")
                console.log(err);
                Promise.reject()
              }
              else {
                console.log("\nImagem criada: " + imagePath)
                Promise.resolve()
              }
            }))
  
        Promise.all([promise]).then((data) => {
          const query = client.query(
          'INSERT INTO public."Animal_Encontrado"(nome, sexo, especie_id, raca_id, porte_id, imagem, responsavel_id, cidade, bairro, endereco, contato_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',[form.name, form.gender, form.species, form.breed, form.size, path, form.user, form.city, form.neighbor, form.address, form.share_email],
            function(err, suc) {
              if (err) {
                console.log("Deu erro")
                console.log(err);
                var json = JSON.stringify({ 
                  success: "erro"
                });
                res.end(json)
              } else {
                console.log("Found Animal Inserted")
                console.log("\n\n------- HORA DA VERDADE -------\n")
                console.log("Verificando se tem animal encontrado...")
                // ANIMAL PERDIDO CADASTRADO COM SUCESSO
                // VERIFICA SE EXISTE ANIMAL ENCONTRADO PARECIDO
                // SELECT ANIMAL ENCONTRADO ATRAVES DE {RAÇA, ESPECIE, CIDADE, BAIRRO}
                // SE ROWCOUNT >= 1 --> COMPARA AS DUAS IMAGENS --> SE FOREM PARECIDAS, SUCESSO
                const query2 = client.query(
                'SELECT * FROM public."Animal_Perdido" WHERE especie_id=($1) AND raca_id=($2) AND cidade=($3) AND bairro=($4)',[form.species, form.breed, form.city, form.neighbor],
                function(err, result) {
                  if (err) {
                    console.log("Erro ao ver se tem animal perdido parecido")
                    console.log(err);
                  }
                  else {
                    if (result.rowCount > 0)
                    {
                      console.log("Existe animal perdido parecido!!!")
                      // COMO EXISTE ANIMAL PARECIDO, VERIFICA SE AS IMAGENS SÃO PARECIDAS
                      var diff = resemble("./public/images/" + path).compareTo("./public/images/" + result.rows[0].imagem).ignoreAntialiasing().onComplete(function(data){
                        if (data.misMatchPercentage < 40) {
                          console.log("As imagens são parecidas!!")
                          var id_responsavel = result.rows[0].responsavel_id
                          const query3 = client.query(
                          'SELECT * FROM public."Usuario" WHERE id=($1)',[result.rows[0].responsavel_id],
                            function(err, resultado) {
                              if (err) {
                                console.log("Erro Get User Data")
                                console.log(err);
                              } else {
                                if (resultado.rowCount > 0){
                                  console.log("User Exist!")
                                  console.log("Enviando notificação para responsavel...")
                                  console.log("\n\nID: " + id_responsavel)
                                  const query5 = client.query(
                                    'SELECT * FROM public."Usuario_dispositivo" WHERE usuario_id=($1)',[id_responsavel],
                                      function(err, device) {
                                        if (err){
                                          console.log("Erro ao pegar dispositivo")
                                          console.log(JSON.stringify(err))
                                        }
                                        else {
                                          if (device.rowCount > 0) {
                                            console.log("\ncomeço da notificacao")
                                            var foundNotification = new OneSignal.Notification({
                                              template_id: "4c10b01e-8a8c-480d-b2c5-314c76f9925a"
                                            });
                                            // set target users 
                                            foundNotification.setTargetDevices([device.rows[0].dispositivo])
                                            
                                            serverClient.sendNotification(foundNotification)
                                            .then(function (response) {
                                              console.log("Notificação Enviada!!!!")
                                                console.log(response.data);
                                            })
                                            .catch(function (err) {
                                                console.log('Something went wrong...', err);
                                            });
                                          }
                                          console.log("\nEmail= " + result.rows[0].contato_email)
                                          if (result.rows[0].contato_email == 1) {
                                            console.log("\nEnviando email para responsavel...")
                                            const query4 = client.query(
                                            'SELECT * FROM public."Usuario" WHERE id=($1)',[form.user],
                                              function(err, user) {
                                                if (err){
                                                  console.log("Erro ao pegar usuario logado")
                                                  console.log(JSON.stringify(err))
                                                }
                                                else {
                                                  //ENVIANDO EMAIL PARA O RESPONSAVEL
                                                  const sgMail = require('@sendgrid/mail');
                                                  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                                  const msg = {
                                                    to: resultado.rows[0].email,
                                                    cc: 'm.franceschini17@gmail.com',
                                                    from: 'pethug@email.com',
                                                    subject: '[URGENTE] PetHug - Seu animal pode ter sido encontrado!!',
                                                    text: 'Atenção!!' + ' O usuário ' + user.rows[0].nome + ' cadastrou um animal parecido com o seu! ' + 
                                                    'Por favor, entre em contato pelo e-mail: ' + user.rows[0].email
                                                  };
                                                  sgMail.send(msg).then((data)=>{
                                                    console.log("\n\nEmail enviado com sucesso para: " + resultado.rows[0].email + "!!\n\n")
                                                      var json = JSON.stringify({
                                                        success: 'sucesso',
                                                        exist: true
                                                      });
                                                      res.end(json)
                                                  }).catch((err)=>{
                                                    console.log("Erro ao enviar email encontrado")
                                                    console.log(JSON.stringify(err))
                                                  })
                                                }
                                              })
                                              query4.on('end', () => { client.end(); });
                                          }
                                          else {
                                            console.log("Email não liberado para contato")
                                            var json = JSON.stringify({
                                              success: 'sucesso',
                                              exist: true
                                            });
                                            res.end(json)
                                            query5.on('end', () => { client.end(); });
                                          }
                                        }
                                      })
                                }
                              }
                            });
                        }
                        else {
                          console.log("As imagens não são parecidas!!")
                          var json = JSON.stringify({
                            success: 'sucesso',
                            exist: false
                          });
                          res.end(json)
                          query2.on('end', () => { client.end(); });                          
                        }
                      });
                    }
                    //nao tem animal parecido cadastrado
                    else {
                      console.log("Nao existe animal parecido")
                      var json = JSON.stringify({
                        success: 'sucesso',
                        exist: false
                      });
                      res.end(json)
                      query2.on('end', () => { client.end(); });
                    }
                  }
                })
              }
            });
        })
      }
      })
    }
  });


app.post('/create_lost_pet', function (req, res) {
  console.log ('Criar Perdido Encontrado!');
  // console.log (req);

  var analysis1;
  var index = 0;
  // Instantiates a client
  const visionClient = Vision({
    projectId: projectId
  });

  // The name of the image file to annotate
  if (req.body.img1) {
    console.log("\nAnalisando imagem..")
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
    const imagePath = "./public/images/animal" + random + ".jpeg"

    fs.writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, 
      function(err) {
          if(err){
            return(err);
          }
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
            console.error('ERROR1:', err);
            console.log(err.errors[0].errors)
            res.end('erro')
          });
    })
  }
  else if (req.body.form){
    var form = req.body.form
    console.log("\nSalvando Animal no BD")
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
        const imagePath = "./public/images/animal" + random + ".jpeg"
        const path = "animal" + random + ".jpeg"

        promise = (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
            if(err){
              console.log("\nErro ao criar imagem")
              console.log(err);
              Promise.reject()
            }
            else {
              console.log("\nImagem criada: " + imagePath)
              Promise.resolve()
            }
          }))

      Promise.all([promise]).then((data) => {
        
        const query = client.query(
        'INSERT INTO public."Animal_Perdido"(nome, sexo, especie_id, raca_id, porte_id, imagem, responsavel_id, cidade, bairro, endereco, contato_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',[form.name, form.gender, form.species, form.breed, form.size, path, form.user, form.city, form.neighbor, form.address, form.share_email],
          function(err, suc) {
            if (err) {
              console.log("Deu erro")
              console.log(err);
              var json = JSON.stringify({ 
                success: "erro"
              });
              res.end(json)
            } else {
              console.log("Lost Animal Inserted")
              console.log("\n\n------- HORA DA VERDADE -------\n")
              console.log("Verificando se tem animal encontrado...")
              // ANIMAL PERDIDO CADASTRADO COM SUCESSO
              // VERIFICA SE EXISTE ANIMAL ENCONTRADO PARECIDO
              // SELECT ANIMAL ENCONTRADO ATRAVES DE {RAÇA, ESPECIE, CIDADE, BAIRRO}
              // SE ROWCOUNT >= 1 --> COMPARA AS DUAS IMAGENS --> SE FOREM PARECIDAS, SUCESSO
              const query2 = client.query(
              'SELECT * FROM public."Animal_Encontrado" WHERE especie_id=($1) AND raca_id=($2) AND cidade=($3) AND bairro=($4)',[form.species, form.breed, form.city, form.neighbor],
              function(err, result) {
                if (err) {
                  console.log("Erro ao ver se tem animal encontrado parecido")
                  console.log(err);
                }
                else {
                  if (result.rowCount > 0)
                  {
                    console.log("Existe animal encontrado parecido!!!")
                    console.log("Imagem cadastrada: " + path)
                    console.log("Imagem retornada: " + result.rows[0].imagem)
                    // COMO EXISTE ANIMAL PARECIDO, VERIFICA SE AS IMAGENS SÃO PARECIDAS
                    var diff = resemble("./public/images/" + path).compareTo("./public/images/" + result.rows[0].imagem).ignoreAntialiasing().onComplete(function(data){
                      if (data.misMatchPercentage < 40) {
                        console.log("As imagens são parecidas!!")
                        var id_responsavel = result.rows[0].responsavel_id
                        const query3 = client.query(
                        'SELECT * FROM public."Usuario" WHERE id=($1)',[result.rows[0].responsavel_id],
                          function(err, resultado) {
                            if (err) {
                              console.log("Erro Get User Data")
                              console.log(err);
                            } else {
                              if (resultado.rowCount > 0){
                                console.log("User Exist!")
                                console.log("Enviando notificação para responsavel...")
                                console.log("\n\nID: " + id_responsavel)
                                const query5 = client.query(
                                  'SELECT * FROM public."Usuario_dispositivo" WHERE usuario_id=($1)',[id_responsavel],
                                    function(err, device) {
                                      if (err){
                                        console.log("Erro ao pegar dispositivo")
                                        console.log(JSON.stringify(err))
                                      }
                                      else {
                                        if (device.rowCount > 0) {
                                          console.log("\ncomeço da notificacao")
                                          var lostNotification = new OneSignal.Notification({
                                            template_id: "4c10b01e-8a8c-480d-b2c5-314c76f9925a"
                                          });
                                          // set target users 
                                          lostNotification.setTargetDevices([device.rows[0].dispositivo])
                                          
                                          serverClient.sendNotification(lostNotification)
                                          .then(function (response) {
                                            console.log("Notificação Enviada!!!!")
                                              console.log(response.data);
                                          })
                                          .catch(function (err) {
                                              console.log('Something went wrong...', err);
                                          });
                                        }
                                        console.log("Email= " + result.rows[0].contato_email)
                                        if (result.rows[0].contato_email == 1) {
                                          console.log("\nEnviando email para responsavel...")
                                          const query4 = client.query(
                                          'SELECT * FROM public."Usuario" WHERE id=($1)',[form.user],
                                            function(err, user) {
                                              if (err){
                                                console.log("Erro ao pegar usuario logado")
                                                console.log(JSON.stringify(err))
                                              }
                                              else {
                                                //ENVIANDO EMAIL PARA O RESPONSAVEL
                                                const sgMail = require('@sendgrid/mail');
                                                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                                                const msg = {
                                                  to: resultado.rows[0].email,
                                                  cc: 'm.franceschini17@gmail.com',
                                                  from: 'pethug@email.com',
                                                  subject: '[URGENTE] PetHug - Seu animal pode ter sido encontrado!!',
                                                  text: 'Atenção!!' + ' O usuário ' + user.rows[0].nome + ' cadastrou um animal parecido com o seu! ' + 
                                                  'Por favor, entre em contato pelo e-mail: ' + user.rows[0].email
                                                };
                                                sgMail.send(msg).then((data)=>{
                                                  console.log("\n\nEmail enviado com sucesso para: " + resultado.rows[0].email + "!!\n\n")
                                                  var json = JSON.stringify({
                                                      success: 'sucesso',
                                                      exist: true
                                                    });
                                                    res.end(json)
                                                }).catch((err)=>{
                                                  console.log("Erro ao enviar email")
                                                  console.log(JSON.stringify(err))
                                                })
                                              }
                                            })
                                            query4.on('end', () => { client.end(); });
                                        }
                                        else {
                                          console.log("Email nao liberado para contato")
                                          var json = JSON.stringify({
                                            success: 'sucesso',
                                            exist: true
                                          });
                                          res.end(json)
                                          query5.on('end', () => { client.end(); });
                                        }
                                      }
                                    })
                                }
                              }
                            });
                        }
                        else {
                          console.log("As imagens não são parecidas!!")
                          var json = JSON.stringify({
                            success: 'sucesso',
                            exist: false
                          });
                          res.end(json)
                          query2.on('end', () => { client.end(); });                          
                        }
                      });
                    }
                  //nao tem animal parecido cadastrado
                  else {
                    console.log("Nao existe animal parecido")
                    var json = JSON.stringify({
                      success: 'sucesso',
                      exist: false
                    });
                    res.end(json)
                    query2.on('end', () => { client.end(); });
                  }
                }
              })
            }
          });
      })
    }
    })
  }
});

// FUNCAO PARA LISTAR TODOS OS ANIMAIS CADASTRADOS
app.get('/pet_list', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Lista de Animais")
  client.removeAllListeners()

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

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

app.get('/found_pet_list', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Lista de Animais Encontrados")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'SELECT * FROM public."Animal_Encontrado"');
    animalPromise = query.on('row', function(row) {
        result.push(row)
    })
    

    Promise.all([animalPromise]).then(function(data) {
      console.log("Todos os animais encontrados retornados")
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

app.get('/lost_pet_list', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Lista de Animais Peridos")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'SELECT * FROM public."Animal_Perdido"');
    animalPromise = query.on('row', function(row) {
      console.log("Recebeu os animais encontrados")
      result.push(row)
    });

    Promise.all([animalPromise]).then(function(data) {
      console.log("Todos os animais perdidos retornados")
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
      query4.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

// FUNCAO PARA APAGAR UM ANIMAL
app.post('/delete_pet', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Exclusao de Animais")
  console.log(req.body.id)

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'DELETE FROM public."Animal" WHERE id=($1)',[req.body.id]);
    animalPromise = query.on('row', function(row) {
      result.push(row)
    });

    Promise.all([animalPromise]).then(function(data) {
      console.log("Animal deletado com sucesso")
      var json = JSON.stringify({ 
        status: 'success'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      var json = JSON.stringify({ 
        status: 'error'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

app.post('/delete_found_pet', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Exclusao de Animais Encontrados")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'DELETE FROM public."Animal_Encontrado" WHERE id=($1)',[req.body.id]);
    animalPromise = query.on('row', function(row) {
      result.push(row)
    });

    Promise.all([animalPromise]).then(function(data) {
      console.log("Animal Encontrado deletado com sucesso")
      var json = JSON.stringify({ 
        status: 'success'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      var json = JSON.stringify({ 
        status: 'error'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

app.post('/delete_lost_pet', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Exclusao de Animais Perdidos")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'DELETE FROM public."Animal_Perdido" WHERE id=($1)',[req.body.id]);
    animalPromise = query.on('row', function(row) {
      result.push(row)
    });

    Promise.all([animalPromise]).then(function(data) {
      console.log("Animal Perdido deletado com sucesso")
      var json = JSON.stringify({ 
        status: 'success'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      var json = JSON.stringify({ 
        status: 'error'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

app.get('/place_list', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Lista de Estabelecimentos")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'SELECT * FROM public."Estabelecimento"');
    placePromise = query.on('row', function(row) {
      console.log("Recebeu os estabelecimentos")
      result.push(row)
    });

    Promise.all([placePromise]).then(function(data) {
      console.log("Todos os estabelecimentos retornados")
      var json = JSON.stringify({ 
        places: result
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

app.post('/create_place', function (req, res) {
  console.log("Criando Estabelecimento")
  var form = req.body.form
  console.log("\nSalvando Estabelecimento no BD")
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
      const imagePath = "./public/images/places/place" + random + ".jpeg"
      const path = 'place'+ random + ".jpeg"

      promise = (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
          if(err){
            console.log("\nErro ao criar imagem")
            console.log(err);
            Promise.reject()
          }
          else {
            console.log("\nImagem criada: " + imagePath)
            Promise.resolve()
          }
        }))

    Promise.all([promise]).then((data) => {
      const query = client.query(
      'INSERT INTO public."Estabelecimento"(nome, cidade, bairro, endereco, telefone, email, imagem, tipo, usuario_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',[form.name, form.city, form.neighbor, form.address, form.phone, form.email, path, form.type, form.user],
        function(err, result) {
          if (err) {
            console.log("Deu erro")
            console.log(err);
          } else {
            console.log("Place Inserted")
            var json = JSON.stringify({ 
              success: "sucesso"
            });
            res.end(json)
          }
        });
      query.on('end', () => { client.end(); });
    })
  }
  })
});

app.post('/delete_place', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Exclusao de Estabelecimentos")
  console.log(req.body.id)

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'DELETE FROM public."Estabelecimento" WHERE id=($1)',[req.body.id]);
    placePromise = query.on('row', function(row) {
      result.push(row)
    });

    Promise.all([placePromise]).then(function(data) {
      console.log("Estabelecimento deletado com sucesso")
      var json = JSON.stringify({ 
        status: 'success'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      var json = JSON.stringify({ 
        status: 'error'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

app.get('/complaint_list', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Lista de Denúncias")

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'SELECT * FROM public."Denuncia"');
    complaintPromise = query.on('row', function(row) {
      console.log("Recebeu as denúncias")
      result.push(row)
    });

    Promise.all([complaintPromise]).then(function(data) {
      console.log("Todas as denúncias retornados")
      var json = JSON.stringify({ 
        complaints: result
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

app.post('/create_complaint', function (req, res) {
  console.log("Criando Denúncia")
  var form = req.body.form
  console.log("\nSalvando Denúncia no BD")
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
      const imagePath = "./public/images/complaints/complaint" + random + ".jpeg"
      const path = 'complaint'+ random + ".jpeg"

      promise = (require("fs").writeFile(imagePath, imageBuffer.data, {encoding: 'base64'}, function(err) {
          if(err){
            console.log("\nErro ao criar imagem")
            console.log(err);
            Promise.reject()
          }
          else {
            console.log("\nImagem criada: " + imagePath)
            Promise.resolve()
          }
        }))

    Promise.all([promise]).then((data) => {
      const query = client.query(
      'INSERT INTO public."Denuncia"(cidade, bairro, endereco, descricao, especie_id, imagem, responsavel_id, contato_email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',[form.city, form.neighbor, form.address, form.about, form.species, path, form.user, form.share_email],
        function(err, result) {
          if (err) {
            console.log("Deu erro")
            console.log(err);
          } else {
            console.log("Complaint Inserted")
            var json = JSON.stringify({ 
              success: "sucesso"
            });
            res.end(json)
          }
        });
      query.on('end', () => { client.end(); });
    })
  }
  })
});

app.post('/delete_complaint', function (req, res) {
  var result = []
  var client = new pg.Client(conString);
  console.log("Exclusao de Denúncias")
  console.log(req.body.id)

  client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");

    const query = client.query(
    'DELETE FROM public."Denuncia" WHERE id=($1)',[req.body.id]);
    complaintPromise = query.on('row', function(row) {
      result.push(row)
    });

    Promise.all([complaintPromise]).then(function(data) {
      console.log("Denúncia deletado com sucesso")
      var json = JSON.stringify({ 
        status: 'success'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
    }, function(err) {
      console.error('ERROR:', err);
      var json = JSON.stringify({ 
        status: 'error'
      });
      res.end(json);
      console.log("Response Sent!\n")
      query.on('end', () => { client.end(); });
      // one or more failed
    })
  })
})

app.listen(3000, function (err) {

  serverClient = new OneSignal.Client({
    userAuthKey: "01",
    // note that "app" must have "appAuthKey" and "appId" keys
    app: { appAuthKey: 'YWJkMTZlMGItYzM1Ni00NjZiLWFiYmQtMmM0MmQ2MWI5ZDI2', appId: '682f1efd-6ede-46bd-b6dc-102ecf7fac50' }
  });

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
      project: projectId,
      languageHints: ['en']
    });
  });
  
  if (err) {
    throw err
  }
  console.log('Server started on port 3000')
})
