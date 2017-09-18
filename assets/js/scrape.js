$(document).on("click", "#scrape", function(){

  $.getJSON("/scrape", function(data) {
    // For each one
    $("#articles").html('');
    for (var i = 0; i < 10; i++) {
      // Display the apropos information on the page
      $("#articles").append("<p id= "+data[i].headline +">" + data[i].summary + "<br />" + data[i].link + "</p>");
     $("#articles").append("<button class="+"save"+" id= "+ data[i].headline +">" +"SAVE"+ "</button>");
    };
//Save function

  }) ;
});
