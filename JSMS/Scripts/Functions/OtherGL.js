$(document).ready(() => {
    loadingGif();
    getTotalFromAPI();
    numberOnly("cost-expense");
    datePicker("#date-expense");
});

let tableGL = [];
let dataId = $("#data-id");
let expenseSave = $("#save-expense");
let modalExpense = $("#otherexpenseModal");
let updateExpense = $("#update-expense");
let btnExpense = $("#add-new");
let refresh = $("#refresh");
let totalbtn = $("#total");

//Expense
let dateExpense = $("#date-expense");
let activityExpense = $("#expense-activity");
let expenseInvoice = $("#invoice-expense");
let expenseType = $("#expense-type");
let costExpense = $("#cost-expense");
let noteExpense = $("#note");
let paymentType = $("#payment-expense");

$("#add-new").click(() => {
    clearGL();
    getTotalFromAPI();
    setColors();

    //hide select option 
    for (let i = 1; i <= 23; i++) {
        expenseType.find(`option[value="${i}"]`).hide();
    }

    modalExpense.modal("toggle");
});

const ExpenseType = (value) => {
    return translationData[value] || value;
};
const mapExpenseType = (value) => {
    return translationData[value] || value;
};

refresh.click(() => {
    location.reload();
})

$("#show-data").click(() => getAll());

totalbtn.click(() => {
    getTotalFromAPI();
})

//Get all data
const getAll = () => {
    tableGL = $("#tblOtherGL").DataTable({
        order: [[0, "desc"]],
        ajax: {
            url: "/api/hr/otherexpense/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        //scrollX: true,
        destroy: true,
        dom: "Bfrtip",
        buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
        language: {
            paginate: {
                previous: "<i class='fas fa-chevron-left'>",
                next: "<i class='fas fa-chevron-right'>",
            },
        },
        drawCallback: () => $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
        columns: [
            {
                //title: "N.O",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Invoice Code",
                data: "InvoiceID"
            },
            {
                //title: "Date",
                data: "Date",
                render: function (data, type, row) {
                    // Format the date using moment.js
                    return moment(data).format("DD/MMM/YYYY");
                },
            },

            {
                //title: "Cost($)",
                data: "Cost",
                render: (data, type, row) => {
                    // Set the color based on the value
                    const colorClass = data < 0 ? 'text-danger' : 'text-primary';
                    return `<div class="d-flex justify-content-between ${colorClass}">
                    <span>${data}</span>
                    <span>${' $'}</span>
                </div>`;
                },
            },
            {
                //title: "ExpenseType",
                data: "ExpenseType",
                render: function (data, type, row) {
                    return mapExpenseType(data);
                },
            },
            {
                //title: "Payment Type",
                data: "PaymentType"
            },
            {
                //title: "Note",
                data: "Note"
            },
            {
                //title: "Action",
                data: "Id",
                render: (row) => {
                    return `<div> 
                    <button onclick="editExpense('${row}')" class='btn btn-warning btn-sm' >
                        <span class='fas fa-edit'></span>
                    </button>
                    <button onclick="removeExpense('${row}')" class='btn btn-danger btn-sm'  >
                        <span class='fas fa-trash-alt'></span>
                    </button>
                  </div>`;
                },
            },
        ],
        buttons: [
            {
                title: "Report of General Leger",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "Report of General Leger",
                extend: "pdfHtml5",
                text: "<i class='fa fa-file-pdf'> </i> PDF",
                className: "btn btn-danger btn-sm mt-2",
            },
            {
                title: "Report of General Leger",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "Report of General Leger",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "Report of General Leger",
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],

    });
};

// Function to get the total from the API
const getTotalFromAPI = () => {
    $.ajax({
        url: "/api/hr/otherexpense/getTotal", // Replace with your actual API endpoint
        method: "GET",

        success: function (data) {
            // Update the content of the card with the received total
            $("#totalValue").text("$ " + (data !== null ? data : "00.00"));
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            }) : console.log(xhr.responseText),
    });
};

//show text from select option
const translationData = {
    "1": lIncomeSponsored,
    "2": lIncomeService,
    "3": lIncomeState,
    "4": lIncomeSell,
    "5": lIncomeCost,
    "6": lIncomeAds,
    "7": lIncomeExpensive,
    "8": lIncomeTax,
    "9": lIncomeAdvisor,
    "10": lExpenseTaxMonthly,
    "11": lExpenseTaxYearly,
    "12": lExpeseTaxFine,
    "13": lExpenseSalary,
    "14": lExpenseCostMateial,
    "15": lExpenseRent,
    "16": lExpenseSupport,
    "17": lExpenseInsurence,
    "18": lExpenseMaintenance,
    "19": lExpenseMarkrting,
    "20": lExpenseMaterial,
    "21": lExpenseTravel,
    "23": lOther
    // Add more mappings as needed
};

// Get the selected value from the activityExpense
activityExpense.change(() => {
    // Get the selected value from the activityExpense dropdown
    let selectedValue = activityExpense.val();

    // Check the selected value and perform actions accordingly
    if (selectedValue === '1') {
        for (let i = 1; i <= 9; i++) {
            expenseType.find(`option[value="${i}"]`).show();
            expenseType.find('option[value="23"]').show();
        }
        for (let i = 10; i <= 22; i++) {
            expenseType.find(`option[value="${i}"]`).hide();
        }
        expenseType.val("0");
    } else if (selectedValue === '2') {
        // Show specific options in the expenseType dropdown
        for (let i = 11; i <= 22; i++) {
            expenseType.find(`option[value="${i}"]`).show();
            expenseType.find('option[value="23"]').show();
        }
        for (let i = 1; i <= 9; i++) {
            expenseType.find(`option[value="${i}"]`).hide();
        }
        expenseType.val("0");
    } else {
        //hide select option
        for (let i = 1; i <= 23; i++) {
            expenseType.find(`option[value="${i}"]`).hide();
        }
        expenseType.val("0");
    }
});

//save data
expenseSave.click(() => {

    let response = ValidateExpense();
    let data = {
        Date: dateExpense.val(),
        Status: activityExpense.val(),
        InvoiceID: expenseInvoice.val(),
        ExpenseType: expenseType.val(),
        Cost: costExpense.val(),
        PaymentType: paymentType.val(),
        Note: noteExpense.val()
    };

    response ? $.ajax({
        url: "/api/hr/otherexpense/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: response => {
            dataId.val(response.Id);
            tableGL.ajax.reload();
            clearGL();
            getAll();
            getTotalFromAPI();
            //modalExpense.modal("hide");
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
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            }) : console.log(xhr.responseText),
    }) : false;
})

const editExpense = (id) => {

    $.ajax({
        url: "/api/hr/otherexpense/get/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: response => {
            //console.log(response);
            updateExpense.show();
            expenseSave.hide();
            setColors();
            getTotalFromAPI();

            dataId.val(response.Id);
            dateExpense.val(formatDate(response.Date));
            activityExpense.val(response.Status);
            expenseInvoice.val(response.InvoiceID);
            expenseType.val(response.ExpenseType);
            costExpense.val("");
            paymentType.val(response.PaymentType);
            noteExpense.val(response.Note);
            modalExpense.modal("show");
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

updateExpense.click(() => {
    let response = ValidateExpense();
    let data = {
        Date: dateExpense.val(),
        Status: activityExpense.val(),
        InvoiceID: expenseInvoice.val(),
        ExpenseType: expenseType.val(),
        Cost: costExpense.val(),
        PaymentType: paymentType.val(),
        Note: noteExpense.val(),
    };

    response ? $.ajax({
        url: "/api/hr/otherexpense/put/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            tableGL.ajax.reload();
            getTotalFromAPI();
            getAll();
            Swal.fire({
                //position: "top-end",
                title: response.message,
                icon: "success",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });

            modalExpense.modal("hide");
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

const removeExpense = (id) => {
    Swal.fire({
        title: lAreYouSure,
        text: lToDelete,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `<i class='fas fa-times-circle'></i> <span>${lCancel}</span>`,
        confirmButtonText: `<i class='fas fa-trash'></i> <span>${lOK}</span>`,
    }).then((param) => {
        param.value ?
            $.ajax({
                method: "DELETE",
                url: "/api/hr/otherexpense/delete/" + id,
                success: (response) => {
                    tableGL.ajax.reload();
                    getAll();
                    getTotalFromAPI();
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

const clearGL = () => {
    setCurrentDate("#date-expense");
    expenseInvoice.val("");
    expenseType.val("0");
    costExpense.val("");
    activityExpense.val("0");
    paymentType.val("0");
    noteExpense.val("");
    updateExpense.hide();
    expenseSave.show();
};

const setColors = () => {
    activityExpense.css("border-color", "#cccccc");
    costExpense.css("border-color", "#cccccc");
    paymentType.css("border-color", "#cccccc");
    expenseInvoice.css("border-color", "#cccccc");
    expenseType.css("border-color", "#cccccc");
};

const ValidateExpense = () => {
    let isValid = true;
    if (activityExpense.val() === "0") {
        Swal.fire({
            title: `${lSelect} ${lIncomeOrExpense}`,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        activityExpense.css("border-color", "red");
        activityExpense.focus();
        isValid = false;
    }
    else {
        activityExpense.css("border-color", "#cccccc");
        if (expenseInvoice.val() === "") {
            Swal.fire({
                title: `${lInput} ${lInvoiceNumber}`,
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            expenseInvoice.css("border-color", "red");
            expenseInvoice.focus();
            isValid = false;
        }
        else {
            expenseInvoice.css("border-color", "#cccccc");
            if (expenseType.val() === "0") {
                Swal.fire({
                    title: `${lSelect} ${lTransaction}`,
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                expenseType.css("border-color", "red");
                expenseType.focus();
                isValid = false;
            }
            else {
                expenseType.css("border-color", "#cccccc");
                if (costExpense.val() === "") {
                    Swal.fire({
                        title: `${lInput} ${lCost}`,
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    costExpense.css("border-color", "red");
                    costExpense.focus();
                    isValid = false;
                }
                else {
                    costExpense.css("border-color", "#cccccc");
                    if (paymentType.val() === "0") {
                        Swal.fire({
                            title: `${lSelect} ${lPaymentType}`,
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        paymentType.css("border-color", "red");
                        paymentType.focus();
                        isValid = false;
                    }
                    else {
                        paymentType.css("border-color", "#cccccc");
                    }
                }
            }
        }
    }

    return isValid;
};