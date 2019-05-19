const express = require('express');
const path = require('path');
const fs = require("fs");
const _ = require('underscore');

var app = express();
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, '../client')));
app.set('views', path.join(__dirname, 'views'));

var fileContents = fs.readFileSync('./server/data/jogadores.json', 'utf8')
var fileContents2 = fs.readFileSync('./server/data/jogosPorJogador.json', 'utf8')
var db = { jogadores: JSON.parse(fileContents), jogosPorJogador: JSON.parse(fileContents2) }

app.get('/', function(req, res){
	res.render('index',{players: db.jogadores.players});
});

app.get('/jogador/:numero_identificador/', function(req, res) {
  	
  	let jogadores = _.find(db.jogadores.players, function(el) { 
  		return el.steamid === req.params.id; 
  	});
  	
  	let jogosDesteJogador = db.jogosPorJogador[req.params.numero_identificador];
  
	//1. Converter tempo jogado de minuto para hora
	jogosDesteJogador.games = _.map(jogosDesteJogador.games, function(el) {
    	el.playtime_forever_hour = Math.round(el.playtime_forever/60);
    	return el;
  	});

	//2. Contabilizar a quantidade de jogos não jogados
  	jogosDesteJogador.not_played_count = _.where(jogosDesteJogador.games, { playtime_forever: 0 }).length;

  	//3. Ordenar por ordem decrescente de horas jogadas
  	jogosDesteJogador.games = _.sortBy(jogosDesteJogador.games, function(el) {
    	return -el.playtime_forever;
  	});

  	// top 5 jogos
  	jogosDesteJogador.games = _.head(jogosDesteJogador.games, 5);

  	res.render('jogador', {
  		profile: jogadores,
  		gameInfo: jogosDesteJogador,
  		favorito: jogosDesteJogador[0]
  	});

});

const server = app.listen(3000, function(){
  const port = server.address().port;
  console.log(`Listening at http://localhost:${port}`);
});


// var express = require('express'),
//     app = express();

// app.set('view engine','hbs');
// app.set('views',__dirname +'/views');

// app.get('/', (request, response) => {
// 	response.render('index');
// });
// //app.use(express.static(`{__dirname}/../client`));
// app.use(express.static( __dirname + '/../client'));
// //app.use(express.static( __dirname + '/../views'));


// const server = app.listen(3000, ()=>{
// 	const host = server.address().address;
// 	const port = server.address().port;

// 	console.log(`Listening at http://${host}:${port}`);
// });
// // carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// // você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// // dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))
// var db = {
// };


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');

// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

// abrir servidor na porta 3000
// dica: 1-3 linhas de código
