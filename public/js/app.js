$(document).on("click", "#scrape", function() {
    console.log("test scrape click");

    $.getJSON("/scrape", function(data) {
        // console.log(data)
        for (var i =0; i < data.length; i++) {
            $("#articles").append(
                "<p data-id= " + data[i]._id + ">" + 
                "Title: " + data[i].title + 
                "<button type=button class=btn btn-danger id=addNote>Add Note</button>" + 
                "<br />" + 
                "<a href = " + data[i].link + ">Link</a>" + 
                "<br />" + 
                "Description: " + data[i].description +
                "</p>");
        }
    })
});

$(document).on("click", "#addNote", function() {
    console.log("test note click");

    $("#notes").empty();

    var thisId = $(this).parent().attr("data-id");

    console.log(thisId);

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
    })

});