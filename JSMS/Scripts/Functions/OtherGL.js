$(document).ready(() => {
    loadingGif();
    getTotalFromAPI();
    getAll();
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

btnExpense.click(() => {
    clearGL();
    modalExpense.modal("show");
    updateExpense.hide();
    expenseSave.show();
    getTotalFromAPI();

    //hide select option 
    for (let i = 1; i <= 23; i++) {
        expenseType.find(`option[value="${i}"]`).hide();
    }
    expenseType.find('option[value="24"]').show();
});

refresh.click(() => {
    location.reload();
})

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
        // responsive: true,
        // autoWidth: false,
        //scrollX: true,
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
                data:"InvoiceID"
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
                data:"PaymentType"
            },
            {
                //title: "Note",
                data:"Note"
            },
            {
                //title: "Action",
                data: "Id",
                render: (row) => {
                    return `<div> 
                    <button onclick= "editExpense('${row}')" class= 'btn btn-warning btn-sm' >
                        <span class='fas fa-edit'></span>
                    </button>
                    <button onclick= "removeExpense('${row}')" class= 'btn btn-danger btn-sm' >
                        <span class='fas fa-trash-alt'></span>
                    </button>
                  </div>`;
                },
            },
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
            error: function (error) {
                console.error("Error fetching total:", error);
            }
        });
};

//show text from select option
const translationData = {
    "1": "ចំណូលពីការឧបត្ថម្ភស្ម័គ្រចិត្ត",
    "2": "ចំណូលពីការលក់សេវាកម្ម",
    "3": "ចំណូលពីការពីការឧបត្ថម្ភពីរដ្ឋ",
    "4": "ប្រាក់ចំណូលពីការលក់ផលិតផល",
    "5": "ចំណូលពីថ្លៃសេវា",
    "6": "ប្រាក់ចំណូលពីការផ្សាយពាណិជ្ជកម្ម",
    "7": "ចំណូលពីចំណូលការប្រាក់",
    "8": "ចំណូលពីសួយសារអាករ",
    "9": "ចំណូលពីថ្លៃប្រឹក្សាយោបល់",
    "10": "បង់ពន្ធប្រចាំខែ",
    "11": "បង់ពន្ធប្រចាំឆ្នាំ",
    "12": "ផាកពិន័យពន្ធ",
    "13": "ប្រាក់បៀវត្សរ៍និងប្រាក់ឈ្នួលរបស់និយោជិត",
    "14": "ថ្លៃសម្ភារៈ និងការផ្គត់ផ្គង់",
    "15": "ការចំណាយលើការជួលទីតាំង",
    "16": "ការផ្គត់ផ្គង់ក្រុមហ៊ុន (អគ្គិសនី, ថ្លៃទឹក)",
    "17": "ការចំណាយលើការធានារ៉ាប់រង",
    "18": "ថ្លៃថែទាំ និងជួសជុល",
    "19": "ការចំណាយលើទីផ្សារ និងការផ្សាយពាណិជ្ជកម្ម",
    "20": "ការចំណាយលើសម្ភារៈ",
    "21": "ការចំណាយលើការធ្វើដំណើរ និងការកម្សាន្ត",
    "23": "ផ្សេងៗ"
    // Add more mappings as needed
};

const ExpenseType = (value) => {
    return translationData[value] || value;
}; const mapExpenseType = (value) => {
    return translationData[value] || value;
};

// Get the selected value from the activityExpense
activityExpense.on('change', function () {   
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
        expenseType.find('option[value="24"]').hide();
    } else if (selectedValue === '2') {
        // Show specific options in the expenseType dropdown
        for (let i = 11; i <= 22; i++) {
            expenseType.find(`option[value="${i}"]`).show();
            expenseType.find('option[value="23"]').show();
        }
        for (let i = 1; i <= 9; i++) {
            expenseType.find(`option[value="${i}"]`).hide();
        }
        expenseType.find('option[value="24"]').hide();
    } else {
        //hide select option
        for (let i = 1; i <= 23; i++) {
            expenseType.find(`option[value="${i}"]`).hide();
        }
        expenseType.find('option[value="24"]').show();
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
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                tableGL.ajax.reload();
                clearGL();
                modalExpense.modal("hide");
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
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.Message === "InvoiceID already exists.") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Invoice code already exists. Please use a different Invoice code",
                        });
                    } else if (xhr.responseJSON.Message === "Expense cannot exceed total income.") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Expense cannot exceed total income.",
                        });
                    } else if (xhr.responseJSON.Message === "Cost must be greater than 0") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Cost must be greater than 0",
                        });
                    } else {
                        console.log(xhr.responseText);
                    }
                } else {
                    console.log(xhr.responseText);
                }
            },
            404: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    toastr.error(xhr.responseJSON.message, "មានបញ្ហាកើតឡើងសូមពិនិត្យម្ដងទៀត") :
                    console.log(xhr.responseText);
            },
            500: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    toastr.error(xhr.responseJSON.message, "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ") :
                    console.log(xhr.responseText);
            },
        },
    }) : false; 
})

const editExpense = (id) => {
    getTotalFromAPI();

    $.ajax({
        url: "/api/hr/otherexpense/get/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                console.log(response);
                //setColorStock();
                clearGL();
                updateExpense.show();
                expenseSave.hide();

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
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                tableGL.ajax.reload();
                clearGL();
                modalExpense.modal("hide");

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
                if (xhr.responseJSON) {
                    if (xhr.responseJSON.Message === "InvoiceID already exists.") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Invoice code already exists. Please use a different Invoice code",
                        });
                    } else if (xhr.responseJSON.Message === "Expense cannot exceed total income.") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Expense cannot exceed total income.",
                        });
                    } else if (xhr.responseJSON.Message === "Cost must be greater than 0") {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Cost must be greater than 0",
                        });
                    } else {
                        console.log(xhr.responseText);
                    }
                } else {
                    console.log(xhr.responseText);
                }
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

const removeExpense = (id) => {
    Swal.fire({
        title: "ខ្ញុំខ្លាំង",
        text: "ទេ! ខ្ញុំខ្លាំងជាង",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value ?
            $.ajax({
                method: "DELETE",
                url: "/api/hr/otherexpense/delete/" + id,
                statusCode: {
                    200: (response) => {
                        tableGL.ajax.reload();
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
            }) : param.dismiss === Swal.DismissReason.cancel &&
            Swal.fire({
                title: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថិភាព",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                customClass: { title: 'custom-swal-title' },
            });
    }).catch((err) => console.log(err.message));
};

const clearGL= () => {
    dateExpense.val("");
    expenseInvoice.val("");
    expenseType.val("0");
    costExpense.val("");
    activityExpense.val("0");
    paymentType.val("0");
    noteExpense.val("");
};

const ValidateExpense = () => {
    let isValid = true;
    if (dateExpense.val() === "")
    {
        Swal.fire({
            title: "សូមជ្រើសរើសកាលបរិច្ឆេទ",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        dateExpense.css("border-color", "red");
        dateExpense.focus();
        isValid = false;
    }
    else
    {
        dateExpense.css("border-color", "#cccccc");
        if (activityExpense.val() === "0") {
            Swal.fire({
                title: "សូមជ្រើសរើសប្រតិបត្តិការ",
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
                    title: "សូមបំពេញលេខវិកយប័ត្រ",
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
                        title: "សូមជ្រើសរើសគោលបំណង",
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
                            title: "សូមបំពេញតម្លៃសរុប",
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
                                title: "សូមជ្រើសរើសប្រភេទបង់ប្រាក់",
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
                            if (expenseType .val() === "24") {
                                Swal.fire({
                                    title: "សូមជ្រើសរើសប្រតិបត្តិការសិន",
                                    icon: "warning",
                                    showConfirmButton: false,
                                    customClass: { title: 'custom-swal-title' },
                                    timer: 1500,
                                });
                                activityExpense.css("border-color", "red");
                                activityExpense.focus();
                                isValid = false;
                            }
                        }
                    }
                } 
            } 
        } 
        
    } 

    return isValid;
};