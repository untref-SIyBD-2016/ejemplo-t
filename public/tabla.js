 // https://developers.google.com/web/updates/2015/03/introduction-to-fetch
 
var tipos_viv={casa: 1, dept: 2, otros:3};

var comunas=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

var matriz=[];

var linea=['comuna \\ %','casas','departamentos','otros'];

matriz.push(linea);

comunas.forEach(function(comuna){
    linea=[comuna,0,0,0];
    matriz.push(linea);
});

function meter_datos(datos){
    datos.forEach(function(registro){
        var i=registro.comuna;
        var j=tipos_viv[registro.tipo_viv];
        matriz[i][j]=registro.proporcion;
    });
}

function mostrar_matriz(){
    var t=document.createElement('table');
    pizarra.appendChild(t);
    matriz.forEach(function(linea_matriz){
        var row=t.insertRow(-1);
        linea_matriz.forEach(function(celda){
            var cell=row.insertCell(-1);
            cell.textContent=celda;
        });
    });
}

traer.onclick=function(){
	pizarra.innerHTML='';
	fetch('/datos?regimen='+regimen.value).then(function(response){
		return response.json().then(function(datos) {  
			meter_datos(datos);
			mostrar_matriz();
		});
	}).catch(function(err){
		pizarra.textContent=err.message;
	});
}	