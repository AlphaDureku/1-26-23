$(window).scroll(function() {
    $('nav').toggleClass('scrolled', $(this).scrollTop() > 350);
});

function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$(document).ready(function() {
    $.get('/setup-HMO', function(data) {
        data.forEach(result => {
            $('#HMO_Query').append(`<option value="${result.HMO_ID}">${result.HMO_Name}</option>`)
        })
    })
    $.get('/setup-specialization', function(data) {
        data.forEach(result => {
            $('#specialization_Query').append(`<option value=${result.specialization_ID}>${result.specialization_Name}</option>`)
        })
    })
});



$("#modal-btn").click(function() {
    if (isValidEmail($('#inputEmail').val())) {
        $.get("/user-directory", function(data, status) {
            let exist = false;
            data.forEach(result => {
                if ($('#inputEmail').val() == result.user_email) {
                    exist = true
                }
            })
            if (exist) {
                $.post("/send-OTP", {
                    patient_Email: $('#inputEmail').val()
                }, function(res, status) {
                    console.log(res)
                })
                $('#user_email').text($('#inputEmail').val())
                $('#modal').modal('show');
            } else {
                $('#homeEmail').css({ 'display': 'block' })
                $('#homeEmail').html("No record associated with this email.")
                $('#error').modal('show');
            }
        });
    } else {
        $('#homeEmail').css({ 'display': 'block' })
        $('#homeEmail').html("Invalid email. Please enter a valid one.")
        $('#error').modal('show');
    }


});

const trackingCompareOTP = (inputOTP, inputEmail) => {
    $.post("/verify", {
        inputOTP: inputOTP,
        inputEmail: inputEmail
    }, function(res, status) {
        console.log(res.isVerified)
        if (res.isVerified) {
            $('#otpInput').val('')
            $('#inputEmail').val('')
            $(location).attr('href', `/Manage-Appointments/${res.user_ID}`);
        } else {
            $('#otpError').css({ 'display': 'block' })
        }
    })
}

$("#sendOTP").click(function() {
    if ($("#inputEmail").val() != "" && isValidEmail($('#inputEmail').val())) {
        if ($('#checkbox').is(":checked")) {
            $.post("/book-appointment/send-OTP", {
                credentials: 'same-origin',
                patient_Email: $('#inputEmail').val()
            })
            $('#user_email').text($('#inputEmail').val())
            $('#otpmodal').modal("show")
        } else {
            $('#termsAndServiceError').modal("show")
        }
    } else {

        $('#invalidEmailError').modal("show")
    }

})

const CompareOTPsetAppointment = (inputOTP) => {
    $.post("/book-appointment/verify-otp", {
        credentials: 'same-origin',
        inputOTP: inputOTP,
    }, function(res, status) {
        if (res.isVerified && res.hasHistory) {
            $('#patient_row').children().not(':last').remove();
            Patient = res.patientList
            console.log(Patient)
            Patient.rows.forEach(data => {
                $('#patient_row').prepend(`
                <div class="form-check center  mb-4">
                <input type="radio" name="choice" id="${data.patient_ID}" class="inrd" value="${data.patient_ID}">
                <label for="${data.patient_ID}" class="rdlabel center">${data.patient_first_name} ${data.patient_last_name}</label>
            </div>`)
            })
            $("#otpmodal").modal("hide");
            $('#patientRecordModel').modal('show');
        } else if (res.isVerified) {
            $(location).attr('href', `/book-appointment/patient-forms`);
        } else {
            $('#otpError').css({ 'display': 'block' })
        }
    })
}

$("#cancel_modal2").click(function() {
    $('#patientRecordModel').modal('hide');
})

$("#cancel_modal").click(function() {
    $('#otpError').css({ 'display': 'none' })
    $('#otpInput').val('')
})



$("#modalBtn").click(function() {
    $("#terms").modal("show");
});

//Choose Schedule Page
$(document).ready(function() {
    $('input:checkbox').click(function() {
        $('input:checkbox').not(this).prop('checked', false);
    });
});


$(document).ready(function() {
    $('#book').click(function() {

        if ($('#drop-down').val() !== "") {

            $.get("/book-appointment/get-receipt", {
                    doctor_schedule_ID: $('#drop-down').val()
                },
                function(data) {
                    if (data != 'error') {
                        let time = moment(data.start, "HH:mm:ss")
                        let addTime = moment(data.interval, "HH:mm:ss")
                        for (let i = 1; i < data.current; i++) {
                            time.add(addTime.hours(), 'hours')
                            time.add(addTime.minutes(), 'minutes')
                        }
                        console.log(time.format("HH:mm:ss"))
                        $("#modal").modal("show");
                        $('#schedule_date').children().not(':first').remove();
                        $('#doctor_info').empty()
                        $('#schedule_date').append(`<p style="font-size: 17px; color: #848484;">${data.date}<br>${time.format("hh:mm A")}</p>`)
                        $('#doctor_info').append(` <p style="font-size: 17px; color: #848484;">Dr. ${data.doctor_first_name} ${data.doctor_last_name}<br>${data.specialization}</p> <input type="text" hidden value ="${time.format("HH:mm:ss")}" id="start">`)

                    } else {
                        $('#modal-container').empty()
                        $('#modal-container').append(`<div class="modal fade" id="schedConflict" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-m modal-dialog-centered">
                            <div class="modal-content">
                    
                                <div class="modal-body">
                                    <div class="row-col sucimage center">
                                        <img src="/assets/exit.png" alt="" class="img-fluid" style="height: 115px;">
                                    </div>
                                    <div class="row mt-4 suctitle text-center">
                                        <h3>Schedule Conflict!</h3>
                                    </div>
                                    <div class="row mt-2 text-center">
                                        <p class="para">You have an existing appointment that has the same schedule!.
                                            <SEct></SEct>
                                        </p>
                                    </div>
                                    <div class="row center">
                                        <button type="button" class="btn btn-success" style="border-radius:20px; ;width: 110px;background:  #32ba7c;border: #32ba7c;" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                    
                            </div>
                        </div>
                    </div>
                    `)
                        $('#schedConflict').modal('show')
                    }

                })
        } else {
            console.log('no sched')
        }
    });
});


$("#finish").click(function() {
    console.log($('#start').val())
    $.post("/book-appointment/set-appointment", {
        doctor_schedule_id: $('#drop-down').val(),
        start: $('#start').val()
    }, function(data, status) {
        $(location).attr('href', `/book-appointment/Finish`)
    })

});