jQuery(document).ready(() => {
    getAll();
});

//Declare variable for use global
let tblAttendance = [];
let createdBy = $("#log-by").data("logcheckOutby");
let addNew = $("#add-new");
let update = $("#update");
let dataId = $("#data-id");
let refresh = $("#refresh");
let save = $("#save");

//You can change it whatever you want
let modalAtt = $("#modal-attendance");
let staffId = $("#staffAtt");
let checkIn = $("#checkIn");
let checkOut = $("#checkOut");
let idcheckIn = $("#checkin-id")
let idcheckOut = $("#checkout-id")
let checkOutbtn = $("#checkOutBtn")
let noted = $("#noted");
let Noaction = 0; // 0: No action, 1: Check In, 2: Check Out
let checkInTime = null;
let checkOutTime = null;

//Get all data
const getAll = () => {
    tblAttendance = $("#AttendanceTest").DataTable({
        ajax: {
            url: "/api/hr/attTest/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        //scrollX: true,

        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        language: {
            paginate: {
                previous: "<i class='fas fa-chevron-left'>",
                next: "<i class='fas fa-chevron-right'>",
            },
        },
        drawCallback: () => {
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded");
        },
        columns: [
            {
                title: "NO.",
                data: null,
                render: (data, type, row, meta) => {
                    return `${meta.row + 1}`;
                },
            },
            {
                title: "Code",
                data: "Staff.Code" //data:"table.fill"
            },
            {
                title: "Location",
                data: "Client.Company"
            },
            {
                title: "Check In",
                data: "AttendanceTest.CheckIn",
                render: function (data) {
                    if (data) {
                        return moment(data).format('DD/MMM/YY, h:mm a'); // Format date as dd/mmm/yyyy
                    } else {
                        return "Date can't be empty"; // Handle the case when data is null or undefined
                    }
                }
            },
            {
                title: "Check Out",
                data: "AttendanceTest.CheckOut",
                render: function (data) {
                    if (data) {
                        return moment(data).format('DD/MMM/YY, h:mm a'); // Format date as dd/mmm/yyyy
                    } else {
                        return "Date can't be empty"; // Handle the case when data is null or undefined
                    }
                }

            },
            {
                title: "Note",
                data: "AttendanceTest.Noted"
            },
            {
                title: "Action",
                data: "AttendanceTest.Id",
                render: (row) => {
                    return `<div> 
                      <button onclick= "edit('${row}')" class= 'btn btn-warning btn-sm' >
                          <span class='fas fa-edit'></span>
                      </button>
                      <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                          <span class='fas fa-trash-alt'></span>
                      </button>
                    </div>`;
                },
            }
        ],
        buttons: [
            {
                title: "Report of Users",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "Report of Users",
                extend: "pdfHtml5",
                text: "<i class='fa fa-file-pdf'> </i> PDF",
                className: "btn btn-danger btn-sm mt-2",
            },
            {
                title: "Report of Users",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "Report of Users",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "Report of Users",
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
    })
}

//Add new
addNew.click(() => {
    //clear();
    //setColor();
    // Show the modal using .modal('show')
    $("#modal-attendanceTest").modal('show');

});
checkOutbtn.click(() => {
    //clear();
    //setColor();
    // Show the modal using .modal('show')
    $("#modal-Out").modal('show');

});


function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const year = date.getFullYear() % 100; // Get the last two digits of the year
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}



function checkStatus(action) {
    if (action === 1) {
        if (idcheckIn.val() === 1) {
            alert("You have already checked in.");
        } else {
            const currentDate = new Date();
            checkInTime = currentDate.toISOString();

            currentStatus = 1;
            alert("Check In recorded at " + formatDateTime(checkInTime));
        }
    } else if (action === 2) {
        if (Noaction === 0) {
            alert("You must check in before checking out.");
        } else if (idcheckOut.val() === 2) {
            alert("You have already checked out.");
        } else {
            const currentDate = new Date();
            checkOutTime = currentDate.toISOString();
            Noaction = 2;
            alert("Check Out recorded at " + formatDateTime(checkOutTime));
        }
    }
}





