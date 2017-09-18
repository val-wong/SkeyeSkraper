$(document).ready(function() {
  console.log('loaded scrape.js');
  $(document).on("click", "#scrape", function() {

    //   $.getJSON("/scrape", function(data) {
    //     // For each one
    //     $("#articles").html('');
    //     for (var i = 0; i < 10; i++) {
    //       // Display the apropos information on the page
    //       $("#articles").append("<p id= "+data[i].headline +">" + data[i].summary + "<br />" + data[i].link + "</p>");
    //      $("#articles").append("<button class="+"save"+" id= "+ data[i].headline +">" +"SAVE"+ "</button>");
    //     };
    // //Save function
    //
    //   }) ;
    console.log('clicked');

    $.get("/allarticles", function(data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var html = "<div class='articleStuff'>" +
                  "<h2>" + data[i].title + "</h2>" +
                   "<p>"  + data[i].summary + "</p>" + "</div>";
        $("#articles").append(html);
      };

    });


  });
});
