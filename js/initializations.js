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
});


 var today = new Date();
 $(document).ready(function(){
    $('.datepicker').datepicker();
    console.log(today)
    var options = 
    {
      // "format":"yyyy-mm-dd",
      "onSelect": queryTransactions,
      "setDefaultDate": true,
      "defaultDate" : today,
      "maxDate":today
    }
    var elems = document.querySelectorAll('.datepicker');
    var instances = M.Datepicker.init(elems, options);
  });



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