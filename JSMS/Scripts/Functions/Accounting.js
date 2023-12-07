jQuery(document).ready(() => {
    datePicker("#start-date");
    datePicker("#end-date");
    getSalaryReport();
    startDate.change(() => getSalaryReport());
    endDate.change(() => getSalaryReport());
    staffId.change(() => getSalaryReport());
    shiftType.change(() => getSalaryReport());
    $('#t2').hide();
    $('#show-data').click(() => location.reload());
});

//Declare variable
let pushedRecords = [];
let startDate = formatMonthYear("#start-date");
let endDate = formatMonthYear("#end-date");
let staffId = $("#staff-id");
let shiftType = $("#shift-type");

//Get report accounting
const getSalaryReport = () => {
    $.ajax({
        url: "/api/hr/reports/get-salary",
        type: "GET",
        data: {
            start: startDate.val(),
            end: endDate.val(),
            staff: staffId.val(),
            shift: shiftType.val(),
        },
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            $('#accounting-summary').DataTable().destroy();
            $('#accounting-summary tbody').empty();
            $.each(response, (index, row) => {
                let newRow = `<tr>
                                   <td>${index + 1}</td>
                                   <td>${row.FullName}</td>
                                   <td>${row.Code}</td>
                                    <td>${row.Shift}</td>
                                    <td>${row.Location}</td>
                                    <td>${row.TotalWorked}x</td>
                                    <td>${row.TotalAbsent}x</td>
                                    <td>${row.TotalPayment.toFixed(2)}<sup>$</sup></td>
                                    <td>
                                        <button onclick= "pushToGetPayroll('${row.Id}',
                                                                           '${row.FullName}',
                                                                           '${row.Code}',
                                                                           '${row.Shift}',
                                                                           '${row.Location}',
                                                                           '${row.TotalWorked}',
                                                                           '${row.TotalAbsent}',
                                                                           '${row.TotalPayment}')" class= 'btn btn-dark btn-sm' >
                                                 <span class='fas fa-file-export'></span> Push
                                        </button>
                                    </td>
                               </tr>`;
                $('#accounting-summary tbody').append(newRow);
            });
        },
        error: err => console.log(err),
    });
};

//Get data
const updateData = () => {
    $('#get-payroll').DataTable().destroy();
    $('#get-payroll tbody').empty();

    //Initialize DataTables
    $('#get-payroll').DataTable({
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
                title: "PAYROLL REPORT",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "PAYROLL REPORT",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "PAYROLL REPORT",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
        ],
    });
}


// Function to push data from accounting-summary to get-payroll
const pushToGetPayroll = (id, name, code, shift, location, totalWorked, totalAbsent, totalPayment) => {
    $('#t2').show();
    updateData();
    // Check if totalPayment is a valid number
    totalPayment = isNaN(totalPayment) ? 0 : parseFloat(totalPayment);

    // Assuming 'get-payroll' is the ID of your DataTable
    let dataTable = $('#get-payroll').DataTable();

    // Add the new row to the DataTable
    dataTable.row.add([
        id,
        name,
        code,
        shift,
        location,
        totalWorked + 'x',
        totalAbsent + 'x',
        totalPayment.toFixed(2) + '<sup>$</sup>'
    ]).draw(); // Draw the DataTable to reflect the changes
};


