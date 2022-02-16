$( document ).ready(function() {
    
    let firstRatings = [];
    let secondRatings = [];
    let thirdRatings = [];
    let fourthRatings = [];
    let fifthRatings = [];
    let sixthRatings = [];

    const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

    let firstAverage = 0;
    let secondAverage = 0;
    let thirdAverage = 0;
    let fourthAverage = 0;
    let fifthAverage = 0;
    let sixthAverage = 0;


    $(".first-rating").rateYo({
        onSet: function (rating, rateYoInstance) {
 
            firstRatings.push(rating);
            firstAverage = average(firstRatings).toFixed(1);
            $(".first-average").html(firstAverage.toString());

        }
    });

    $(".second-rating").rateYo({
        onSet: function (rating, rateYoInstance) {
 
            secondRatings.push(rating);
            secondAverage = average(secondRatings).toFixed(1);
            $(".second-average").html(secondAverage.toString());

        }
    });

    $(".third-rating").rateYo({
        onSet: function (rating, rateYoInstance) {
 
            thirdRatings.push(rating);
            thirdAverage = average(thirdRatings).toFixed(1);
            $(".third-average").html(thirdAverage.toString());

        }
    });

    $(".fourth-rating").rateYo({
        onSet: function (rating, rateYoInstance) {
 
            fourthRatings.push(rating);
            fourthAverage = average(fourthRatings).toFixed(1);
            $(".fourth-average").html(fourthAverage.toString());

        }
    });

    $(".fifth-rating").rateYo({
        onSet: function (rating, rateYoInstance) {
 
            fifthRatings.push(rating);
            fifthAverage = average(fifthRatings).toFixed(1);
            $(".fifth-average").html(fifthAverage.toString());

        }
    });

    $(".sixth-rating").rateYo({
        onSet: function (rating, rateYoInstance) {
 
            sixthRatings.push(rating);
            sixthAverage = average(sixthRatings).toFixed(1);
            $(".sixth-average").html(sixthAverage.toString());

        }
    });

});