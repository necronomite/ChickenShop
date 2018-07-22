var host_php_url = "php/";
var data1
var psels=""

function lg(item){
	console.log(item)
}
function g(item){
	return document.getElementById(item)
}
$(document).on('click', "a[for^='#tab']", function () {
	value = $(this).attr("for")
	activateSideItem(value);
	$("a[href^='"+value+"']").click();
	var name = value.replace("#","");
	$('ul.tabs').tabs('select' , name);
});

$(document).on('click', "a[href^='#tab']", function () {
	value = $(this).attr("href");
	activateSideItem(value);
});

$(document).on('change', "#tab1 .products-bought .select-wrapper select", function () {
	var product = $(this).find("option:selected").text();
	var product = $(this).find("option:selected").text();
	$("")
	if(product=="Chicken"){
		lg("we")
	}
});



function activateSideItem(for_value){
	$(".sidenav").find("a[for^='#tab']").removeClass("active");
	$(".sidenav").find("a[for="+for_value+"]").addClass("active");
}

function toggleExes(){
	if($(".card-reveal .product-field").not(".another-product").length>1){
		$(".card-reveal .products-bought").addClass("multiple-products");
	}else{
		$(".card-reveal .products-bought").removeClass("multiple-products");
	}
}

$(document).on('click', ".card-reveal .product-field .item-close", function () {
	$(this).parent().remove();
	toggleExes();
})

function clearNewTransactionsForm(){
	$("#tab1 .card-reveal .products-bought i.item-close").click();
	$("#tab1 .card-reveal .products-bought .another-product").click();
}


$(document).on('click', ".card-reveal .products-bought .product-field.another-product", function () {
	var copy = ""
	+		"<div class='product-field another-product fs'>"
	+			"<div class='prod-name input-field col'>"
	+		    	"<select>"
	+		      		"<option disabled selected>Another Product</option>"
	+			  	"</select>"
	+			"</div>"
	+		"</div>"


	$(".card-reveal .products-bought").append(copy);
	$(this).removeClass("another-product");
	$(this).find("option:first").text("Choose Product")
	$(this).find("select").append(psels)
	$('select').formSelect();


	var a = "" 
	+"		<div class='prod-qty w80 fs'>"
    +"			<input type='number' min='0' max='1000' value='1'>"
    +"		</div>"
    +"		<div class='prod-rate w80 fs'>"
    +"			<input type='number' min='0' max='1000' value='1'>"
    +"		</div>"
    +"		<div class='chk-heads fs'>"
    +"			<input type='number' min='0' max='1000' value='1'>"
    +"		</div>"
    +"		<i class='material-icons right item-close c-hov grow fm'>close</i>"


    $(this).append(a);
	toggleExes()
});


function a(s){
	return ((s<10) ? "0"+s : ""+s);
}
function queryTransactions(){
	// M.Datepicker.getInstance(g("inv-dp"))
	var d = new Date(M.Datepicker.getInstance(g("inv-dp")).date)
	var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())
	console.log("Date used for query:" +date)
	$.ajax({
		url: host_php_url+"Get_Transactions.php",
		type: "post",
		data: {date:date},
		dataType: 'json',
		success: function(data){
			console.log("queryTransactions");
			console.log(data);	
			buildTransactions(data)
			
				// for(var trans in data){
				// 	var name = trans['name'];
				// 	for(var item in trans['items']){
				// 			console.log(item['name']);
				// 	}
				// }
			
			// $.each(data, function (key, value){
			// 	value['username']
			// 	value['name']
			// });
				
		},
		error: function(error){
			console.log(error);
		}
		
	});

}

function buildTransactions(data){
	$("#transaction-items").html("")
	var sales = 0
	var cash_received = 0
	console.log("transactions")
	data1 = data
	console.log(data)
	$("#transactions-form").removeClass("no-transactions")
	for(i1 in data){
		var dom = ""
		var amount_paid = data[i1]['amount_paid']
		var balance = data[i1]['balance']
		var id = data[i1]['id']
		var name = data[i1]['name']
		var transaction_date = data[i1]['transaction_date']
		var total = data[i1]['total']
		var items = data[i1]['items']

		sales+=parseFloat(total)
		cash_received+=parseFloat(amount_paid)

		dom+=""
		+"	 <li>"
		+"      <div class='collapsible-header row tr-item-title'>"
		+"      	<span class='col s8 tr-name'>"+name+"</span>"
		+"      	<span class='col s2 tr-cost fe'>"+total+"</span>"
		+"      	<span class='col s2 tr-paid fe'>"+amount_paid+"</span>"
		+"    	</div>"
		+"      <div class='collapsible-body'>"
		+"      	<div class='row blk'>"
		+"      		<span class='p-name col s4'>Product Name</span>"
		+"      		<span class='p-quantity col s2'>Quantity</span>"
		+"      		<span class='p-unit col s2'>Unit</span>"
		+"      		<span class='p-cost col s4 fe'>Cost</span>"
		+"      	</div>"
		+"      	<div class='sold-items'>"


	    for(i2 in items){
	       	var cost = items[i2]['cost']
			var name = items[i2]['name']
			var ops = items[i2]['ops']
			var price = items[i2]['price']
			var quantity = items[i2]['quantity']
			var tid = items[i2]['tid']
			var unit = items[i2]['unit']

			dom+=""
			+"	      	  <div class='sold-item row'>"
			+"	      		<span class='p-name col s4'>"+name+"</span>"
			+"	      		<span class='p-quantity col s2'>"+quantity+"</span>"
			+"	      		<span class='p-unit col s2'>"+unit+"</span>"
			+"	      		<span class='p-cost col s4 fe'>"+cost+"</span>"
			+"	      	  </div>"
		}

		dom+=""
		+"	        </div>"
		+"      </div>"
		+"    </li>"

		$("#transaction-items").append(dom);
	}
	$("#tr-cust").text(data.length)
	$("#tr-total").text(parseFloat(sales).toFixed(2))
	$("#tr-cash").text(parseFloat(cash_received).toFixed(2))
}

$(document).on('click', ".card-reveal .new-transaction .submit-btn", submitTransaction)
function submitTransaction(){
	var d = new Date(M.Datepicker.getInstance(g("newt-dp")).date)
	var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())

	var name = $(".card-reveal .new-transaction #customer-name").val()
	var paid = $(".card-reveal .new-transaction #customer-payment").val()
	var invoice = $(".card-reveal .new-transaction #new-invoice").val()
	// NOTE Balance actually is optional, it can be used to add old debt

	var items = []
	$(".card-reveal .new-transaction .product-field").not(".another-product").each(function(){
		var container = []
		var prod = $(this).find(".select-wrapper select").val() //modified by sanz, dynamically added selects does not have an outer DIV element with a class "prod-name"
		var qty = $(this).find(".prod-qty input").val()
		var rate = $(this).find(".prod-rate input").val()
		var chicken_head = 0

		console.log("form-items : "+prod+'..'+qty+'...'+unit)

		container.push(prod)
		container.push(qty)
		container.push(unit)
		container.push(chicken_head)
		items.push(container)
	})
	console.log(items)


	saveNewTransaction(date,name,paid,invoice,items)
}



function saveNewTransaction(date,name,paid,invoice,items){
	// M.Datepicker.getInstance(g("inv-dp"))
	var d = new Date(M.Datepicker.getInstance(g("inv-dp")).date)
	var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())

	console.log(items)// next set of items has UNDEFINED value for item_id :(, this leads to insertion problems for items
	// items = [[1, 2, 'kg'],[2, 10, 'pcs']] //just for testing
	$.ajax({
		url: host_php_url+"Add_Transaction.php",
		type: "post",
		data: {date:date, name:name, amount:paid, invoice_id:invoice, items:JSON.stringify(items)},
		dataType: 'json',
		cache: false,
		success: function(data){
			console.log("data received --- "+data)
			console.log("saving was a success")
			queryTransactions()
			$(".new-transaction .card-title").click()
			clearNewTransactionsForm();

		},
		error: function(error){
			console.log(error);
		}
		
	});

}

function queryInit(){
	$.ajax({
		url: host_php_url+"Get_Initial_Data.php",
		type: "post",
		data: {},
		dataType: 'json',
		success: function(data){
			console.log("Successfully Retrieved Customer and Products List");
			console.log(data);	

			var sel=""
			if(data["items"]){
				for(p in data["items"]){
					var id = data["items"][p]["id"]
					var name = data["items"][p]["name"]
					o = "<option value='"+id+"' >"+name+"</option>"
					sel+=o
				}
				psels = sel
				$(".product-field").not(".another-product").find(".prod-name select").each(function(){
					$(this).empty();
					$(this).append("<option disabled selected>Choose Product</option>")
					$(this).append(sel)
				})
				lg("The products list has been appended to all selects")
			}

			customer_names = []
			for(customer in data['customers']){
				key = data['customers'][customer]['name']
				value = null
				customer_names[key]=value
			}


			$('.customer-info #customer-name.autocomplete').autocomplete({
		      data: customer_names,
		      limit : 3
		    });
			


			$('select').formSelect();
			// buildTransactions(data)
			
				// for(var trans in data){
				// 	var name = trans['name'];
				// 	for(var item in trans['items']){
				// 			console.log(item['name']);
				// 	}
				// }
			
			// $.each(data, function (key, value){
			// 	value['username']
			// 	value['name']
			// });
				
		},
		error: function(error){
			console.log(error);
		}
		
	});
}



expenses_counter = 0
$(document).on('click', "#expenses_modal .modal-content .expenses .expense.unclicked", function(){
	lg("hello")
	$(this).clone().appendTo("#expenses_modal .modal-content .expenses")
	$(this).removeClass("unclicked")

	var expname = "expense-name-"+expenses_counter
	var exppay = "expense-payment-"+expenses_counter
	lg(expname+" "+exppay)

	expenses_counter+=1
	$(this).find(".col.s4 input[type='text']").attr("id",expname)
	$(this).find(".col.s4 label").attr("for",expname)
	$(this).find(".col.s3 input[type='number']").attr("id",exppay)
	$(this).find(".col.s3 label").attr("for",exppay)
	M.updateTextFields();
	
})

$(document).on('click', "#expenses_modal .done-btn", function(){
	var d = new Date(M.Datepicker.getInstance(g("exp-dp")).date)
	var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())

	var expenses = []
	$('#expenses_modal .modal-content .expenses .expense').not(".unclicked").each(function(){
		var container = []
		var name = $(this).find(".exp-name").val()
		var pay = $(this).find(".exp-pay").val()
		console.log(name)
		console.log(pay)
		container.push(name)
		container.push(pay)
		expenses.push(container)
	})


	saveNewExpenses(date,expenses)


})


function saveNewExpenses(date,expenses){

	console.log(expenses)// next set of items has UNDEFINED value for item_id :(, this leads to insertion problems for items
	// items = [[1, 2, 'kg'],[2, 10, 'pcs']] //just for testing
	$.ajax({
		url: host_php_url+"Add_New_Expenses.php",
		type: "post",
		data: {date:date, expenses:JSON.stringify(expenses)},
		dataType: 'json',
		cache: false,
		success: function(data){
			console.log("data received --- "+data)
			queryTransactions()

		},
		error: function(error){
			console.log(error);
		}
		
	});

}

function queryDebts(){
	$.ajax({
		url: host_php_url+"Get_Customers_Debts.php",
		type: "post",
		data: {},
		dataType: 'json',
		success: function(data){
			console.log("Received debts data");
			console.log(data);	


			// for (i in data1){
			// 	for(ii in data1[i]){
			// 		console.log (data1[i][ii])
			// 	}
			// 	console.log (data1[i])
			// }


				
		},
		error: function(error){
			console.log(error);
		}
		
	});
}