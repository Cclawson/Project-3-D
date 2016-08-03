$("#hamburger").on("click", function () {
    if (window.innerWidth > 1200) {
        $("#navigation").animate({
            "width": "40%",
        }, 1500);
    } else {
        $("#navigation").animate({
            "width": "100%",
        }, 1500);
    }
});

$("#exit").on("click", function () {
    $("#navigation").animate({
        "width": "0%",
    }, 1500);
})