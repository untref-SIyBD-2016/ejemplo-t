"use strict";

var express = require('express'); // http://expressjs.com/en/4x/api.html
var app = express();

app.get('/fecha', function(req, res){
  res.send(new Date());
  res.end();
});

app.listen(3000,function(){
  console.log('conectado');
});

app.use(express.static('public')); // http://expressjs.com/en/starter/static-files.html

var sql=`
WITH viviendas AS (
  SELECT CASE v2_2 WHEN 1 THEN 'casa' 
                   WHEN 2 THEN 'dept' 
                   ELSE 'otros' 
         END AS tipo_viv,
         comuna,
         fexp
    FROM eah2015_usuarios_hog
    WHERE nhogar=1)
SELECT comuna, tipo_viv, 
       round(SUM(fexp)*100.0/(SELECT SUM(fexp) FROM viviendas d WHERE d.comuna=n.comuna),1) as proporcion
  FROM viviendas n
  GROUP BY comuna, tipo_viv
  ORDER BY comuna, tipo_viv;
`;

var pg = require('pg'); // https://www.npmjs.com/package/pg#client-pooling

app.get('/datos', function(req, res){
  var config = require('../local-config-db.json')
  var pool = new pg.Pool(config);
  res.set('Content-Type', 'application/json');
  pool.connect(function(err, client, done) {
    if(err) {
      res.send('ERROR - No se pudo conectar: '+err.message);
    }
    client.query(sql, function(err, result) {
      done();
      if(err) {
        res.send('ERROR - Al ejecutar la consulta: '+err.message);
      }else{
        res.send(result.rows);
      }
      res.end();
    });
  });
  pool.on('error', function (err, client) {
    res.send('ERROR - en la base de datos: '+err.message);
    res.end();
  })
});

