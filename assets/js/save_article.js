$(document).on("click", ".save", function() {
  console.log("client saving");
  var savedData = {};
  var toSave = (this.id);
  savedData.title = data[toSave].title;
  savedData.link = data[toSave].link;

  $.ajax({
    method: "POST",
    url: "/save",
    data: {
      title: savedData.title,
      link: savedData.link,
    }
  });
});
