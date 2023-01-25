$('.datepicker-here').datepicker({
    language: 'en',
    inline: true
})

$.get("/book-appointment/get-schedule", function(data, status) {
    let enabledDays = []
    data.forEach(res => {
        enabledDays.push(res.date2)
    })

    renderCalendar(enabledDays);
});

const renderCalendar = (enabledDays) => {

    $('.datepicker-here').datepicker({
        dateFormat: 'yyyy/mm/dd',
        onSelect() {
            $.get("/book-appointment/get-schedule2", { data: 'hi' }, function(data, status) {
                $('#table').empty().not(':first').remove();
                $('#patientQueue').remove()
                $('#drop-down').children().not(':first').remove();
                data.forEach(res => {

                    if ($('#date').val() == res.date2) {
                        let time = moment(res.start, "HH:mm:ss")
                        let formatStart = moment(res.start, 'hh:mm A')
                        let formatEnd = moment(res.end, 'hh:mm A')
                        let addTime = moment(res.Interval, "HH:mm:ss")

                        for (let i = 1; i < res.current; i++) {
                            time.add(addTime.hours(), 'hours')
                            time.add(addTime.minutes(), 'minutes')
                        }


                        $('#table').append(`
                        <tr>
                        <td>${res.date}</td>
                        <td>${res.day}</td>
                        <td>${formatStart.format('hh:mm A')} - ${formatEnd.format('hh:mm A')}</td>
                        </tr>`)
                        $('#main_table').append(`<div id="patientQueue">Hi! You will be number <b>${res.current}</></b> in Queue.<br><br><br>We will be waiting for you in the hospital at <b>${res.date}<br>Friday ${time.format("h:mm A")}.</b></div>`)
                        $('#drop-down').append(`<option value="${res.doctor_schedule_ID}" selected>${res.date} ${res.day} ${res.start}</option>`)
                    }
                })
            });
        },

        onRenderCell: function onRenderCell(date, cellType) {
            if (cellType == 'day') {
                var day = (date.getFullYear() + '-' + (('0' + (date.getMonth() + 1)).slice(-2)) + '-' + (('0' + date.getDate()).slice(-2)));
                var isDisabled = enabledDays.indexOf(day) == -1;
                return {
                    disabled: isDisabled
                }
            }
        }
    })

}