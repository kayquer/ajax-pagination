
$( document ).ready(function() {

var data = [];
var dataBusca = [];
var itens = [];
var i = 0;
var inicio = 1;
var itensPorPagina = 30;
var itensTotal = 0;
var paginaAtual = $('#paginaAtual').val() || 1;
var totalPaginas = 0;
var clicado = 0;
var pesquisa = '';


var url = 'https://jsonplaceholder.typicode.com/comments';

/*
* Ajax request
*/

var request = $.ajax({
    method: "GET",
    url: url,
    dataType: "json"

  });

  request.done(function(dataApi){
        data = dataApi;
        itensTotal = data.length;
        console.log(itensTotal)
        totalPaginas = Math.ceil(itensTotal / itensPorPagina);
        criaPageItem(totalPaginas);
        paginacaoImprime(paginaAtual,itensPorPagina,data);
  });


$('#pesquisaNome').on('click', function(){
    var index = 0
    dataBusca = [];
    pesquisa = $('#pesquisaNomeVal').val();
    pesquisaRegEx = new RegExp(pesquisa, 'i');
    for(i = 0; i < itensTotal; i++){
        if(pesquisaRegEx.test(data[i].name) || pesquisaRegEx.test(data[i].body)){
            dataBusca[index] = data[index];
            index++
        }   
    } 

    itensTotal = dataBusca.length;
    totalPaginas = Math.ceil(itensTotal / itensPorPagina);
    $('#numResultados').show('400').text(itensTotal);
    criaPageItem(totalPaginas);
    recarregaResultados(1);
})


$('#pesquisaOrdenar').on('click', function(){
    if(clicado == 0){
        dataBusca = data.sort(function(a,b){
            if(a.name < b.name) return -1;
            if(a.name > b.name) return 1;
            return 0;
        });
        clicado = 1;
    }else{
        dataBusca = data.sort(function(a,b){
            if(a.name > b.name) return -1;
            if(a.name < b.name) return 1;
            return 0;
        });        
        clicado = 0;
    }
    recarregaResultados(paginaAtual);

})

/*
* Limpar e escreve novos itens de paginação
*/


function recarregaResultados(paginaAtual){
    $('#itens').empty();
    setTimeout(() => {
        if(dataBusca.length < 1 && pesquisa.length < 1){
            paginacaoImprime(paginaAtual,itensPorPagina,data); 
            //console.log('entrou data - dataBusca.length'+dataBusca.length)
        }else{
            paginacaoImprime(paginaAtual,itensPorPagina,dataBusca); 
            //console.log('entrou dataBusca')

        }
    }, 350);

}

$('#paginacao').on('click','.page-link',function(){
    paginaAtual = $(this).attr('for');
    paginaAnt = parseInt( $('#paginaAtual').val());
    if(paginaAtual == 'ant'){
        paginaAtual = paginaAnt + 1;
    }else if(paginaAtual == 'prox'){
        paginaAtual = paginaAnt + 1;
    }

    $('#paginaAtual').val(paginaAtual);

    recarregaResultados(paginaAtual);

});  


/*
* Listener de mudanças da ID página atual
*/

$('#paginaAtual').on('change', function(){
    paginaAtual = $('#paginaAtual').val();
    inicio = (itensPorPagina*paginaAtual)-itensPorPagina;
})




 
/*
* calcula intervalos de paginação
*/ 

function paginacaoImprime(paginaAtual,itensPorPagina,data){
  itens = [];  
  inicio = (itensPorPagina*paginaAtual)-itensPorPagina;  
  var limite = itensPorPagina + inicio;
  for(i = inicio; i<limite; i++){
    itens[i] = data[i];
}



itens.forEach(imprimeResultados)
}
/*
*paginação
*/
function criaPageItem(totalPaginas){
    $('#paginacao').empty();
    setTimeout( function(){
        $('#paginacao').append(`<li class="page-item">
        <a class="page-link" for="ant" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
        </a>
        </li>`);
    
        for(i=1;i<=totalPaginas;i++){
            $('#paginacao').append(`<li class="page-item">
            <a class="page-link" id="pageLink" for="${i}">${i}</a>
        </li>`);
        };
    
        $('#paginacao').append(`<li class="page-item">
        <a class="page-link" for="prox"  aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
        </a>
        </li>`);
    },50);

}
/*
* Função imprimir itens
*/

function imprimeResultados(element, index, array){

  //console.log(pesquisa)
  var html = `
  
  <!--Card-->
 
  <div class="card">

      <!--Card image-->


      <!--Card content-->
      <div class="card-body">
          <!--Title-->
          <h4 class="card-title">${element.name} - ${element.id}</h4>
          <!--Text-->
          <p class="card-text">${element.body}</p>
          <a href="${element.email}" target="_blank" class="btn btn-primary btn-md">${element.email}
              <i class="fa fa-mail ml-2"></i>
          </a>
      </div>

  </div>
 
  <!--/.Card-->`  
    
    $('#itens').append(html);

 

}

}); 
