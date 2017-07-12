const pg = require('pg');
const conString = process.env.DATABASE_URL || 'postgres://pethug:senha@localhost:5432/pethug';

var client = new pg.Client(conString);
var result = [];
var result2 = [];

client.connect(function (err) {
  	if (err) throw err;
  	console.log ("Conexão Estabelecida!");
	// console.log (client);

	const query = client.query(
	'SELECT * FROM public."Raca"');
	racaPromise = query.on('row', function(row) {
		console.log("Primeira query")
		result.push(row)
	});

	const query2 = client.query(
		'SELECT * FROM public."Especie"');
	especiePromise = query2.on('row', function(row2) {
		console.log("Segunda query");
		result2.push(row2)
	});
		
	
	Promise.all([racaPromise, especiePromise]).then(function(data) {
		console.log ("Consultas Finalizadas!")
		console.log("Resultado 1:")
		console.log(result)
		console.log("Resultado 2:")
		console.log(result2 + "\n")
		for (i=0;i<result.length;i++){
			for (j=0;j<result2.length;j++){
				if (result[i].especie_id == result2[j].id){
					console.log ("Especies e Raças Cadastradas:");
					console.log (result2[j].nome + ' | ' + result[i].nome + "\n");
				}
			}
		}
		query.on('end', () => { client.end(); });
	});
	
})


//queries are queued and executed one after another once the connection becomes available

// while (x > 0) {
//     client.query("INSERT INTO junk(name, a_number) values('Ted',12)");
//     client.query("INSERT INTO junk(name, a_number) values($1, $2)", ['John', x]);
//     x = x - 1;
// }





//queries can be executed either via text/parameter values passed as individual arguments
//or by passing an options object containing text, (optional) parameter values, and (optional) query name
// client.query({
//     name: 'insert beatle',
//     text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
//     values: ['George', 70, new Date(1946, 02, 14)]
// });

//subsequent queries with the same name will be executed without re-parsing the query plan by postgres
// client.query({
//     name: 'insert beatle',
//     values: ['Paul', 63, new Date(1945, 04, 03)]
// });
// var query = client.query("SELECT * FROM Raca");

// //can stream row results back 1 at a time
// query.on('row', function(row) {
//     console.log(row);
//     console.log("Beatle name: %s", row.name); //Beatle name: John
// });

// //fired after last row is emitted
// query.on('end', function() {
//     client.end();
// });