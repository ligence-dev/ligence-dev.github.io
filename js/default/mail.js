$(function () {
  // Get the form.
  var form = $("#main_contact_form");
  // Get the messages div.
  var formMessages = $("#success_fail_info");
  // Get the submission button on the form.
  var submitBtn = $(form).find('button[type="submit"]');
  // Set up an event listener for the contact form.
  $(form).submit(function (e) {
    // Stop the browser from submitting the form.
    e.preventDefault();

    // Stop the form from sending again
    $(submitBtn).attr("disabled", "disabled");

    // send reCaptcha request
    grecaptcha.ready(function () {
      grecaptcha.execute('reCAPTCHA_site_key', { action: 'submit' }).then(function (token) {
        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
          type: "POST",
          url: $(form).attr("action"),
          data: formData,
        })
          .done(function (response) {
            // Make sure that the formMessages div has the 'success' class.
            $(formMessages).removeClass("alert alert-danger");
            $(formMessages).addClass("alert alert-primary");

            // Set the message text.
            $(formMessages).text("Thanks! Message has been sent.");

            // Clear the form.
            $("#name").val("");
            $("#email").val("");
            $("#subject").val("");
            $("#message").val("");
          })
          .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass("alert alert-primary");
            $(formMessages).addClass("alert alert-danger");

            // Set the message text.
            if (data.responseText !== "") {
              $(formMessages).text(data.responseText);
            } else {
              $(formMessages).text("Oops! An error occurred.");
            }
          })
          .always(function () {
            $(submitBtn).removeAttr("disabled");
          });
      }).catch(function () {
        $(submitBtn).removeAttr("disabled");
      });
    });
  });
});
