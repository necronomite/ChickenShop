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
		$("#product-modal .suppliers-name input").val("")
		$("#save-edit-supply").addClass("hidden")
		$("#delete-supply").addClass("hidden")
		$("#save-new-supply").removeClass("hidden")
	  	M.updateTextFields();
	}
	
	$(document).on('click', "#product-modal .cancel", resetProductModal)

	$(document).on('change click', "#product-modal .supplies .supply .spd-name input.autocomplete", function () {
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

	$(document).on('click', "#product-modal #save-new-supply", function(){
		var has_blanks = false, has_repeats = false
		console.log("submitting supplies")
		console.log($(this))
		var date = getDate("prodsp-dp")
		var name = $("#product-modal #supp-name").val()

		var items = []
		var prods = []
		$("#product-modal .supplies .supply").not(".unclicked").each(function(){
			var container = []
			var prod = $(this).find(".spd-name input").val()
			var qty = $(this).find(".spd-qty input").val()
			var rate = $(this).find(".spd-rate input").val()
			var heads = $(this).find(".spd-heads input").val()

			var ischicken = $(this).hasClass("chk-prod")
			var head = (ischicken)? heads: "0"

			container.push(prod)
			container.push(qty)
			container.push(rate)
			container.push(head)
			
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
				toast("Saved "+prods.length+" supplies")
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
			url: host_php_url+"Add_Product_Supply.php",
			type: "post",
			data: {date:date, supplier:name, items:JSON.stringify(items)},
			dataType: 'json',
			cache: false,
			success: function(data){
				console.log("data received --- "+data)
				queryExpenses()

				$(".new-transaction .card-title").click()
				clearNewTransactionsForm();
			},
			error: function(error){
				console.log(error);
			}
		});
	}
//PRODUCT SUPPLY MODAL



//DAILY TRANSACTIONS (EDIT + ADD)
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

	$(document).on('click change keyup', "#tab1 .card-reveal .product-field input[type='number']", function () {
		var g = $(this).parent().parent()
		var qty = g.find(".prod-qty input").val()
		var rate = g.find(".prod-rate input").val()
		g.find(".prod-price").text((qty*rate).toFixed(2))
		computeTransactionTotal()
	})

	function computeTransactionTotal(){
		$("#tab1 #transactions-form .card-reveal div .content").each(function(){
			var total = 0
			$(this).find(".products-bought .product-field .prod-price").each(function(){
				var value = parseFloat($(this).text())
				total+=value
				// parseFloat(sales).toFixed(2)
			})
			console.log("total is "+total)
			total = parseFloat(total.toFixed(2)).toLocaleString('en')
			$(this).parent().find(".buttons .transaction-total").html("₱"+total)
		})
	}

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
			label.removeClass("op0")
		}else{
			label.addClass("op0")
		}
	}

	$(document).on('click', ".card-reveal .product-field .item-close", function () {
		$(this).parent().remove();
		toggleChickenLabel();
		toggleExes();
	})

	$(document).on('click', ".card-reveal .t-close", clearNewTransactionsForm)

	function clearNewTransactionsForm(){
		$("#tab1 .card-reveal .products-bought i.item-close").click();
		$("#tab1 .card-reveal .products-bought .another-product").click();
		$("#tab1 .card-reveal .customer-info input").val("")
		$(".card-reveal .edit-transaction").addClass("hidden")
		$(".card-reveal .new-transaction").removeClass("hidden")
		M.updateTextFields()
	}


	$(document).on('click', ".card-reveal .products-bought .product-field.another-product", function () {
		var copy = ""
		+		"<div class='product-field another-product fs'>"
		+			"<div class='prod-name input-field col w150'>"
		+		    	"<select>"
		+		      		"<option disabled selected>Another Product</option>"
		+			  	"</select>"
		+			"</div>"
		+		"</div>"


		$(this).parent().append(copy);
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
	    +"      <div class='w70 fe prod-price fac'></div>"
	    +"		<i class='material-icons right item-close c-hov grow fm'>close</i>"


	    $(this).append(a);
	    console.log("autoclicking")
	    $(this).find(".prod-rate input").click()
		toggleExes()
	});

//DAILY TRANSACTIONS

//TRANSACTIONS PART 2

	$(document).on('click', ".card-reveal .edit-transaction .submit-btn", submitEditedTransaction)

	$(document).on('click', "#cust-tab .collp-edit-btn span", function () {
		$(".card-reveal .edit-transaction").removeClass("hidden")
		$(".card-reveal .new-transaction").addClass("hidden")

		$("#transactions-form .activator").click()
		var tid = $(this).parent().parent().parent().attr("value")
		console.log("finding id no. "+tid )
		var ctrans = queried_transactions.customers
		var match

		for(t in ctrans){
			item = ctrans[t]
			if(item["id"]==tid){
				match = item
				break
			}
		}
		console.log("match found")
		console.log(match)

		var name  = match["name"]
		var invoice = match["invoice"]
		var id = match["id"]
		var date = match["transaction_date"]
		var total = match["total"]
		var payment = match["amount_paid"]
		var items = match["items"]

		$("#edit-name").val(name)
		$("#edit-invoice").val(invoice)
		$("#edit-payment").val(payment)
		$("#edit-tid").val(tid)

	  	var options = 
		{
			"setDefaultDate": true,
			"defaultDate" : new Date(date)
		}
		console.log("----------")
		var elems = document.querySelectorAll('#editt-dp');
	  	M.Datepicker.init(elems, options);
	  	$("#tab1 .card-reveal .products-bought i.item-close").click();
	  	for (i = 0; i < items.length; i++) {
	  		$(".edit-transaction .another-product").click()
	  	}
	  	i = 0
	  	console.log(items)
	  	console.log("----------")
	  	$(".card-reveal .edit-transaction .product-field").not(".another-product").each(function(){
	  		console.log(item[i])
	  		// $(this).find(".prod-name input").val(items[i]["name"])
	  		$(this).find(".prod-name ul.select-dropdown li").each(function(){
	  			var zxc = $(this).find("span").text()
	  			if(zxc == items[i]["name"]){
					$(this).click()
				}
	  		})
	  		
	  		$(this).find(".prod-qty input").val(items[i]["quantity"]).click()
	  		$(this).find(".prod-rate input").val(items[i]["price"]).click()
	  		$(this).find(".chk-heads input").val(items[i]["chicken_head"])
	  		
	  		i++
	  	})

	  	// .find(".chk-heads")
	  	// $(".products-bought-label .chk-label").show()

	  	M.updateTextFields();
	});

	$(document).on('change', "#tab1 #inv-dp", function () {
		var d = new Date(getDate("inv-dp"))
		var today = new Date();
		var options = 
		{
			"setDefaultDate": true,
			"defaultDate" : d,
			"maxDate":today
		}
		var elems = document.querySelectorAll('#newt-dp,#editt-dp,#prodsp-dp,#exp-dp');
 		M.Datepicker.init(elems, options);
	});

	function queryTransactions(){
		var date = getDate("inv-dp")
		console.log("querying transaction using date "+date)
		$.ajax({
			url: host_php_url+"Get_Transactions.php",
			type: "post",
			data: {date:date},
			dataType: 'json',
			success: function(data){
				console.log("----------received this data from PHP")
				console.log(data)
				buildTransactions(data)
			},
			error: function(error){
				console.log(error);
			}
			
		});
	}

	function buildTransactions(data){
		queried_transactions = data
		$("#daily-transactions-customers").html("")
		$("#daily-transactions-products").html("")
		var sales = 0
		var cash_received = 0
		var sales2 = 0
		var cash_received2 = 0
		console.log("building transactions...")
		if(data.customers.length){
			$("#transactions-form").removeClass("empty")
		}else{
			$("#transactions-form").addClass("empty")
		}
		
		cdata = data.customers
		for(i1 in cdata){
			var dom = ""
			var amount_paid = cdata[i1]['amount_paid']
			var balance = cdata[i1]['balance']
			var id = cdata[i1]['id']
			console.log("id is "+id)
			var name = cdata[i1]['name']
			var transaction_date = cdata[i1]['transaction_date']
			var total = cdata[i1]['total']
			var items = cdata[i1]['items']
			var invoice = cdata[i1]['invoice']

			sales+=parseFloat(total)
			cash_received+=parseFloat(amount_paid)

			dom+=""
			+"	 <li value='"+id+"'>"
			+"      <div class='collapsible-header row tr-item-title'>"
			+"      	<span class='col s6 tr-name'>"+name+"</span>"
			+"      	<span class='col s2 tr-invoice fc'>"+invoice+"</span>"
			+"      	<span class='col s2 tr-cost fe'>"+total+"</span>"
			+"      	<span class='col s2 tr-paid fe'>"+amount_paid+"</span>"
			+"    	</div>"
			+" 		<div class='collp-edit-btn'><div><span>EDIT</span></div></div>"
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
				+"	      		<span class='col s3 fm'>"+price+"</span>"
				+"	      		<span class='col s2'>"+chk+"</span>"
				+"	      		<span class='col s2 fe'>"+cost+"</span>"
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
		queryExpenses()
	}

	function submitTransaction(){
		var date = getDate("newt-dp")

		var name = $(".card-reveal .new-transaction #customer-name").val()
		var paid = $(".card-reveal .new-transaction #customer-payment").val()
		var invoice = $(".card-reveal .new-transaction #new-invoice").val()

		var items = []
		var prods = []

		var invalid = false
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
			if(prod==null||prod==''||qty==''||rate==''||name==''||paid==''||invoice==''){
				console.log("failed : "+prod+'   '+qty+'   '+rate+"   "+chicken_head)
				toast("Please fill in all fields")
				invalid = true
				return false
			}else if(prods.indexOf(prod)!=-1){
				console.log("product"+prod+" previously detected")
				toast("Please remove duplicate entries")
				invalid = true
				return false
			}else{
				console.log("pushed : "+prod+'   '+qty+'   '+rate+"   "+chicken_head)
				prods.push(prod)
				items.push(container)
			}
			
		})
		console.log(items)
		
		if(invalid==false){
			toast("Saved Transaction")
			saveNewTransaction(date,name,paid,invoice,items)
		}
		
	}

	function saveNewTransaction(date,name,paid,invoice,items){

		console.log(items)
		
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

	function submitEditedTransaction(){
		var date = getDate("editt-dp")
		var tid = $(".card-reveal .edit-transaction #edit-tid").val()
		var name = $(".card-reveal .edit-transaction #edit-name").val()
		var paid = $(".card-reveal .edit-transaction #edit-payment").val()
		var invoice = $(".card-reveal .edit-transaction #edit-invoice").val()

		var items = []
		var prods = []
		var invalid = false
		$(".card-reveal .edit-transaction .product-field").not(".another-product").each(function(){
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
			if(prod==null||prod==''||qty==''||rate==''||name==''||paid==''||invoice==''){
				console.log("failed : "+prod+'   '+qty+'   '+rate+"   "+chicken_head)
				toast("Please fill in all fields")
				invalid = true
				return false
			}else if(prods.indexOf(prod)!=-1){
				console.log("product"+prod+" previously detected")
				toast("Please remove duplicate entries")
				invalid = true
				return false
			}else{
				console.log("pushed : "+prod+'   '+qty+'   '+rate+"   "+chicken_head)
				prods.push(prod)
				items.push(container)
			}
			
		})
		console.log(items)
		if(invalid==false){
			toast("Saved Edited Transaction")
			saveEditedTransaction(tid, date,name,paid,invoice,items)
		}
		
	}

	$(document).on('click', ".card-reveal .edit-transaction #delete-transaction", function(){
		var tid = $(".card-reveal .edit-transaction #edit-tid").val()
		console.log("deleting transaction with id "+tid)
		$.ajax({
			url: host_php_url+"Delete_Transaction.php",
			type: "post",
			data: {transaction_id:tid},
			dataType: 'json',
			cache: false,
			success: function(data){

				console.log("data received --- "+data)
				queryTransactions()
				$(".edit-transaction .card-title").click()
				clearNewTransactionsForm();
				toast("Successfully Deleted")

			},
			error: function(error){
				console.log(error);
			}
		});
	})



	function saveEditedTransaction(tid, date,name,paid,invoice,items){
		console.log("saving the following info...")
		console.log(tid)
		console.log(date)
		console.log(name)
		console.log(paid)
		console.log(invoice)
		console.log(items)
		
		$.ajax({
			url: host_php_url+"Update_Transaction.php",
			type: "post",
			data: {transaction_id:tid, date:date, name:name, amount:paid, invoice_id:invoice, items:JSON.stringify(items)},
			dataType: 'json',
			cache: false,
			success: function(data){
				console.log("data received --- "+data)
				console.log("saving the edit was a success")
				queryTransactions()
				$(".edit-transaction .card-title").click()
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
					console.log("appended product selections!")
				}
				if(data["customers"]){
					customer_names = []
					for(c in data['customers']){
						var key = data['customers'][c]['name']
						var value = null
						customer_names[key]=value
					}
					customer_autofills = customer_names


					$('.customer-info #customer-name.autocomplete, .customer-info #edit-name.autocomplete, #payment-modal #paying-cust.autocomplete').autocomplete({
				      data: customer_names,
				      limit : 3
				    });
				    console.log("initiated customer autofills!")
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
				    console.log("initiated customer autofills!")
				}
				
				$('select').formSelect();				
			},
			error: function(error){
				console.log(error);
			}
			
		});
	}

//TRANSACTIONS PART 2



//EXPENSES MODAL

	function queryExpenses(){
		var date = getDate("inv-dp")
		$.ajax({
			url: host_php_url+"Get_Expenses.php",
			type: "post",
			data: {date:date},
			dataType: 'json',
			success: function(data){
				buildExpenses(data)
				queryInit()
					
			},
			error: function(error){
				console.log(error);
			}
			
		});
	}

	$(document).on('click', "#expense-items .collp-edit-btn span", function () {
		id = $(this).parent().parent().parent().attr("value")
		if(($(this)).parent().parent().prev().hasClass("regular-expense")){
			console.log(id+" this is a regular expense")
			editRegularExpense(id)
		}else{
			console.log(id+" this is a supply")
			editSupply(id)
		}
	})

	function editSupply(id){
		
		var match
		for(s in queried_supplies){
			item = queried_supplies[s]
			if(item["id"]==id){
				match = item
				openM("#product-modal")
				$("#save-edit-supply").removeClass("hidden")
				$("#save-new-supply").addClass("hidden")
				break
			}
		}
		console.log("match found")
		console.log(match)

		var name  = match["name"]
		var id = match["id"]
		var total = match["total"]
		var sid = match["supplier_id"]
		var products = match["products"]

		edit_supp_id = sid
		edit_supp_date = getDate("prodsp-dp")

		$("#supp-name").val(name)

	  	$("#product-modal .supplies i.item-close").click();
	  	for (i = 0; i < products.length; i++) {
	  		console.log("click")
	  		$("#product-modal .supplies .supply.unclicked").click()
	  	}
	  	i = 0
	  	console.log(products)
	  	console.log("----------")
	  	$("#product-modal .supplies .supply").not(".unclicked").each(function(){
	  		console.log(products[i])
	  		$(this).find(".spd-name input").val(products[i]["name"]).click()
	  		$(this).find(".spd-qty input").val(products[i]["quantity"]).click()
	  		$(this).find(".spd-rate input").val(products[i]["rate"]).click()
	  		$(this).find(".spd-heads input").val(products[i]["heads"])
	  		i++
	  	})
	  	M.updateTextFields()
	}

	function editRegularExpense(id){
		var match
		for(e in queried_expenses){
			item = queried_expenses[e]
			if(item["id"]==id){
				match = item
				openM("#expenses-modal")
				$("#delete-expense").removeClass("hidden")
				$("#save-edit-expense").removeClass("hidden")
				$("#save-expenses").addClass("hidden")
				break
			}
		}
		console.log("match found")
		console.log(match)

		$("#expenses-modal .expense").not(".unclicked").find("i.item-close").click()
		$(".expenses .expense.unclicked").addClass("edit-expense")
		$(".expenses .expense.unclicked").removeClass("unclicked")

		var source  = match["source"]
		var id = match["id"]
		var amount = match["amount"]
		var record_date = match["record_date"]

		edit_exp_id = id

		$(".expenses .expense input.exp-name").val(source)
		$(".expenses .expense input.exp-pay").val(amount)

	  	M.updateTextFields()
	}

	$(document).on('click', "#product-modal #delete-supply", function(){
		$.ajax({
			url: host_php_url+"Delete_Supply.php",
			type: "post",
			data: {old_supplier_id:edit_supp_id, old_date:edit_supp_date},
			dataType: 'json',
			cache: false,
			success: function(data){

				console.log("data received --- "+data)
				queryExpenses()

			},
			error: function(error){
				console.log(error);
			}
		});
	})

	$(document).on('click', "#expenses-modal #delete-expense", function(){
		$.ajax({
			url: host_php_url+"Delete_Normal_Expense.php",
			type: "post",
			data: {expense_id: edit_exp_id},
			dataType: 'json',
			cache: false,
			success: function(data){

				console.log("data received --- "+data)
				queryExpenses()

			},
			error: function(error){
				console.log(error);
			}
		});
	})

	$(document).on('click', "#product-modal #save-edit-supply", function(){
		var has_blanks = false, has_repeats = false
		console.log("submitting editted supplies")
		console.log($(this))
		var date = getDate("prodsp-dp")
		var name = $("#product-modal #supp-name").val()

		var items = []
		var prods = []
		$("#product-modal .supplies .supply").not(".unclicked").each(function(){
			var container = []
			var prod = $(this).find(".spd-name input").val()
			var qty = $(this).find(".spd-qty input").val()
			var rate = $(this).find(".spd-rate input").val()
			var heads = $(this).find(".spd-heads input").val()

			var ischicken = $(this).hasClass("chk-prod")
			var head = (ischicken)? heads: "0"

			container.push(prod)
			container.push(qty)
			container.push(rate)
			container.push(head)
			
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
				toast("Saved "+prods.length+" supplies")
				
				closeM("#product-modal")
				resetProductModal()
				saveEditSupplies(date,name,items)
			}

		}else{
			toast("No entries were saved.")
			closeM("#product-modal")
			resetProductModal()
		}	
	})

	$(document).on('click', "#expenses-modal #save-edit-expense", function(){
		var has_blanks = false

		console.log("submitting editted expense")
		var date = getDate("exp-dp")
		var exp_id = edit_exp_id
		var source = $(".expenses .expense input.exp-name").val()
		var amount = $(".expenses .expense input.exp-pay").val()

		if(source==''||amount==''){
				has_blanks = true
		}
		if(has_blanks){
				toast("Please fill in blank fields")
		}else{
			toast("Saved.")
			saveEditExpense(exp_id,date,source,amount)
			resetExpensesModal()
		}
	
	})

	function saveEditSupplies(date,name,items){
		console.log("saving editted supplies "+date+" "+name)
		console.log(items)
		console.log(edit_supp_id)
		console.log(edit_supp_date)
		$.ajax({
			url: host_php_url+"Update_Supply_Expense.php",
			type: "post",
			data: {date:date, supplier:name, items:JSON.stringify(items), old_supplier_id:edit_supp_id, old_date:edit_supp_date},
			dataType: 'json',
			cache: false,
			success: function(data){

				console.log("data received --- "+data)
				queryExpenses()

			},
			error: function(error){
				console.log(error);
			}
		});
	}

	function saveEditExpense(exp_id,date,source,amount){
		console.log("saving editted expense "+date+" "+source+" "+amount+" with id "+exp_id)
		$.ajax({
			url: host_php_url+"Update_Normal_Expense.php",
			type: "post",
			data: {expense_id:exp_id, date:date, source:source, amount:amount},
			dataType: 'json',
			cache: false,
			success: function(data){

				console.log("data received --- "+data)
				queryExpenses()

			},
			error: function(error){
				console.log(error);
			}
		});
	}

	

	function buildExpenses(data){
		var expense_total = 0
		console.log("building expenses...")
		if(data.expenses.length+data.supply.length){
			$("#expenses-view").removeClass("empty")
			$("#expense-items").html("")
			console.log("clearing and filling in new entries")
		}else{
			$("#expenses-view").addClass("empty")
		}
		queried_expenses = data.expenses
		edata = data.expenses
		for(i1 in edata){
			var dom = ""
			var id = edata[i1]['id']
			var source = edata[i1]['source']
			var amount = edata[i1]['amount']
			expense_total+=parseFloat(amount)
			console.log(amount+" is added to expenses = "+expense_total)
			dom+=""
			+" 	<li value='"+id+"'>"
			+" 		<div class='regular-expense row tr-item-title'>"   	
			+" 			<span class='col s10 tr-name'>"+source+"</span>"  
			+" 			<span class='col s2 tr-paid fe'>"+amount+"</span>"	
			+" 		</div>"
			+" 		<div class='collp-edit-btn'><div><span>EDIT</span></div></div>"
			+" 	</li>"
			$("#expenses-content #expense-items").append(dom);
		}
		queried_supplies = data.supply
		sdata = data.supply
		for(i1 in sdata){
			var dom = ""
			var id = sdata[i1]['id']
			var name = sdata[i1]['name']
			var total = sdata[i1]['total']
			var products = sdata[i1]['products']
			expense_total+=parseFloat(total)
			console.log(total+" is added to expenses = "+expense_total)
			dom+=""
			+" 	<li value='"+id+"' >"
			+" 		<div class='collapsible-header row tr-item-title'>"   	
			+" 			<span class='col s10 tr-name'>"+name+"</span>"  
			+" 			<span class='col s2 tr-paid fe'>"+total+"</span>"	
			+" 		</div>"
			+" 		<div class='collp-edit-btn'><div><span>EDIT</span></div></div>"
			+"		<div class='collapsible-body'>"    	
			+"			<div class='row blk'>"     		
			+"				<span class='col s3'>Product</span>"     		
			+"				<span class='col s3'>Weight</span>"    		
			+"				<span class='col s3 fm'>Php/kg</span>"    		
			+"				<span class='col s3 fe'>Heads</span>"    	
			+"			</div>"
			+"			<div class='sold-items'>"

			for(i2 in products){
		    	var name = products[i2]['name']
		    	var quantity = products[i2]['quantity']
		    	var rate = products[i2]['rate']
		    	var heads = products[i2]['heads']
		    	heads = (heads==0)? "" : heads
		    	dom+=""
	    		+"			<div class='sold-item row'>	"      		
				+"				<span class='col s3'>"+name+"</span>	  "    		
				+"				<span class='col s3'>"+quantity+"</span>	  "    		
				+"				<span class='col s3 fm'>"+rate+"</span>	 "     		
				+"				<span class='col s3 fe'>"+heads+"</span>	    "  	   	  
				+"			</div>	"
			}
		    	
			dom+=""
			+" 			</div>"
			+" 		</div>"
			+" 	</li>"


			$("#expenses-content #expense-items").append(dom);
		}
		$("#tr-exps").text(parseFloat(expense_total).toFixed(2))
		var profit = $("#tr-total").text() - expense_total
		$("#tr-prof").text(parseFloat(profit).toFixed(2))
		console.log("total is "+$("#tr-total").text())
		console.log("expenses total is "+expense_total)
		console.log("therefore profit is "+ parseFloat(profit).toFixed(2))
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

	$(document).on('click', "#expenses-modal #save-expenses", function(){
		var date = getDate("exp-dp")

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
		console.log(expenses)
		$.ajax({
			url: host_php_url+"Add_New_Expenses.php",
			type: "post",
			data: {date:date, expenses:JSON.stringify(expenses)},
			dataType: 'json',
			cache: false,
			success: function(data){
				console.log("data received --- "+data)
				resetExpensesModal()
				queryExpenses()

			},
			error: function(error){
				console.log(error);
			}
			
		});

	}

	$(document).on('click', "#expenses-modal .cancel", resetExpensesModal)

	function resetExpensesModal(){
		$(".expenses .expense.edit-expense").addClass("unclicked")
		$(".expenses .expense.edit-expense").removeClass("edit-expense")

		$("#expenses-modal .expense").not(".unclicked").find("i.item-close").click()
		$("#expenses-modal .expense input").val("")
		M.updateTextFields()

		$("#delete-expense").addClass("hidden")
		$("#save-edit-expense").addClass("hidden")
		$("#save-expenses").removeClass("hidden")
		closeM("#expenses-modal")
	}

	$(document).on('click', "#expenses-modal .modal-content .item-close", function () {
		$(this).parent().remove();
		toggleChickenLabelPS();
	})
//EXPENSES MODAL



function queryDebts(){
	$.ajax({
		url: host_php_url+"Get_Customer_Debts.php",
		type: "post",
		data: {},
		dataType: 'json',
		success: function(data){
			console.log("Received debts data");
			customer_history = data
			buildBalances()
		},
		error: function(error){
			console.log(error);
		}
		
	});
}

function buildBalances(){
	$("#balance-items").html("")
	console.log("balances")
	// TODO ADD EMPTY CLASS FOR WHEN THERE'S NOTHING TO FILL IN
	if(Object.keys(customer_history).length){
		$("#balance-form").removeClass("empty")
	}else{
		$("#balance-form").addClass("empty")
	}
	var active = ""
	for(c in customer_history){
		var payments = 0
		var purchases = 0
		
    	for(h in customer_history[c]){
    		var item = customer_history[c][h]
    		purchases+=parseFloat(item.total_price)
    		payments+=parseFloat(item.paid)
    	}
    	var balance = purchases - payments

    	if(c==history_active_name&&history_active_name!=""){
    		active="active"
    		buildHistory(c)
    	}
    	
		var dom = ""
		dom+=""
		+"	<li class='"+active+"'>"
		+"		<div class='regular-item row tr-item-title'>" 	
		+"			<span class='col s10'>"+c+"</span>"   
		+"			<span class='col s2 fe'>"+balance.toFixed(2)+"</span>"  	
		+"		</div>"
		+"	</li>"
		$("#balance-items").append(dom);
		active = ""
	}
}



$(document).on('click', "#balance-items li", function(){
	$("#balance-items li").removeClass("active")
	$(this).addClass("active")
})

$(document).on('click', "#balance-items li div", function(){
	var customerName = $(this).find("span")[0].textContent
	history_active_name = customerName
	buildHistory(customerName)
})

$(document).on('change', "#history-form .datepicker", function () { 
	start = getDate("start-dp")
	end = getDate("end-dp")
	if($("#balance-items li.active div span").length){
		name = $("#balance-items li.active div span")[0].textContent
		buildHistory(name)
	}else{
		// name = $("#balance-items li div span")[0].textContent
	}

	// name = $("#balance-items li.active div span")[0].textContent
	console.log("query from "+start+" to "+end)
});

function buildHistory(name){
	cname = name
	$("#history-items").html("")
	var total_balance = 0
	console.log("history of "+name)

	hdata = customer_history[name]
	if(hdata.length){
		$("#history-form").removeClass("empty")
	}else{
		$("#history-form").addClass("empty")
	}


	start = getDate("start-dp")
	end = getDate("end-dp")

	
	var payments = 0
	var purchases = 0
	for(i1 in hdata){
		var item = hdata[i1]
		var td = item["transaction_date"]
		var d = td.split("-")
		var date = b(d[1])+" "+d[2]+", "+d[0]
		var tid = item["tid"]
		var type = item["type"]
		var debt = item["total_price"]
		var paid = item["paid"]

		console.log("start : "+start+"      middle date: "+td+"           end: "+end)

		if(within(start,td,end)){
			console.log(td+" is within "+start+" and "+end)
			purchases+=parseFloat(debt)
			payments+=parseFloat(paid)
			var dom=""
			var products=[]

		

			if(type=="debt"||type=="payment"){
				debt = (debt>0)? (debt+"") : ""
				paid = (paid>0)? (paid+"") : ""
				
				dom+=""
				+"	<li class='"+type+"'>"
				+"		<div class='regular-item row tr-item-title'>"
				+"			<span class='col s6 h-date'>"+date+"</span>"
				+"			<span class='col s3 fe h-debt'>"+debt+"</span>"
				+"			<span class='col s3 fe h-paid'>"+paid+"</span>"
				+"		</div>"
				+" 		<div class='collp-edit-btn'><div><span>EDIT</span></div></div>"
				+"	</li>"



			}else if(type=="purchase"){

				var items = item["items"]

				dom+=""
				+"	<li class='"+type+"' value='"+tid+"'>"
				+"		<div class='collapsible-header row tr-item-title'>"
				+"			<span class='col s6'>"+date+"</span>"
				+"			<span class='col s3 fe'>"+debt+"</span>"
				+"			<span class='col s3 fe'>"+paid+"</span>"
				+"		</div>"
				+" 		<div class='collp-edit-btn'><div><span>EDIT</span></div></div>"
				+"		<div class='collapsible-body'>"
				+"			<div class='row blk'>"
				+"				<span class='col s3'>Product Name</span>"
				+"				<span class='col s2 fe'>Weight (kg)</span>"
				+"				<span class='col s3 fm'>Php/kg</span>"
				+"				<span class='col s2 fm'>Chk. Heads</span>"
				+"				<span class='col s2 fe'>Price</span>"
				+"			</div>"
				+"			<div class='buyers'>"



			    for(i2 in items){
			    	var heads = items[i2]['chicken_head']
			       	var cost = items[i2]['cost']
					var name = items[i2]['name']
					var quantity = items[i2]['quantity']
					var rate = items[i2]['rate']
					var chk = (heads=="0")? "": heads

					dom+=""

					+"			<div class='buyer row'>"
					+"				<span class='col s3'>"+name+"</span>"
					+"				<span class='col s2 fe'>"+quantity+"</span>"
					+"				<span class='col s3 fm'>"+rate+"</span>"
					+"				<span class='col s2 fm'>"+chk+"</span>"
					+"				<span class='col s2 fe'>"+cost+"</span>"
					+"			</div>"
				}

				dom+=""
				+"			</div>"
				+"		</div>"
				+"	</li>"

				


			}
			
			$("#history-items").append(dom);
		}
		
	}
	var balance = purchases - payments
	$("#history-balance").text(balance.toFixed(2))
	$("#history-cname").text(cname)
}


$(document).on('click', "#history-form #history-items .purchase .collp-edit-btn span", function () {
		$(".card-reveal .edit-transaction").removeClass("hidden")
		$(".card-reveal .new-transaction").addClass("hidden")

		$("#transactions-form .activator").click()
		var tid = $(this).parent().parent().parent().attr("value")
		console.log("finding id no. "+tid )
		var ctrans = customer_history
		var match
		var name = history_active_name
		console.log("name is "+name+" and tid is "+tid)


		for(t in ctrans){
			console.log("------------------------")
			if(t==name){
				console.log(t+" is the same as "+name)
				console.log("------------")
				for(h in ctrans[t]){
					var item = ctrans[t][h]
					// console.log("item is "+item)
					if(item["tid"]==tid){
						match = item
						break
					}
				}
				break
			}	
		}
		console.log("match found")
		console.log(match)

		
		var invoice = match["invoice"]
		var id = match["tid"]
		var date = match["transaction_date"]
		var total = match["total_price"]
		var payment = match["paid"]
		var items = match["items"]

		$("#edit-name").val(name)
		$("#edit-invoice").val(invoice)
		$("#edit-payment").val(payment)
		$("#edit-tid").val(tid)

	  	var options = 
		{
			"setDefaultDate": true,
			"defaultDate" : new Date(date)
		}
		console.log("----------")
		var elems = document.querySelectorAll('#editt-dp');
	  	M.Datepicker.init(elems, options);
	  	$("#tab1 .card-reveal .products-bought i.item-close").click();
	  	for (i = 0; i < items.length; i++) {
	  		$(".edit-transaction .another-product").click()
	  	}
	  	i = 0
	  	console.log(items)
	  	console.log("----------")
	  	$(".card-reveal .edit-transaction .product-field").not(".another-product").each(function(){
	  		console.log(item[i])
	  		// $(this).find(".prod-name input").val(items[i]["name"])
	  		$(this).find(".prod-name ul.select-dropdown li").each(function(){
	  			var zxc = $(this).find("span").text()
	  			if(zxc == items[i]["name"]){
					$(this).click()
				}
	  		})
	  		
	  		$(this).find(".prod-qty input").val(items[i]["quantity"]).click()
	  		$(this).find(".prod-rate input").val(items[i]["rate"]).click()
	  		$(this).find(".chk-heads input").val(items[i]["chicken_head"])
	  		
	  		i++
	  	})

	  	// .find(".chk-heads")
	  	// $(".products-bought-label .chk-label").show()

	  	M.updateTextFields();
	  	openT("tab1")
	});

$(document).on('click', "#history-form #history-items .payment .collp-edit-btn span", function () {
		var field = $(this).parent().parent().parent().find(".regular-item.row")
		var date = field.find(".h-date").text()
		
		var paid = field.find(".h-paid").text()

		$("#paying-cust").val(history_active_name)
		$("#cust-payment").val(paid)

		M.updateTextFields()

		$("#payment-modal").addClass("editmode")
		openM("#payment-modal")
	});
$(document).on('click', "#history-form #history-items .debt .collp-edit-btn span", function () {
		var field = $(this).parent().parent().parent().find(".regular-item.row")
		var date = field.find(".h-date").text()
		var debt = field.find(".h-debt").text()

		$("#new-cust").val(history_active_name)
		$("#new-cust-debt").val(debt)

		M.updateTextFields()

		$("#payment-modal").addClass("editmode")
		openM("#payment-modal")
	});



function buildFinancialGraph(){
	var view = $("#finance-form .graph-view .select-wrapper select option:selected").val();
	if(view=="m"){
		queryMonth()
	}else if(view=="w"){
		queryWeek()
	}
}
$(document).on('change', "#finance-form .graph-view .select-wrapper select, #finance-form #graph-dp", buildFinancialGraph);
$(document).on('click', "#link-tab3", buildFinancialGraph)

function queryWeek(){
	console.log("querying week")
	var date = getDate("graph-dp")
	$.ajax({
		url: host_php_url+"Get_Summary_For_A_Week.php",
		type: "post",
		data: {date:date},
		dataType: 'json',
		success: function(data){
			console.log("Received week data");
			week_data = data;
			buildGraph(data)
		},
		error: function(error){
			console.log(error);
		}
	});
}
function queryMonth(){
	
	var date = getDate("graph-dp")
	console.log("querying month using date "+date)
	$.ajax({
		url: host_php_url+"Get_Summary_For_A_Month.php",
		type: "post",
		data: {date:date},
		dataType: 'json',
		success: function(data){
			console.log(data)
			console.log("Received month data");
			month_data = data;
			buildGraph(data)
		},
		error: function(error){
			console.log(error);
		}
	});
}

$(document).on('change', "#inv-sales-form .graph-view .select-wrapper select, #inv-sales-form #invr-dp", function () {
	console.log("change detected")
	// "week" or "month"
	queryInventory()
});

function queryInventory(){
	var view = $("#inv-sales-form .graph-view .select-wrapper select option:selected").val();
	console.log("querying "+view)
	var date = getDate("invr-dp")
	$.ajax({
		url: host_php_url+"Get_Product_Sales_Summary.php",
		type: "post",
		data: {date:date, period:view},
		dataType: 'json',
		success: function(data){
			console.log("Received inventory data");
			inventory_sales = data;
			buildInventory()
			buildDoughnut()
		},
		error: function(error){
			console.log(error);
		}
	});
}
function buildInventory(){
	$("#inventory-list").html("")
	console.log("inventory")
	// TODO ADD EMPTY CLASS FOR WHEN THERE'S NOTHING TO FILL IN
	if(inventory_sales.supply.length){
		$("#inventory-form").removeClass("empty")
	}else{
		$("#inventory-form").addClass("empty")
	}
	for(supply in inventory_sales.supply){
    	var s = inventory_sales["supply"][supply]
    	var name = s["name"]
    	var supply_cost = s["supply_cost"]
    	var supply_heads = s["supply_heads"]
    	var supply_quantity = s["supply_quantity"]
    	var heads = (supply_heads>0)? supply_heads : ""
    	
		var dom = ""
		dom+=""
		+"	<li >"
		+"		<div class='regular-item row tr-item-title'>" 	
		+"			<span class='col s5'>"+name+"</span>"
		+"			<span class='col s3'>"+heads+"</span>"  
		+"			<span class='col s4 fe'>"+supply_quantity+"</span>"
		+"		</div>"
		+"	</li>"
		$("#inventory-list").append(dom);
	}
}

function PrintElem(elem)
{
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
}

function printHistory(){
	$(".navbar").addClass("hidden")
	$("#balance-form").addClass("hidden")
	$("#history-form").show()
	$("#balance-space").addClass("auto")
}


$(document).on('click', "#user-modal .cancel, #payment-modal .cancel", function(){
	var a = $(this).parent().parent()
	a.find("input").val("")
	a.removeClass("editmode")
	M.updateTextFields()
})

$(document).on('click', "#save-cust-payment", function () {
	var name = $("#payment-modal #paying-cust")
	var debt = $("#payment-modal #cust-payment")
	n = name.val()
	d = debt.val()
	console.log(n+"  "+d)
	
	$.ajax({
		url: host_php_url+"Add_Payment.php",
		type: "post",
		data: {name:n, amount: d},
		dataType: 'json',
		success: function(data){
			console.log("customer "+n+" successfully "+d);
			name.val("")
			debt.val("")
			M.updateTextFields();
			queryDebts()
			setTimeout(function(){ buildHistory(n) }, 3000);

		},
		error: function(error){
			console.log(error);
		}
	});
})


$(document).on('click', "#link-tab4", queryDebts)
$(document).on('click', "#link-tab2", queryInventory)