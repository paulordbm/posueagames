function desenhar(x, y, w, h, style) {
	context.beginPath();
	if (style) {
		context.fillStyle = style;
	}
	context.rect(x, y, w, h);
	context.fill();
}

function desenharBorda() {
	context.beginPath();
	context.moveTo(bordaW,h); 
	context.lineTo(bordaW,dy+bordaW); 
	context.lineTo(w - bordaW,dy+bordaW); 
	context.lineTo(w - bordaW,h);
	context.lineTo(w,h);
	context.lineTo(w,dy);
	context.lineTo(0,dy);
	context.lineTo(0,h);
	context.closePath(); 
	context.fillStyle = "silver"; 
	context.fill();
}

function initBlocos(){
	var x,y;
	y=initDy;
	for(var i=0;i<qtdLinhas;i++){
		blocos[i]=[];
		x=initDx;
		for(var j=0;j<qtdColunas;j++){
			blocos[i][j] = new bloco(x,y,styles[i]);
			x+=blocoW;
		}
		y+=blocoH;
	}
}

function desenharBlocos(){
	for(var i=0;i<qtdLinhas;i++){
		for(var j=0;j<qtdColunas;j++){
			desenharBloco(blocos[i][j]);
		}
	}
}

function desenharBloco(bloco){
	desenhar(bloco.x, bloco.y, bloco.w, bloco.h, bloco.style);
}