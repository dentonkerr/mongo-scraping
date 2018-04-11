$(document).on("click", "#scrape", function() {
    console.log("test scrape click");

    $.getJSON("/scrape", function(data) {
        for (var i =0; i < data.length; i++) {
            $("#articles").append("</p>" + data[i].title + "<br />" + data[i].link + "</p>");
        }
    })
})