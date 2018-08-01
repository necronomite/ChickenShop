 $(document).ready(function(){
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
  $('.tabs').tabs();
  $('.fixed-action-btn').floatingActionButton();
  $('.tooltipped').tooltip();
  $('.modal').modal();
  $('.modal').modal();
  $('select').formSelect();
  M.updateTextFields();
  setDatePicker()
  queryInit()
  queryTransactions()
});

function autoQuery(){
  queryTransactions()
  queryExpenses()
}


 function setDatePicker(){
  $('.datepicker').datepicker();
  var today = new Date();
  var options = 
  {
    "onClose": autoQuery,
    "setDefaultDate": true,
    "defaultDate" : today,
    "maxDate":today
  }
  var elems = document.querySelectorAll('.datepicker');
  var instances = M.Datepicker.init(elems, options);
  // autoQuery()
}



// $(document).ready(function(){
//     $('input.autocomplete').autocomplete({
//       data: {
//         "Apple": null,
//         "Microsoft": null,
//         "Google": 'https://placehold.it/250x250'
//       },
//     });
//   });


 // document.addEventListener('DOMContentLoaded', function() {
 //    var elems = document.querySelectorAll('select');
 //    var instances = M.FormSelect.init(elems, options);
 //  });