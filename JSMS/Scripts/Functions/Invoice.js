
$(document).ready(() => {
    //loadingGif();
    //getTotalFromAPI();
    getAll();
});

let tableInvoice = [];
let dataId = $("#data-id");
let saveBtn = $("#saveInvoice");
let updateBtn = $("#update-invoice");
let modalInvoice = $("#invoiceModal");
let updateInvoice = $("#update-invoice");
let AddNewBtn = $("#add-new");
let refresh = $("#refresh");
let invoiceModal = $("#generateInvoiceModal");

//Input
let startDate = $("#start-date");
let endDate = $("#end-date");
let invoiceNumber = $("#invoice-number");
let clientId = $("#clientId");
let descripe = $("#description");
let qty = $("#quantity");
let unitPrice = $("#unit-price");
let tax = $("#tax");
let amount = $("#amount");
let total = $("#total");
let note = $("#note");

//Generate Invoice
let GstartDate = $("#Gstart-date");
let GendDate = $("#Gend-date");
let GinvoiceNumber = $("#Ginvoice-number");
let GclientId = $("#GclientId");
let Gdescripe = $("#Gdescription");
let Gqty = $("#Gquantity");
let GunitPrice = $("#Gunit-price");
let Gtax = $("#Gtax");
let Gamount = $("#Gamount");
let Gtotal = $("#Gtotal");
let Gnote = $("#GSnote");
let GsubTotal = $("#Gsub-total");


AddNewBtn.click(() => {
    clear();
    modalInvoice.modal("show");
    updateInvoice.hide();
});

refresh.click(() => {
    location.reload();
})


//Get all data
const getAll = () => {
    tableInvoice = $("#tbl-invoice").DataTable({
        order: [[0, "desc"]],
        ajax: {
            url: "/api/hr/invoice/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        scrollX: true,
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
                title: "N.O",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {

                data: "Invoice.InvoiceNumber"
            },
            {
                data: "Invoice.Description"
            },
            {

                data: "Invoice.StartDate",
                render: function (data, type, row) {
                    // Format the date using moment.js
                    return moment(data).format("DD/MMM/YYYY");
                },
            },
            {

                data: "Client.Name"
            },
            {

                data: "Invoice.Total"
            },
            {

                data: "Invoice.Note"
            },
            {

                data: "Invoice.Id",
                render: (row) => {
                    return `<div> 
                    <button onclick= "edit('${row}')" class= 'btn btn-warning btn-sm' >
                        <span class='fas fa-edit'></span>
                    </button>
                    <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                        <span class='fas fa-trash-alt'></span>
                    </button>
                     <button onclick= "generateInvoice('${row}')" class= 'btn btn-success btn-sm' >
                        <span class='fas fa-print'></span>
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

function generateInvoice(id) {

    $.ajax({
        url: "/api/hr/invoice/get/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            console.log(response);
            updateBtn.show();
            saveBtn.hide();
            invoiceModal.modal("show");

            dataId.val(response.Invoice.Id);
            GstartDate.text(convertToKhmerDate(response.Invoice.StartDate));
            GendDate.text(convertToKhmerDate(response.Invoice.EndDate));
            GinvoiceNumber.text(response.Invoice.InvoiceNumber);
            GclientId.text(response.Client.Company);
            Gdescripe.text(response.Invoice.Description);
            Gqty.text(response.Invoice.Qty);
            GunitPrice.text(response.Invoice.UnitPrice);
            GsubTotal.text(response.Invoice.Amount); //subtotal
            Gamount.text(response.Invoice.Amount); //subtotal
            Gtax.text(response.Invoice.Tax);
            Gtotal.text(response.Invoice.Total);

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

function calculateAmount() {
    // Get the values of quantity and unit price
    var quantity = parseFloat(document.getElementById('quantity').value) || 0;
    var unit = parseFloat(document.getElementById('unit-price').value) || 0;
    var taxPercentage = parseFloat(document.getElementById('tax').value) || 0;

    // Calculate the amount
    var AmountCalculated = quantity * unit;

    // Calculate tax (default to 0% if not specified)
    var taxValue = AmountCalculated * taxPercentage / 100;

    // Calculate total
    var totalValue = AmountCalculated + taxValue;

    // Update the input field
    document.getElementById('total').value = totalValue.toFixed(2);
    document.getElementById('amount').value = AmountCalculated.toFixed(2);
}

//This line is saying: "When there is an input event (typing, pasting, etc.) 
//in the element with the ID 'quantity', call the calculateAmount function."
document.getElementById('quantity').addEventListener('input', calculateAmount);
document.getElementById('unit-price').addEventListener('input', calculateAmount);
document.getElementById('tax').addEventListener('input', calculateAmount);

saveBtn.click(() => {

    calculateAmount();
    let response = Validate();

    let data = {
        StartDate: startDate.val(),
        EndDate: endDate.val(),
        InvoiceNumber: invoiceNumber.val(),
        ClientId: clientId.val(),
        Description: descripe.val(),
        Qty: qty.val(),
        UnitPrice: unitPrice.val(),
        Tax: parseFloat(document.getElementById('tax').value) || 0,
        Total: parseFloat(document.getElementById('total').value) || 0,
        Note: note.val(),
        Amount: parseFloat(document.getElementById('amount').value) || 0
    };

    response ? $.ajax({
        url: "/api/hr/invoice/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            tableInvoice.ajax.reload();
            clear();
            modalInvoice.modal("hide");
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
})

const edit = (id) => {
    $.ajax({
        url: "/api/hr/invoice/get/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            console.log(response);
            updateBtn.show();
            saveBtn.hide();

            dataId.val(response.Invoice.Id);
            startDate.val(formatDate(response.Invoice.StartDate));
            endDate.val(formatDate(response.Invoice.EndDate));
            invoiceNumber.val(response.Invoice.InvoiceNumber);
            clientId.val(response.Invoice.ClientId);
            descripe.val(response.Invoice.Description);
            qty.val(response.Invoice.Qty);
            unitPrice.val(response.Invoice.UnitPrice);
            tax.val(response.Invoice.Tax);
            amount.val(response.Invoice.Amount);
            total.val(response.Invoice.Total);
            note.val(response.Invoice.Note);
            modalInvoice.modal("show");
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

updateBtn.click(() => {
    let response = Validate();

    let data = {
        StartDate: startDate.val(),
        EndDate: endDate.val(),
        InvoiceNumber: invoiceNumber.val(),
        ClientId: clientId.val(),
        Description: descripe.val(),
        Qty: qty.val(),
        UnitPrice: unitPrice.val(),
        Tax: parseFloat(tax.val()).toFixed(2),
        Total: parseFloat(document.getElementById('total').value) || 0,
        Note: note.val(),
        Amount: parseFloat(document.getElementById('amount').value) || 0
    };

    response ? $.ajax({
        url: "/api/hr/invoice/put/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            tableInvoice.ajax.reload();
            clear();
            modalInvoice.modal("hide");

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

const remove = (id) => {
    Swal.fire({
        title: "តើអ្នកប្រាកដដែលឬទេ?",
        text: "ទិន្នន័យដែលលុបមិនអាចទាញមកវិញបានទេ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value ?
            $.ajax({
                method: "DELETE",
                url: "/api/hr/invoice/delete/" + id,
                success: (response) => {
                    tableInvoice.ajax.reload();
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
                title: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថិភាព",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                customClass: { title: 'custom-swal-title' },
            });
    }).catch((err) => console.log(err.message));
};

const clear = () => {
    startDate.val("");
    endDate.val("");
    invoiceNumber.val("0");
    clientId.val("0");
    descripe.val("");
    qty.val("");
    unitPrice.val("");
    tax.val("");
    note.val("");
};

const Validate = () => {
    let isValid = true;
    if (startDate.val() === "") {
        Swal.fire({
            title: "សូមជ្រើសរើសកាលបរិច្ឆេទ",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        startDate.css("border-color", "red");
        startDate.focus();
        isValid = false;
    }
    else {
        startDate.css("border-color", "#cccccc");
        if (endDate.val() === "") {
            Swal.fire({
                title: "សូមជ្រើសរើសប្រតិបត្តិការ",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            endDate.css("border-color", "red");
            endDate.focus();
            isValid = false;
        }
        else {
            endDate.css("border-color", "#cccccc");
            if (invoiceNumber.val() === "") {
                Swal.fire({
                    title: "សូមបំពេញលេខវិកយប័ត្រ",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                invoiceNumber.css("border-color", "red");
                invoiceNumber.focus();
                isValid = false;
            }
            else {
                invoiceNumber.css("border-color", "#cccccc");
                if (clientId.val() === "0") {
                    Swal.fire({
                        title: "សូមជ្រើសរើសគោលបំណង",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    clientId.css("border-color", "red");
                    clientId.focus();
                    isValid = false;
                }
                else {
                    clientId.css("border-color", "#cccccc");
                    if (descripe.val() === "") {
                        Swal.fire({
                            title: "សូមបំពេញតម្លៃសរុប",
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        descripe.css("border-color", "red");
                        descripe.focus();
                        isValid = false;
                    }
                    else {
                        descripe.css("border-color", "#cccccc");
                        if (qty.val() === "") {
                            Swal.fire({
                                title: "សូមជ្រើសរើសប្រភេទបង់ប្រាក់",
                                icon: "warning",
                                showConfirmButton: false,
                                customClass: { title: 'custom-swal-title' },
                                timer: 1500,
                            });
                            qty.css("border-color", "red");
                            qty.focus();
                            isValid = false;
                        }
                        else {
                            qty.css("border-color", "#cccccc");
                            if (unitPrice.val() === "") {
                                Swal.fire({
                                    title: "សូមជ្រើសរើសប្រតិបត្តិការសិន",
                                    icon: "warning",
                                    showConfirmButton: false,
                                    customClass: { title: 'custom-swal-title' },
                                    timer: 1500,
                                });
                                unitPrice.css("border-color", "red");
                                unitPrice.focus();
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