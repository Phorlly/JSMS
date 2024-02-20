jQuery(document).ready(() => {
    loadingGif();
    monthYear.change(() => readReport());
    shift.change(() => readReport());
    setStaff.change(() => readReport());
    readReport();
    $("#show").click(() => reads());
});

//Declare variable for use global
let tables = [];
let createdBy = $("#log-by").data("logby");
let update = $("#update");
let dataId = $("#data-id");
let save = $("#save");
let monthYear = formatMonthYear("#month-year");
const setStaff = $("#staff");
let shift = $("#shift");

//You can change it whatever you want
let modalDialog = $("#modal-attendance");
let checkIn = $("#check-in");
let checkOut = $("#check-out");
let noted = $("#noted");

const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/attendances/reads",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        // scrollX: true,
        destroy: true,
        dom: "Bfrtip",
        language: {
            paginate: {
                previous: "<i class='fas fa-chevron-left'>",
                next: "<i class='fas fa-chevron-right'>",
            },
        },
        columns: [
            {
                //title: "No.",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Name",
                data: "applicant.FullName",
            },
            {
                //title: "Code",
                data: "staff.Code",
            },
            {
                //title: "Shift",
                data: "staff.Status",
                render: row => row === 0 ? lMorning : lNight,
            },
            {
                //title: "Location",
                data: null,
                render: row => !row.staff.Noted ? row.location.Company : row.staff.Noted,
            },
            {
                //title: "Check In",
                data: "attendance.CheckIn",
                render: row => row ? moment(row).format('DD/MMM/YY, LT') : ""
            },
            {
                //title: "Check Out",
                data: "attendance.CheckOut",
                render: row => row ? moment(row).format('DD/MMM/YY, LT') : ""
            },
            {
                //title: "Status",
                data: "Status",
            },
            {
                //title: "Actions",
                data: "attendance.Id",
                render: (row) => `<div> 
                                      <button onclick= "read('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                   </div>`,
            }
        ],
        buttons: [
            {
                title: lAttendanceList,
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: lAttendanceList,
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: lAttendanceList,
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: lAttendanceList,
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
    });
};


$("#refesh").click(() => location.reload());

//Get report attendance
const readReport = () => {
    $.ajax({
        url: "/api/hr/reports/get-attendance",
        type: "GET",
        data: {
            monthYear: monthYear.val(),
            staff: setStaff.val(),
            shift: shift.val(),
        }, 
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            $('.table').DataTable().destroy();
            $('.table tbody').empty();
            $.each(response, (index, row) => {
                let checkIn = row.CheckIn ? moment(row.CheckIn).format('DD/MMM/YY, LT') : "";
                let checkOut = row.CheckOut ? moment(row.CheckOut).format('DD/MMM/YY, LT') : "";
                let location = row.location.Company;
                var newRow = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${row.FullName}</td>
                                    <td>${row.Code}</td>
                                    <td>${row.Shift}</td>
                                    <td>${location}</td>
                                    <td>${checkIn}</td>
                                    <td>${checkOut}</td>
                                  </tr>`;
                $('.table tbody').append(newRow);
            });
            // Initialize DataTables
            $('.table').DataTable({
                dom: "Bfrtip",
                buttons: ["excel", "pdf", "print"],
                responive: true,
                autoWidth: false,
                destroy: true,
                language: {
                    paginate: {
                        previous: "<i class='fas fa-chevron-left'>",
                        next: "<i class='fas fa-chevron-right'>",
                    },
                },
                searching: false,
                lengthChange: false,
                buttons: [
                    {
                        title: "ATTENDANCE REPORT",
                        extend: "excelHtml5",
                        text: "<i class='fa fa-file-excel'> </i> Excel",
                        className: "btn btn-success btn-sm mt-2",
                    },
                    {
                        title: "ATTENDANCE REPORT",
                        extend: "print",
                        text: "<i class='fa fa-print'> </i> Print",
                        className: "btn btn-dark btn-sm mt-2",
                    },
                    {
                        title: "ATTENDANCE REPORT",
                        extend: "copy",
                        text: "<i class='fa fa-copy'> </i> Copy Text",
                        className: "btn btn-info btn-sm mt-2",
                    },
                ],
            });
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                //position: "top-end",
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: true,
                customClass: { title: 'custom-swal-title' },
                //timer: 1500,
            }) : console.log(xhr.responseText),
    });
};

//Add new
$("#add").click(() => {
    clear();
    setColor();
    modalDialog.modal('show');
});


//Save data
save.click(() => {
    let response = validate();
    let data = {
        Staff: setStaff.val(),
        CheckIn: checkIn.val(),
        CheckOut: checkOut.val(),
        Noted: noted.val(),
        CreatedBy: createdBy
    };

    response ? $.ajax({
        url: "/api/hr/attendances/create",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            reads();
            dataId.val(response.Id);
            tables.ajax.reload();

            clear();
            //modalDialog.modal("hide");
            Swal.fire({
                //position: "top-end",
                title: response.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            });
        },
        error: (xhr) => {
            xhr.responseJSON && xhr.responseJSON.message ?
                Swal.fire({
                    title: xhr.responseJSON.message,
                    icon: "warning",
                    showConfirmButton: true,
                    //timer: 1500,
                }) : console.log(xhr.responseText);
        },

    }) : false;
});

//Get data by Id
const read = (id) => {
    $.ajax({
        url: "/api/hr/attendances/read/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();

            dataId.val(response.attendance.Id); //object in controller
            setStaff.val(response.attendance.Staff); //object in controller
            checkIn.val(response.attendance.CheckIn);
            checkOut.val(response.attendance.CheckOut); //input that we declared on the top.val(response.Key-Database)
            noted.val(response.attendance.Noted);

            modalDialog.modal("show");
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                //position: "top-end",
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            }) : console.log(xhr.responseText),
    });
}

//Update data
update.click(() => {
    let response = validate();
    let data = {
        Staff: setStaff.val(),
        CheckIn: checkIn.val(),
        CheckOut: checkOut.val(),
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/attendances/update/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            tables.ajax.reload();

            clear();
            modalDialog.modal("hide");
            Swal.fire({
                //position: "top-end",
                title: response.message,
                icon: "success",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                //position: "top-end",
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            }) : console.log(xhr.responseText),
    }) : false;
});

//Delete data by id
const remove = (id) => {
    Swal.fire({
        title: lAreYouSure,
        text: lToDelete,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `<i class='fas fa-times-circle'></i> <span>${lCancel}</span>`,
        confirmButtonText: `<i class='fas fa-trash'></i> <span>${lOK}</span>`,
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/attendances/delete/" + id,
                success: (response) => {
                    tables.ajax.reload();

                    Swal.fire({
                        title: response.message,
                        icon: "success",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                },
                error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
                    Swal.fire({
                        //position: "top-end",
                        title: xhr.responseJSON.message,
                        icon: "error",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    }) : console.log(xhr.responseText),
            }) : param.dismiss === Swal.DismissReason.cancel &&
            Swal.fire({
                title: lTheSame,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                customClass: { title: 'custom-swal-title' },
            });
    }).catch((err) => console.log(err.message));
};

//Clear control
const clear = () => {
    update.hide();
    save.show();
    noted.val("");
    setStaff.val("-1");
    checkOut.val("");
    checkIn.val("");
};

//Set color to border control
const setColor = () => {
    setStaff.css("border-color", "#cccccc");
    checkIn.css("border-color", "#cccccc");
    checkOut.css("border-color", "#cccccc");
    noted.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (setStaff.val() === "-1") {
        Swal.fire({
            title: lSelectStaff,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        setStaff.css("border-color", "red");
        setStaff.focus();
        isValid = false;
    } else {
        setStaff.css("border-color", "#cccccc");
        if (checkIn.val() === "") {
            Swal.fire({
                title:  `${lSelect} ${lCheckIn}`,
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            checkIn.css("border-color", "red");
            checkIn.focus();
            isValid = false;
        } else {
            checkIn.css("border-color", "#cccccc");
            if (checkOut.val() === "") {
                Swal.fire({
                    title:  `${lSelect} ${lCheckOut}`,
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                checkOut.css("border-color", "red");
                checkOut.focus();
                isValid = false;
            } else {
                checkOut.css("border-color", "#cccccc");
            }
        }
    }
    return isValid;
};




