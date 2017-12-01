var resemble = require('node-resemble-js');
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var pg = require('pg');
var fs = require('fs');
var cors = require('cors')
var app = express();
require('dotenv').config()

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cors());

app.post('/teste', function (req, res) {
	const sgMail = require('@sendgrid/mail');
	console.log("\nSENDGRID_API_KEY")
	console.log(process.env.SENDGRID_API_KEY)
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
	to: 'matheusfranceschini@saveway.com.br',
	from: 'm.franceschini17@gmail.com',
	subject: '[URGENTE] PetHug - Seu animal pode ter sido encontrado!!',
	text: 'Atenção!! Acabou de ser cadastrado em nosso sistema um animal semelhante ao seu!' + 
	'O usuário ' +  'cadastrou um animal parecido com o seu!' + 
	'Por favor, entre em contato pelo e-mail: '
	};
	console.log(msg)
	sgMail.send(msg).then((data)=>{
	console.log("Email enviado com sucesso")
	console.log("\nRetorno do send")
	console.log(JSON.stringify(data))
		var json = JSON.stringify({
		success: 'sucesso',
		exist: true
		});
		res.end(json)
	}).catch((err)=>{
	console.log("Erro ao enviar email")
	console.log(JSON.stringify(err))
	var json = JSON.stringify({
		success: 'ruim'
		});
		res.end(json)
	})
})

app.listen(4000, function (err) {
	if (err) {
		throw err
	  }
	  console.log('Server started on port 4000')


})	