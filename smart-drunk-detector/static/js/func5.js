$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#face-result').hide();
    $('#ndir-result').hide();
    $('#final-result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);
        var ndir_value = document.getElementById("ndir").value;  
        var float_ndir = parseFloat(ndir_value);
        var bac = 0.004107142857142856 * ndir_value + 0.02714285714285719;
        console.log(ndir_value);
        console.log(typeof(ndir_value));

        // Show loading animation
        $(this).hide();
        $('.loader').show();

        // Make prediction by calling api /predict
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#face-result').fadeIn(600);
                $('#face-result').text('Face Recognition:  ' + data);
                $('#ndir-result').fadeIn(600);
                $('#ndir-result').text('BAC Level:  ' + bac);

                var final_result = "";
                if (data == "Normal" && bac < 0.08) {
                    final_result = "You are good to go!";
                } else if (data == "Normal" && bac > 0.08) {
                    final_result = "You should not drive!";
                } else if (data == "Drunk" && bac < 0.08) {
                    final_result = "You can drive but be extremely careful!";
                } else {
                    final_result = "You should not drive!";
                }

                $('#final-result').fadeIn(600);
                $('#final-result').text(final_result);
                console.log('Success!');
            },
        });
    });

});