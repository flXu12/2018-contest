/*
	# 初始化时，要在4x4的方格中随机生成两个2，并且这两个2不能在同一个位置
	# 键盘上下左右控制方块移动。需要判断哪个方向上是不能移动的（无效操作）
	# 数值相同方块合并
	# 数值合并后，颜色改变。不同数字对应的颜色变化规律(由类控制)
	# 每次按下有效按键之后（合并完成之后），会在剩余的空格中随机生成一个2（无效操作不会有合并与颜色变化，更不会产生2）
	# 判输：水平与垂直方向均无相同可消除且无空格
	# 判赢：有2048
	# 分数起始为0，每次合并后，加上合并后的值
*/

var arr=[]; //存放4x4方格的元素
var score=0;
var moveable=false; //判断某移动方向是否为有效操作

window.onload=function(){
	console.log("aaa");
	init();
}

function init(){
	arr=[];
	score=0;
	moveable=false;
	$("#score").html(0);
	//存放数字的二维数组
	for(var i=0;i<4;i++){
		arr[i]=[];
		for(var j=0;j<4;j++){
			arr[i][j]={}; //对象表示
			arr[i][j].value=0; //数值存在value属性中，默认为0
		}
	}

	//随机生成两个位置不重复的2
	randomCreate();
	randomCreate();
}

function randomCreate(){
	var i;
	var j;
	do{
		i=Math.floor(Math.random()*4);
		j=Math.floor(Math.random()*4);
	}while(arr[i][j].value!=0);  //在空白位置随机生成一个2

	arr[i][j].value=2;
	drawCell(i,j);
}

function drawCell(col,row){
	//console.log(arr[col][row].value);
	var cell='<div class="number_plane p'+col+row+'"><div class="number n2"><span>'+arr[col][row].value+'</span></div></div>';
	//document.getElementById("c"+i+j).innerHTML=arr[i][j].value;
	$('.grid-plane').append(cell);
}

//键盘事件 ??死循环
document.onkeydown=function(event){
	console.log("keydown");
	var e=event||window.event;
	var keyCode=e.keyCode;
	switch(keyCode){
		case 37: //left
			moveable=false;
			moveLeft();
			isLose();
			break;
		case 38: //up
			moveable=false;
			moveUp();
			isLose();
			break;
		case 39: //right
			moveable=false;
			moveRight();
			isLose();
			break;
		case 40: //down
			moveable=false;
			moveDown();
			isLose();
			break;
	}
}

function newCell(){
	var ind;
	var col;
	var row;
	var blankArr=[];
	if(!moveable){ //该方向不可再移动
		return;
	}

	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(arr[i][j].value==0){
				blankArr.push([i,j]); //记录无数字空格位置
			}
		}
	}

	if(blankArr.length>0){ //存在空格
		//随机在空格位置生成一个2
		//randomCreate();
		ind=Math.floor(Math.random()*blankArr.length);
		col=blankArr[ind][0];
		row=blankArr[ind][1];
		arr[col][row].value=2;
		drawCell(col,row);
	}else{ //不存在空格，则不会生成2
		return;
	}
}

function moveUp(){
	var k;
	var n;
	for(var i=0;i<4;i++){
		n=0;
		for(var j=0;j<4;j++){
			console.log(arr[i][j].value);
			if(arr[i][j].value==0){
				continue;
			}
			k=j-1;
			aa:
			while(k>=n){
				if(arr[i][k].value==0){ //当前元素的上一行为空
					if(k==n ||(arr[i][k-1].value!=0 && arr[i][k-1].value!=arr[i][j].value)){//除去空元素不存在相邻相等情况
						moveCell(i,j,i,k);
					}
					k--;
				}else{
					if(arr[i][k].value==arr[i][j].value){ //第i列相邻行元素相同，合并
						mergeNumber(i,j,i,k);
						n++;
					}
					break aa; //跳出while
				}
			}
		}
	}
	newCell();
}

function moveDown(){
	var k;
	var n;
	for(var i=0;i<4;i++){
		n=3;
		for(var j=3;j>=0;j--){
			if(arr[i][j].value==0){
				continue;
			}
			k=j+1;
			aa:
			while(k<=n){
				if(arr[i][k].value==0){ //当前元素的下一行为空
					if(k==n || (arr[i][k+1].value!=0 && arr[i][k+1].value!=arr[i][j].value)){ //除去空元素不存在相邻相等情况
						moveCell(i,j,i,k);
					}
					k++;
				}else{
					if(arr[i][k].value==arr[i][j].value){ //第i列相邻行元素相同，合并
						mergeNumber(i,j,i,k);
						n--;
					}
					break aa; //跳出while循环
				}
			}
		}
	}
	newCell();
}

function moveLeft(){
	var k;
	var n;
	for(var j=0;j<4;j++){
		n=0;
		for(var i=0;i<4;i++){
			if(arr[i][j].value==0){
				continue;
			}
			k=i-1;
			aa:
			while(k>=n){
				if(arr[k][j].value==0){
					if(k==n || (arr[k-1][j].value!=0&&arr[k-1][j].value!=arr[i][j].value)){
						moveCell(i,j,k,j);
					}
					k--;
				}else{
					if(arr[k][j].value==arr[i][j].value){
						mergeNumber(i,j,k,j);
						n++;
					}
					break aa;
				}
			}
		}
	}
	newCell();
}

function moveRight(){
	var k;
	var n;
	for(var j=0;j<4;j++){
		n=3;
		for(var i=3;i>=0;i--){
			if(arr[i][j].value==0){
				continue;
			}
			k=i+1;
			aa:
			while(k<=n){
				if(arr[k][j].value==0){
					if(k==n || (arr[k+1][j].value!=0&&arr[k+1][j].value!=arr[i][j].value)){
						moveCell(i,j,k,j);
					}
					k++;
				}else{
					if(arr[k][j].value==arr[i][j].value){
						mergeNumber(i,j,k,j);
						n--;
					}
					break aa;
				}
			}
		}
	}
	newCell();
}

function moveCell(col1,row1,col2,row2){
	arr[col2][row2].value=arr[col1][row1].value;
	arr[col1][row1].value=0;
	moveable=true;
	$('.p'+col1+row1).removeClass('p'+col1+row1).addClass('p'+col2+row2);
}

function mergeNumber(col1,row1,col2,row2){
	arr[col2][row2].value *=2;
	arr[col1][row1].value=0;
	moveable=true;
	$(".p"+col2+row2).addClass("noNeed");
	var target=$(".p"+col1+row1).removeClass("p"+col1+row1).addClass("p"+col2+row2).find(".number");
	setTimeout(function(){
		$(".noNeed").remove();
		target.addClass("n"+arr[col2][row2].value).removeClass("n"+arr[col2][row2].value/2).find('span').html(arr[col2][row2].value);
	},200);
	score += arr[col2][row2].value;
	$("#score").html(score);
	if(arr[col2][row2].value==2048){
		alert("恭喜，你赢啦！");
	}
}

function isLose(){ //判输
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(arr[i][j].value==0){ //存在方块数字为0,表明游戏还可继续
				return false;
			}
			if(arr[i+1] && arr[i+1][j].value==arr[i][j].value){ //同一列存在相邻元素可合并，表明游戏可继续
				return false;
			}
			if(arr[i][j+1].value==arr[i][j].value && arr[i][j+1].value!=undefined){ //同一行存在相邻元素可合并，表明游戏可继续
				return false;
			}
		}
	}
	//非以上三种情况，可判输
	alert("亲，你输啦！");
	return true;
}
