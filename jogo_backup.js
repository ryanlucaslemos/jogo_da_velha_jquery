var rodada = 1;
var matriz_jogo = inicia_matriz_jogo();
var ganhou = false;
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
		$('#nome_jogador1').html($('#entrada_apelido_jogador_1').val());
		$('#nome_jogador2').html($('#entrada_apelido_jogador_2').val());
		//
		$('#pagina_inicial').hide();
		$('#palco_jogo').show();
	});
	$('.jogada').click(function(){
		var id_campo_clicado = this.id;
		$('#'+id_campo_clicado).off();
		jogada(id_campo_clicado);
	});
	function jogada(id){
		var icone = '';
		var ponto = 0;
		if ((rodada%2) == 1) {
			ponto = -1;
			icone = 'url("imagens/marcacao_1.png")';
		}	else{
			ponto = 1;
			icone = 'url("imagens/marcacao_2.png")';
		}
		
		$('#'+id).css('background-image', icone);
		var linha_coluna = id.split('-');
		matriz_jogo[linha_coluna[0]][linha_coluna[1]] = ponto;
		verifica_combinacao();
		rodada++;
	}
	function verifica_combinacao(){
		//verifica na horizontal
		if(rodada>6){
			var pontos_confere = Array();
			console.log('entrou primeiro if');
		}
		var pontos_horizontalA = 0, pontos_horizontalB = 0, pontos_horizontalC = 0; 
		for(var i=1; i<=3; i++){
			pontos_horizontalA = pontos_horizontalA + matriz_jogo['a'][i];
			pontos_horizontalB = pontos_horizontalB + matriz_jogo['b'][i];
			pontos_horizontalC = pontos_horizontalC + matriz_jogo['c'][i];
		}
		
		ganhador(pontos_horizontalA);
		ganhador(pontos_horizontalB);
		ganhador(pontos_horizontalC);
		//verifica na vertical
		var pontos = 0;
		for(var l = 1; l<=3; l++){
			pontos = 0;
			pontos+= matriz_jogo['a'][l];
			pontos+= matriz_jogo['b'][l];
			pontos+= matriz_jogo['c'][l];
			//verificar velha
			if(rodada >6 && !ganhou){
				//inserindo no array;
				pontos_confere.push(pontos);
				console.log('entrou segundo if');

			}
			ganhador(pontos);
		}
		//verificar na diagonal
		pontos_diagonal1 = 0;
		pontos_diagonal1 = matriz_jogo['a'][1] + matriz_jogo['b'][2] + matriz_jogo['c'][3];
		ganhador(pontos_diagonal1);
		

		pontos_diagonal2 = 0;
		pontos_diagonal2 = matriz_jogo['a'][3] + matriz_jogo['b'][2] + matriz_jogo['c'][1];
		ganhador(pontos_diagonal2);
		if(rodada>6 && !ganhou){
			console.log('entrou terceiro if');

			pontos_confere.push(pontos_horizontalA);
			pontos_confere.push(pontos_horizontalB);
			pontos_confere.push(pontos_horizontalC);
			pontos_confere.push(pontos_diagonal1);
			pontos_confere.push(pontos_diagonal2);
			console.log(pontos_confere);

			velha(pontos_confere);
		}
		
	}
	function ganhador(pontos){
		if (pontos == -3) {
			var jogada_1 = $('#entrada_apelido_jogador_1').val();
			alert(jogada_1 +' é o vencedor');
			$('.jogada').off();
			ganhou = true;
		}
		else if (pontos == 3) {
			var jogada_2 = $('#entrada_apelido_jogador_2').val();
			alert(jogada_2 +' é o vencedor');
			$('.jogada').off();
			ganhou = true;
		}
	}
	function velha(pontos){
		//conta quantos tem 0 e -1
		var verificador_velha = 0;
		for(var i=0; i < pontos.length; i++){
			if(pontos[i] == 1 || pontos[i] == -1 || pontos[i] == 0){
				verificador_velha++;
			}
		}
		if(verificador_velha == pontos.length){
			alert('IIIIIIH RAPAIZ ninguém venceu, deu velha em ?!');
			$('.jogada').off();
		}
	}

});