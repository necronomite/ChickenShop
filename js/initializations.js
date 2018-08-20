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
  autoQuery()
  queryDebts()
  queryWeek()
});

function autoQuery(){
  queryTransactions()
  queryExpenses()
}
function queryHistory(){

}


 function setDatePicker(){
  $('.datepicker').datepicker();
  // var today = new Date();
  var today = new Date(2018,3,26)
  var past = new Date(2018,0,1)
  var daily_options = 
  {
    "onClose": autoQuery,
    "setDefaultDate": true,
    "defaultDate" : today,
    "maxDate":today
  }
  var options = 
  {
    "setDefaultDate": true,
    "defaultDate" : today,
    "maxDate":today
  }
  var past_options = 
  {
    "onClose": queryHistory,
    "setDefaultDate": true,
    "defaultDate" : past,
    "maxDate":today
  }



  var elems = document.querySelectorAll('#start-dp');
  M.Datepicker.init(elems, past_options);
  var elems = document.querySelectorAll('#newt-dp,#graph-dp,#end-dp,#prodsp-dp,#exp-dp,#invr-dp');
  M.Datepicker.init(elems, options);
  var elems = document.querySelectorAll('#inv-dp');
  M.Datepicker.init(elems, daily_options);

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