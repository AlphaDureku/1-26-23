$("#secu").click(function() {
    $.post("/admin/update-security", {
        currentPassword: $('input[name="currentPassword"]').val(),
        newPassword: $('input[name="newPassword"]').val(),
        retypePassword: $('input[name="retypePassword"]').val(),
    }, function(res, status) {
        $('#mismatch').css({ 'display': 'none' })
        $('#badPass').css({ 'display': 'none' })
        if (res.isAuthorized && res.isSame) {
            console.log('show modal success')
        } else if (!res.isAuthorized) {
            $('#badPass').css({ 'display': 'block' })
        } else if (!res.isSame) {
            $('#mismatch').css({ 'display': 'block' })
        }

    })
});


$("#upProfile").click(function() {
    $.post("/admin/update-profile", {
        Fname: $('input[name="Fname"]').val(),
        Mname: $('input[name="Mname"]').val(),
        Lname: $('input[name="Lname"]').val(),
    }, function(res, status) {
        console.log(res)
    })
});