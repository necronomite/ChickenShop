var host_php_url = "php/";
var data1
var product_selects=""
var customer_autofills=[]
var product_autofills=[]
var supplier_autofills=[]
function a(s){
	return ((s<10) ? "0"+s : ""+s);
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

function closeM(string){
	getM($(string)).close()
}

// TODO: create date formatting function. copy the code from custom.js