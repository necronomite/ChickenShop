// SIDE ITEMS AND TABS COORDINATION
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

	function activateSideItem(for_value){
		$(".sidenav").find("a[for^='#tab']").removeClass("active");
		$(".sidenav").find("a[for="+for_value+"]").addClass("active");
	}
// SIDE ITEMS AND TABS COORDINATION


//PRODUCT SUPPLY MODAL
	

	function resetProductModal(){
		$("#product-modal .supplies .supply").not(".unclicked").find("i.item-close").click()
		// $(this).parent().parent().find(".modal-content input").val("")
		// M.updateTextFields();
	}
	
	$(document).on('click', "#product-modal .cancel", resetProductModal)

	$(document).on('change', "#product-modal .supplies .supply .spd-name input.autocomplete", function () {
		var product = $(this).val()
		var granparent = $(this).parent().parent()
		var heads_field = granparent.find(".spd-heads")
		if(product =='Chicken'){
			heads_field.removeClass("op0")
			granparent.addClass("chk-prod")
			lg("Chicken Detected")
		}else{
			granparent.removeClass("chk-prod")
			heads_field.addClass("op0")
		}	
		toggleChickenLabelPS()
	})
	$(document).on('click change keyup', "#product-modal input[type='number']", function () {
		var g = $(this).parent().parent()
		var qty = g.find(".spd-qty input").val()
		var rate = g.find(".spd-rate input").val()
		g.find(".spd-price").text((qty*rate).toFixed(2))
	})


	$(document).on('click', "#save-new-customer", function () {
		var name = $("#user-modal #new-cust")
		var debt = $("#user-modal #new-cust-debt")
		n = name.val()
		d = debt.val()
		console.log(n+"  "+d)
		
		$.ajax({
			url: host_php_url+"Add_New_Customer.php",
			type: "post",
			data: {name:n, amount: d},
			dataType: 'json',
			success: function(data){
				console.log("saved new customer "+n+"  "+d);
				name.val("")
				debt.val("")
				M.updateTextFields();
			},
			error: function(error){
				console.log(error);
			}
		});
	})

	

	function toggleChickenLabelPS(){
		var label = $("#product-modal .chk-label")
		if($("#product-modal .supplies .supply.chk-prod").length){
			label.removeClass("op0")
		}else{
			label.addClass("op0")
		}
	}
	

	$(document).on('click', "#product-modal .modal-content .item-close", function () {
		$(this).parent().remove();
		toggleChickenLabelPS();
	})

	$(document).on('click', "#product-modal .modal-content .supplies .supply.unclicked", function(){
		modclone = $(this).clone().append("")
		$(this).clone().appendTo("#product-modal .supplies")
		$(this).removeClass("unclicked")
		$('#product-modal .spd-name input.autocomplete').autocomplete({
	      data: product_autofills,
	      limit : 3
	    });
	    $('select').formSelect();	

	})

	$(document).on('click', "#product-modal #save-new-customer", function(){
		var has_blanks = false, has_repeats = false
		console.log("submitting supplies")
		console.log($(this))
		var d = new Date(M.Datepicker.getInstance(g("prodsp-dp")).date)
		var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())
		var name = $("#product-modal #supp-name").val()

		var items = []
		var prods = []
		$("#product-modal .supplies .supply").not(".unclicked").each(function(){
			var container = []
			var prod = $(this).find(".spd-name input").val()
			var qty = $(this).find(".spd-qty input").val()
			var rate = $(this).find(".spd-rate input").val()
			var heads = $(this).find(".spd-heads input").val()
			var price = $(this).find(".spd-price input").val()

			var ischicken = $(this).hasClass("chk-prod")
			var head = (ischicken)? heads: "0"

			container.push(prod)
			container.push(qty)
			container.push(rate)
			container.push(head)
			container.push(price)
			
			if(prod==''||qty==''||rate==''){
				console.log("failed : "+prod+'-'+qty+'-'+rate+"-"+head)
				has_blanks = true
			}else if(prods.indexOf(prod)!=-1){
				has_repeats = true
			}else{
				console.log("pushed : "+prod+'   '+qty+'   '+rate+"   "+head)
				prods.push(prod)
				items.push(container)
			}
			
		})

		

		
		if(prods.length){
			if(name==''){
				toast("Please enter supplier name")
			}else if(has_repeats){
				toast("Please remove duplicates")
			}else if(has_blanks){
				toast("Please fill in blank fields")
			}else if(!has_blanks&&!has_repeats){
				toast("Saved "+prods.length+"")
				closeM("#product-modal")
				resetProductModal()
				saveNewSupplies(date,name,items)
			}

		}else{
			toast("No entries were saved.")
			closeM("#product-modal")
			resetProductModal()
		}
		
		
	})


	function saveNewSupplies(date,name,items){
	console.log("saving new supplies "+date+" "+name)
	console.log(items)
	$.ajax({
		url: host_php_url+"Add_Transaction.php",
		type: "post",
		data: {date:date, supplier:name, items:JSON.stringify(items)},
		dataType: 'json',
		cache: false,
		success: function(data){
			console.log("data received --- "+data)
			// REFRESH EXPENSES DISPLAY


			$(".new-transaction .card-title").click()
			clearNewTransactionsForm();
		},
		error: function(error){
			console.log(error);
		}
	});
}
//PRODUCT SUPPLY MODAL



//DAILY TRANSACTIONS
	$(document).on('click', ".card-reveal .new-transaction .submit-btn", submitTransaction)

	$(document).on('change', "#tab1 .products-bought .select-wrapper select", function () {
		var product = $(this).find("option:selected").text();
		var granparent = $(this).parent().parent()
		var heads_field = granparent.parent().find(".chk-heads")

		if(product=="Chicken"){
			granparent.addClass("chk-prod")
			heads_field.removeClass("op0")
		}else{
			granparent.removeClass("chk-prod")
			heads_field.addClass("op0")
		}

		toggleChickenLabel()
	});

	function toggleExes(){
		if($(".card-reveal .product-field").not(".another-product").length>1){
			$(".card-reveal .products-bought").addClass("multiple-products");
		}else{
			$(".card-reveal .products-bought").removeClass("multiple-products");
		}
	}
	function toggleChickenLabel(){
		var label = $(".products-bought-label .chk-label")
		if($(".products-bought .prod-name.chk-prod").length){
			label.show()
		}else{
			label.hide()
		}
	}

	$(document).on('click', ".card-reveal .product-field .item-close", function () {
		$(this).parent().remove();
		toggleChickenLabel();
		toggleExes();
	})


	function clearNewTransactionsForm(){
		$("#tab1 .card-reveal .products-bought i.item-close").click();
		$("#tab1 .card-reveal .products-bought .another-product").click();
	}


	$(document).on('click', ".card-reveal .products-bought .product-field.another-product", function () {
		var copy = ""
		+		"<div class='product-field another-product fs'>"
		+			"<div class='prod-name input-field col w160'>"
		+		    	"<select>"
		+		      		"<option disabled selected>Another Product</option>"
		+			  	"</select>"
		+			"</div>"
		+		"</div>"


		$(".card-reveal .products-bought").append(copy);
		$(this).removeClass("another-product");
		$(this).find("option:first").text("Choose Product")
		$(this).find("select").append(product_selects)
		$('select').formSelect();


		var a = "" 
		+"		<div class='prod-qty w80 fs'>"
	    +"			<input type='number' min='0' max='1000' value='1'>"
	    +"		</div>"
	    +"		<div class='prod-rate w80 fs'>"
	    +"			<input type='number' min='0' max='1000' value='1'>"
	    +"		</div>"
	    +"		<div class='chk-heads fs op0'>"
	    +"			<input type='number' min='0' max='1000' value='1'>"
	    +"		</div>"
	    +"		<i class='material-icons right item-close c-hov grow fm'>close</i>"


	    $(this).append(a);
		toggleExes()
	});
//DAILY TRANSACTIONS



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
				
		},
		error: function(error){
			console.log(error);
		}
		
	});
}

function buildTransactions(data){
	$("#daily-transactions-customers").html("")
	$("#daily-transactions-products").html("")
	var sales = 0
	var cash_received = 0
	var sales2 = 0
	var cash_received2 = 0
	console.log("transactions")
	if(data.customers.length){
		$("#transactions-form").removeClass("no-transactions")
	}else{
		$("#transactions-form").addClass("no-transactions")
	}
	
	console.log(data)
	
	cdata = data.customers
	for(i1 in cdata){
		var dom = ""
		var amount_paid = cdata[i1]['amount_paid']
		var balance = cdata[i1]['balance']
		var id = cdata[i1]['id']
		var name = cdata[i1]['name']
		var transaction_date = cdata[i1]['transaction_date']
		var total = cdata[i1]['total']
		var items = cdata[i1]['items']

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
		+"      		<span class='col s3'>Product Name</span>"
		+"      		<span class='col s2'>Weight</span>"
		+"      		<span class='col s3 fm'>Php/kg</span>"
		+"      		<span class='col s2'>Chk. Heads</span>"
		+"      		<span class='col s2 fe'>Price</span>"
		+"      	</div>"
		+"      	<div class='sold-items'>"


	    for(i2 in items){
	    	var chicken_head = items[i2]['chicken_head']
	       	var cost = items[i2]['cost']
			var name = items[i2]['name']
			var ops = items[i2]['ops']
			var price = items[i2]['price']
			var quantity = items[i2]['quantity']
			var tid = items[i2]['tid']
			var chk = (chicken_head=="0")? "": chicken_head

			dom+=""
			+"	      	  <div class='sold-item row'>"
			+"	      		<span class='col s3'>"+name+"</span>"
			+"	      		<span class='col s2'>"+quantity+" kg</span>"
			+"	      		<span class='col s3 fm'>"+cost+"</span>"
			+"	      		<span class='col s2'>"+chk+"</span>"
			+"	      		<span class='col s2 fe'>"+price+"</span>"
			+"	      	  </div>"
		}

		dom+=""
		+"	        </div>"
		+"      </div>"
		+"    </li>"

		$("#daily-transactions-customers").append(dom);
	}
	$("#tr-cust").text(cdata.length)
	$("#tr-total").text(parseFloat(sales).toFixed(2))
	$("#tr-cash").text(parseFloat(cash_received).toFixed(2))




	pdata = data.products
	for(i1 in pdata){
		var dom = ""
		var weight = pdata[i1]['quantity']
		var name = pdata[i1]['name']
		var id = pdata[i1]['id']
		var head = pdata[i1]['head']		
		var total_price = pdata[i1]['cost']
		var buyers = pdata[i1]['buyers']

		var ischicken = (name=="Chicken")
		var insert1 = (ischicken ? "Heads" : "");

		sales2+=parseFloat(total_price)

		

		dom+=""
		+"	 <li>"
		+"      <div class='collapsible-header row tr-item-title'>"
		+"      	<span class='col s8'>"+name+"</span>"
		+"      	<span class='col s2 fc'>"+weight+" kg</span>"
		+"      	<span class='col s2 fc'>"+total_price+"</span>"
		+"    	</div>"
		+"      <div class='collapsible-body'>"
		+"      	<div class='row blk'>"
		+"	      		<span class='p-name col s3'>Customer</span>"
		+"	      		<span class='p-name col s2 fe'>Bought</span>"
		+"	      		<span class='p-name col s3 fm'>Rate</span>"
		+"	      		<span class='p-name col s2 fm'>"+insert1+"</span>"
		+"	      		<span class='p-name col s2 fe'>Price</span>"
		+"      	</div>"
		+"      	<div class='buyers'>"


	    for(i2 in buyers){
	       	var chicken_head = buyers[i2]['chicken_head']
			var cost = buyers[i2]['cost']
			var name = buyers[i2]['name']
			var quantity = buyers[i2]['quantity']
			var rate = buyers[i2]['rate']
			var insert2 = (ischicken ? chicken_head : "");


			dom+=""
			+"	      	  <div class='buyer row'>"
			+"	      		<span class='p-name col s3'>"+name+"</span>"
			+"	      		<span class='p-name col s2 fe'>"+quantity+" kg</span>"
			+"	      		<span class='p-name col s3 fm'>"+rate+"</span>"
			+"	      		<span class='p-name col s2 fm'>"+insert2+"</span>"
			+"	      		<span class='p-name col s2 fe'>"+cost+"</span>"
			+"	      	  </div>"
		}

		dom+=""
		+"	        </div>"
		+"      </div>"
		+"    </li>"

		$("#daily-transactions-products").append(dom);
	}
}


function submitTransaction(){
	var d = new Date(M.Datepicker.getInstance(g("newt-dp")).date)
	var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())

	var name = $(".card-reveal .new-transaction #customer-name").val()
	var paid = $(".card-reveal .new-transaction #customer-payment").val()
	var invoice = $(".card-reveal .new-transaction #new-invoice").val()

	var items = []
	var prods = []
	$(".card-reveal .new-transaction .product-field").not(".another-product").each(function(){
		var container = []
		var prod = $(this).find(".select-wrapper select").val() //modified by sanz, dynamically added selects does not have an outer DIV element with a class "prod-name"
		var qty = $(this).find(".prod-qty input").val()
		var rate = $(this).find(".prod-rate input").val()
		var chicken_head = $(this).find(".chk-heads input").val()
		var ischicken = $(this).find(".prod-name").hasClass("chk-prod")
		chicken_head = (ischicken)? chicken_head: "0"

		
		container.push(prod)
		container.push(qty) //weight in kg
		container.push(rate)
		container.push(chicken_head)
		if(prod==null){
			console.log("failed : "+prod+'   '+qty+'   '+rate+"   "+chicken_head)
			toast("Please fill in all fields")
			return false
		}else if(prods.indexOf(prod)!=-1){
			console.log("product"+prod+" previously detected")
			toast("Please remove duplicate entries")
			return false
		}else{
			console.log("pushed : "+prod+'   '+qty+'   '+rate+"   "+chicken_head)
			prods.push(prod)
			items.push(container)
		}
		
	})
	console.log(items)
	saveNewTransaction(date,name,paid,invoice,items)
}




function saveNewTransaction(date,name,paid,invoice,items){
	// M.Datepicker.getInstance(g("inv-dp"))
	var d = new Date(M.Datepicker.getInstance(g("newt-dp")).date)
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
				product_names = []
				for(p in data["items"]){
					var id = data["items"][p]["id"]
					var name = data["items"][p]["name"]
					product_names[name] = null
					o = "<option value='"+id+"' >"+name+"</option>"
					sel+=o
				}
				product_autofills = product_names
				product_selects = sel
				$(".product-field").not(".another-product").find(".prod-name select").each(function(){
					$(this).empty();
					$(this).append("<option disabled selected>Choose Product</option>")
					$(this).append(sel)
				})
				lg("The products list has been appended to all selects")
			}
			if(data["customers"]){
				customer_names = []
				for(c in data['customers']){
					var key = data['customers'][c]['name']
					var value = null
					customer_names[key]=value
				}
				customer_autofills = customer_names


				$('.customer-info #customer-name.autocomplete').autocomplete({
			      data: customer_names,
			      limit : 3
			    });
			}
			if(data["suppliers"]){
				supplier_names = []
				for(s in data['suppliers']){
					var key = data['suppliers'][s]['name']
					var value = null
					supplier_names[key]=value
				}
				supplier_autofills = supplier_names


				$('#product-modal .suppliers-name input.autocomplete').autocomplete({
			      data: supplier_autofills,
			      limit : 3
			    });
			}
			
			$('select').formSelect();				
		},
		error: function(error){
			console.log(error);
		}
		
	});
}




expenses_counter = 0
$(document).on('click', "#expenses-modal .modal-content .expenses .expense.unclicked", function(){
	lg("hello")
	$(this).clone().appendTo("#expenses-modal .modal-content .expenses")
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

$(document).on('click', "#expenses-modal .done-btn", function(){
	var d = new Date(M.Datepicker.getInstance(g("exp-dp")).date)
	var date = d.getFullYear()+"-"+a(d.getMonth()+1)+"-"+a(d.getDate())

	var expenses = []
	$('#expenses-modal .modal-content .expenses .expense').not(".unclicked").each(function(){
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