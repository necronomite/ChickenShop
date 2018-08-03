var host_php_url = "php/";
var data1
var product_selects=""
var customer_autofills=[]
var product_autofills=[]
var supplier_autofills=[]
var customer_history=[]
function a(s){
	return ((s<10) ? "0"+s : ""+s);
}
function b(s){
	var word
	if(s=="01"){ 
		word = "Jan"
	}else if(s=="02"){
		word = "Feb"
	}else if(s=="03"){
		word = "Mar"
	}else if(s=="04"){
		word = "Apr"
	}else if(s=="05"){
		word = "May"
	}else if(s=="06"){
		word = "Jun"
	}else if(s=="07"){
		word = "Jul"
	}else if(s=="08"){
		word = "Aug"
	}else if(s=="09"){
		word = "Sep"
	}else if(s=="10"){
		word = "Oct"
	}else if(s=="11"){
		word = "Nov"
	}else if(s=="12"){
		word = "Dec"
	}else{
		word = ""
	}
	return word;
}

function dateFormat(d){
	return d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())
}
function lg(item){
	console.log(item)
}
function g(item){
	return document.getElementById(item)
}

function toast(msg){
	M.toast({html: msg})
}

function getM(elem){
	return M.Modal.getInstance(elem);
}
function getDP(elem){
	return M.Datepicker.getInstance(elem);
}

function closeM(string){
	getM($(string)).close()
}

function getDate(string){
	return dateFormat(new Date(getDP(g(string)).date))
}

// TODO: create date formatting function. copy the code from custom.js