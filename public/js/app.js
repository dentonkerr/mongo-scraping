$(document).on("click", "#scrape", function () {
    console.log("test scrape click");

    $.getJSON("/scrape", function (data) {
        // console.log(data)
        for (var i = 0; i < data.length; i++) {
            $("#articles").append(
                "<p data-id= " + data[i]._id + ">" +
                "Title: " + data[i].title +
                "<button type=button class=btn btn-danger id=addNote>Add Note</button>" +
                "<br />" +
                "<a href = " + data[i].link + ">Link</a>" +
                "<br />" +
                "Description: " + data[i].description +
                "<br />" +
                "_________________________" +
                "</p>");
        }
    })
});

$(document).on("click", "#addNote", function () {
    console.log("test note click");

    $("#notes").empty();

    var thisId = $(this).parent().attr("data-id");

    console.log(thisId);

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    .then(function(data) {
        $("#notes").empty();
    });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});