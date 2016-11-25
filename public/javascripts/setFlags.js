/**
 * Created by fitz on 11/16/16.
 */

$(document).ready(function(context) {

    var cutAfter = 0;
    makeClickable();
    console.log('&#9733 = filled star, &#9734 = empty star. terminate w/ \';\'');
    console.log(context);
    console.log('hi');

    function makeClickable() {
        console.log('in makeClickable');

        // Get each data-name (for x-edit)
        // Append data-name as an attribute
        $("a[data-name]").each(function(index) {
            // Save the text in the value
            var dataName = $(this).attr("data-name");

            // Reduce it to a max depth of two levels
            cutAfter = dataName.indexOf('.', dataName.indexOf('.') + 1);
            if (dataName.indexOf('.', dataName.indexOf('.') + 1) > 0) {
                dataName = dataName.slice(0, cutAfter);
            }
            console.log(dataName)
            $(this).attr("data-type", dataName)
        });


        // TODO: populate current flags based on a database entry

        // Select the <a id=highlight> in each highlight <td> cell
        // append an href to invert the current selection in the database
        $(".highlight").each(function() {
            $(this).attr("href", "http://www.google.com");
        });

        // TODO:

        // TODO: Log the invert for debugging
    }
});
