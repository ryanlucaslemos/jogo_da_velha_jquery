
var rodada = 1, vitorias_jogador_1 = 0, vitorias_jogador_2 = 0;
var matriz_jogo = inicia_matriz_jogo();
//matriz para iniciar a matriz jogo, setando seus valores como 0
function inicia_matriz_jogo(){
	var matriz_jogo = Array(3);
	for (var i =  1; i <= 3; i++) {
		var pos_auxiliar = '';
		if (i == 1) {
			pos_auxiliar = 'a';
		}
		else if (i == 2) {
			pos_auxiliar = 'b';	
		}
		else{
			pos_auxiliar = 'c';
		}
		matriz_jogo[pos_auxiliar] = Array(3);
		for(var j = 1; j<=3; j++){
			matriz_jogo[pos_auxiliar][j] = 0;
		}

	}
	return matriz_jogo;
}
//executa quando o dom estiver carregado
$(document).ready( function(){
	var jogador_1, jogador_2, vencedor;
	//mostra o texto e a marcação de cada jogador
	function indicacao_vez(jogador){
		var vez_texto = 'Sua vez de jogar ', img_src = '';
		if(jogador == 1){
			vez_texto += nome_jogador1 + '. Você joga com:';
			img_src = 'imagens/marcacao_1.png';
		}
		else{
			vez_texto += nome_jogador2 + '. Você joga com:';
			img_src = 'imagens/marcacao_2.png';
		}
		$('#vez_texto').html(vez_texto);
		$('#marcacao_jogador_atual').prop('src', img_src);
	}
	//quando clicar para iniciar o jogo 
	$('#btn_iniciar_jogo').click( function(){
		//valida a digitação dos apelidos dos jogadores
		if($('#entrada_apelido_jogador_1').val() == ''){
			alert('Apelido do jogador 1 não foi preenchido');
			return false;	
		}
		if($('#entrada_apelido_jogador_2').val() == ''){
			alert('Apelido do jogador 2 não foi preenchido');
			return false;	
		}
		//exibir os apelidos no palco jogo
		nome_jogador1 = $('#entrada_apelido_jogador_1').val();
		nome_jogador2 = $('#entrada_apelido_jogador_2').val();
		$('#nome_jogador1').html(nome_jogador1);
		$('#nome_jogador2').html(nome_jogador2);
		//
		$('#pagina_inicial').hide();
		indicacao_vez(1);
		$('#palco_jogo').show();
	});
	//on click de elementos dinamicos uma vez que se muda a jogada a classe fica dinamica, primeiro o eleme
	$("#tabuleiro").on('click', '.jogada',function(){
		var id_campo_clicado = this.id;
		$('#'+id_campo_clicado).prop('class', 'changed');
		jogada(id_campo_clicado);
	});
	function jogada(id){
		var icone = '';
		var ponto = 0;
		var indicacao = 0;
		if ((rodada%2) == 1) {
			ponto = -1;
			icone = 'url("imagens/marcacao_1.png")';
			//modaifica o jogador que vai ser indicado (1 ou 2)
			indicacao = 2;
			

		}	else{
			ponto = 1;
			icone = 'url("imagens/marcacao_2.png")';
			//modaifica o jogador que vai ser indicado (1 ou 2)
			indicacao = 1;
		}

		
		$('#'+id).css('background-image', icone);
		//indica a vez
		indicacao_vez(indicacao);
		var linha_coluna = id.split('-');
		matriz_jogo[linha_coluna[0]][linha_coluna[1]] = ponto;
		//caso a rodada seja maior que 4, indica que ja tem possibilidade de ter uma combinação vencedora
		if(rodada>4){
			//verifica as combinações
			verifica_combinacao();
		}
		rodada++;
	}
	function verifica_combinacao(){
		//verifica na horizontal
		var matriz_pontos = Array(3);
		matriz_pontos[0] = 0;
		matriz_pontos[1] = 0;
		matriz_pontos[2] = 0;
		//verifica na horizontal
		for(var i=1; i<=3; i++){
			//referente a linha A
			matriz_pontos[0] += matriz_jogo['a'][i];
			//referente a linha B
			matriz_pontos[1] += matriz_jogo['b'][i];
			//referente a linha C
			matriz_pontos[2] += matriz_jogo['c'][i];
		}
		//verifica na vertical
		var pontos = 0;
		for(var l = 1; l<=3; l++){
			pontos = 0;
			pontos+= matriz_jogo['a'][l];
			pontos+= matriz_jogo['b'][l];
			pontos+= matriz_jogo['c'][l];
			//inserindo no array os pontos das verticais
			matriz_pontos.push(pontos);
			
		}
		//verificar na diagonal
		pontos_diagonal1 = 0;
		pontos_diagonal1 = matriz_jogo['a'][1] + matriz_jogo['b'][2] + matriz_jogo['c'][3];

		pontos_diagonal2 = 0;
		pontos_diagonal2 = matriz_jogo['a'][3] + matriz_jogo['b'][2] + matriz_jogo['c'][1];
		//inserindo os pontos das diagonais
		matriz_pontos.push(pontos_diagonal1);
		matriz_pontos.push(pontos_diagonal2);
		//console.log(matriz_pontos);
		//verifica se ganhou
		var ganhou = ganhador(matriz_pontos);
		if(ganhou){
			//se ganhou chama a função que encerra o jogo e mostra a possibilidade de iniciar 
			//um novo jogo com os mesmos jogadores ou com jogadores diferentes
			fim_jogo();
		}
		//caso chegue na rodada em que a velha ja é possivel e não tenha ganhadores
		else if(rodada>6){
			velha(matriz_pontos);
		}
		
	}
	function ganhador(pontos){
		for(var i=0; i<pontos.length; i++){
			if (pontos[i] == -3) {
				$('#vitorias_j1').html(++vitorias_jogador_1);
				alert('Parabéns '+ nome_jogador1 +' você é o vencedor(a)!!');
				 return true;
			}
			else if (pontos[i] == 3) {
				$('#vitorias_j2').html(++vitorias_jogador_2);
				alert('Parabéns '+ nome_jogador2 +' você é o vencedor(a)!!');
				return true;
			}
		}
		return false
	}
	function velha(pontos){
		//conta quantos tem 0 e -1
		var verificador_velha = 0;
		for(var i=0; i < pontos.length; i++){
			if(pontos[i] == 1 || pontos[i] == -1 || pontos[i] == 0){
				verificador_velha++;
			}
			//caso fique dois circulos e somente mais uma jogada faltando(rodada 8/penultima rodada) 
			//ou seja, só da pra preencher com x, ai não conseguiria alcançar os 3 pontos
			else if(rodada == 8 && pontos[i] == 2){
				verificador_velha++;	
			}
		}
		if(verificador_velha == pontos.length){
			alert('IIIIIIH RAPAIZ ninguém venceu, deu velha em ?!');
			$('.jogada').prop('onclick', null);
			fim_jogo();
		}
	}
	function reinicia_matriz_jogo(){
		for (var i =  1; i <= 3; i++) {
			var pos_auxiliar = '';
			if (i == 1) {
				pos_auxiliar = 'a';
			}
			else if (i == 2) {
				pos_auxiliar = 'b';	
			}
			else{
				pos_auxiliar = 'c';
			}
			for(var j = 1; j<=3; j++){
				matriz_jogo[pos_auxiliar][j] = 0;
			}

		}
	}
	//modifica a classe retirando assim os eventos de click

	function reinicia_jogo(){
		//reiniciar a matriz jogo
		reinicia_matriz_jogo();
		//tirar as imagens de fundo do tabuleiro
		$('.changed').css('background-image', '');
		//reiniciar as rodadas
		rodada = 1;
		//ativar evento de click novamente
		$('.changed').prop('class', 'jogada');
		//troca o texto da indicação de vez
		indicacao_vez(1);
		//mostra a div que indica a vez
		$('#indicacao_vez').show();
		//esconde a div de fim de jogo
		$('#fim_jogo').hide();
	}

	//recarrega a página
	function novo_jogo(){
		location.reload();
	}
	function fim_jogo(){
		//retira os eventos uma vez que se troca a classe
		$('.jogada').prop('class', 'changed');
		//esconde a div que indica a vez
		$('#indicacao_vez').hide();
		//mostra a div de fim de jogo
		$('#fim_jogo').show();
	}
	$('#inicia_novo_jogo').click(novo_jogo);
	$('#recarrega_jogo').click(reinicia_jogo);
});