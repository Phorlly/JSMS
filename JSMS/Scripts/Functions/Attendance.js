jQuery(document).ready(() => {
    loadingGif();
    monthYear.change(() => getReportAttendance());
    byShift.change(() => getReportAttendance());
    byStaff.change(() => getReportAttendance());
    getReportAttendance();
    $("#title-attendance").show();
    $("#tite-report").hide();
    showData.click(() => getAttendance());
});

//Declare variable for use global
let tblAttendance = [];
let createdBy = $("#log-by").data("logby");
let addNew = $("#add-new");
let update = $("#update");
let dataId = $("#data-id");
let refresh = $("#refresh");
let save = $("#save");
let monthYear = formatMonthYear("#month-year");
let byStaff = $("#by-staff");
let byShift = $("#by-shift");
let tabAttendance = $("#tab-attendance");
let tabSummary = $("#tab-summary");

//You can change it whatever you want
let modalAtt = $("#modal-attendance");
let staff = $("#staff");
let checkIn = $("#check-in");
let checkOut = $("#check-out");
let noted = $("#noted");
let showData = $("#show-data");

const getAttendance = () => {
    tblAttendance = $("#attendance").DataTable({
        ajax: {
            url: "/api/hr/attendances/get",
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
        drawCallback: () => $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
        columns: [
            {
                //title: "No.",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Name",
                data: null,
                render: (row) => {
                    return `${row.Applicant.Name} ${row.Applicant.NickName}`;
                },
            },
            {
                //title: "Code",
                data: "Staff.Code",
            },
            {
                //title: "Shift",
                data: "Staff.Status",
                render: row => row === 0 ? "ថ្ងៃ" : "យប់",
            },
            {
                //title: "Location",
                data: "Staff.Noted",
            },
            {
                //title: "Check In",
                data: "Attendance.CheckIn",
                render: row => row ? moment(row).format('DD/MMM/YY, LT') : ""
            },
            {
                //title: "Check Out",
                data: "Attendance.CheckOut",
                render: row => row ? moment(row).format('DD/MMM/YY, LT') : ""
            },
            {
                //title: "Status",
                data: "Status",
            },
            {
                //title: "Actions",
                data: "Attendance.Id",
                render: (row) => `<div> 
                                      <button onclick= "edit('${row}')" class= 'btn btn-warning btn-sm' >
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
                title: "បញ្ជីវត្តមានរបស់បុគ្គលិក",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "បញ្ជីវត្តមានរបស់បុគ្គលិក",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "បញ្ជីវត្តមានរបស់បុគ្គលិក",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "បញ្ជីវត្តមានរបស់បុគ្គលិក",
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
        error: (xhr) => {
            xhr.responseJSON && xhr.responseJSON.message ?
                toastr.error(xhr.responseJSON.message, "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ") :
                console.log(xhr.responseText);
        },
    });
};

//Hide show tab
tabAttendance.click(() => {
    addNew.show();
    showData.show();
    $("#title-attendance").show();
    $("#tite-report").hide();
});
tabSummary.click(() => {
    addNew.hide();
    showData.hide();
    $("#title-attendance").hide();
    $("#tite-report").show();
});


//Get report attendance
const getReportAttendance = () => {
    $.ajax({
        url: "/api/hr/reports/get-attendance",
        type: "GET",
        data: {
            monthYear: monthYear.val(),
            staff: byStaff.val(),
            shift: byShift.val(),
        },
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            $('#attendance-summary').DataTable().destroy();
            $('#attendance-summary tbody').empty();
            $.each(response, (index, row) => {
                let checkIn = row.CheckIn ? moment(row.CheckIn).format('DD/MMM/YY, LT') : "";
                let checkOut = row.CheckOut ? moment(row.CheckOut).format('DD/MMM/YY, LT') : "";
                var newRow = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${row.Name}</td>
                                    <td>${row.Code}</td>
                                    <td>${row.Shift}</td>
                                    <td>${row.Location}</td>
                                    <td>${checkIn}</td>
                                    <td>${checkOut}</td>
                                  </tr>`;
                $('#attendance-summary tbody').append(newRow);
            });
            // Initialize DataTables
            $('#attendance-summary').DataTable({
                dom: "Bfrtip",
                buttons: ["excel", "pdf", "print"],
                responive: true,
                autoWidth: false,
                language: {
                    paginate: {
                        previous: "<i class='fas fa-chevron-left'>",
                        next: "<i class='fas fa-chevron-right'>",
                    },
                },
                drawCallback: () => $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
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
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            }) : console.log(xhr.responseText),
    });
};

//Add new
addNew.click(() => {
    clear();
    setColor();
    modalAtt.modal('show');
});


//Save data
save.click(() => {
    let response = validate();
    let data = {
        Staff: staff.val(),
        CheckIn: checkIn.val(),
        CheckOut: checkOut.val(),
        Noted: noted.val(),
        CreatedBy: createdBy
    };

    response ? $.ajax({
        url: "/api/hr/attendances/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                tblAttendance.ajax.reload();

                clear();
                //modalAtt.modal("hide");
                Swal.fire({
                    //position: "top-end",
                    title: response.message,
                    icon: "success",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
            },
            400: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    Swal.fire({
                        //position: "top-end",
                        title: xhr.responseJSON.message,
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    }) : console.log(xhr.responseText);
            },
            404: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    toastr.error(xhr.responseJSON.message, "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ") :
                    console.log(xhr.responseText);
            },
            500: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    toastr.error(xhr.responseJSON.message, "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ") :
                    console.log(xhr.responseText);
            },
        },
    }) : false;
});

//Get data by Id
const edit = (id) => {
    $.ajax({
        url: "/api/hr/attendances/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();

            dataId.val(response.Attendance.Id); //object in controller
            staff.val(response.Attendance.Staff); //object in controller
            checkIn.val(response.Attendance.CheckIn);
            checkOut.val(response.Attendance.CheckOut); //input that we declared on the top.val(response.Key-Database)
            noted.val(response.Attendance.Noted);

            modalAtt.modal("show");
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
        staff: staff.val(),
        CheckIn: checkIn.val(),
        CheckOut: checkOut.val(),
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/attendances/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            tblAttendance.ajax.reload();

            clear();
            modalAtt.modal("hide");
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
        title: "តើអ្នកប្រាកដដែរឬទេ?",
        text: "ថាចង់លុបទិន្នន័យមួយនេះចេញ !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/attendances/delete-by-id/" + id,
                success: (response) => {
                    tblAttendance.ajax.reload();

                    Swal.fire({
                        title: response.message,
                        icon: "success",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                },
                400: (xhr) => {
                    xhr.responseJSON && xhr.responseJSON.message ?
                        toastr.error(xhr.responseJSON.message, "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ") :
                        console.log(xhr.responseText);
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
                title: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថភាពដដែល 🥰",
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
    staff.val("-1");
    checkOut.val("");
    checkIn.val("");
};

//Set color to border control
const setColor = () => {
    staff.css("border-color", "#cccccc");
    checkIn.css("border-color", "#cccccc");
    checkOut.css("border-color", "#cccccc");
    noted.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (staff.val() === "-1") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        staff.css("border-color", "red");
        staff.focus();
        isValid = false;
    } else {
        staff.css("border-color", "#cccccc");
        if (checkIn.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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




