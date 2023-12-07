
$(document).ready(() => {
    loadingGif();
    unitPrice.on("input", amountAndTotal);
    currency.on("input", amountAndTotal);
    exchangeRate.on("change", amountAndTotal);
    client.on("change", countStaff);
    numberOnly("unit-price");
    addIncome.show();
    addExpense.hide();
    $("#refresh").click(() => getIncome());
});

//Declar variable
let income = [];
let incomeId = $("#income-id");
let addIncome = $("#add-income");
let saveIncome = $("#save-income");
let updateIncome = $("#update-income");
let modalIncome = $("#modal-income");
let invoice = $("#invoice");
let client = $("#client");
let noted = $("#noted");
let totalPrice = $("#total-price");
let quantity = $("#quantity");
let amount = $("#amount");
let unitPrice = $("#unit-price");
let vat = $("#vat");
let exchangeRate = $("#exchange-rate");
let currency = $("#currency");
let dateIncome = $("#date-income");
let payment = $("#payment");
let attachment = $("#attachment");
let incomeType = $("#income-type");
let description = $("#description");
let tabIncome = $("#tab-income");


//Get all data
const getIncome = () => {
    income = $("#income").DataTable({
        ajax: {
            url: "/api/hr/incomes/get",
            dataSrc: "",
            method: "GET",
        },
        // responsive: true,
        // autoWidth: false,
        scrollX: true,
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
                //title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Type",
                data: "Income.Type",
                render: row => row ? formatIncome(row) : "",
            },
            {
                //title: "Company",
                data: "Client.Company",
            },
            {
                //title: "Profile",
                data: "Client.Image",
                render: (row) => row ? "<img src='../Images/blank-image.png' class='rounded-circle' width='50px'/>" :
                    `<img src="${row}" class='rounded-circle' width='50px'/>`,
            },
            {
                //title: "Date",
                data: "Income.DateInOrEx",
                render: row => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            //{
            //    title: "Currency",
            //    data: "Income.Currency",
            //    render: (row) => row === 1 ? `<span class="btn btn-success rounded-circle" style="cursor: default;">$</span>` : `<span class="btn btn-warning rounded-circle" style="cursor: default;">៛</span>`,
            //},
            //{
            //    title: "Total",
            //    data: null,
            //    render: row => {
            //        let currency = row.Income.Currency;
            //        let total = row.Income.Total;
            //        if (currency) {
            //            return formatCurrency(currency, total);
            //        } else {
            //            return "";
            //        }
            //    },
            //},
            {
                //title: "Purpose",
                data: "Income.Noted",
            },
            {
                //title: "Invoice",
                data: "Income.Code",
            },
            {
                //title: "Payment",
                data: "Income.Payment",
                render: row => row === 1 ? "By Cash" : "By Bank",
            },
            {
                //title: "Attachment",
                data: "Income.Attachment",
                render: (row) => {
                    if (row === null) {
                        return "";
                    } else {
                        let fileInfo = readFile(row);
                        return `<a href="${fileInfo.url}" target="_blank">${fileInfo.name}</a>`;
                    }
                },
            },
            {
                //title: "Description",
                data: "Income.Description",
            },
            {
                //title: "Created",
                data: "Income.CreatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Updated",
                data: "Income.UpdatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Actions",
                data: "Income.Id",
                render: row => `<div> 
                                    <button onclick= "editIncome('${row}')" class= 'btn btn-warning btn-sm' >
                                        <span class='fas fa-edit'></span>
                                    </button>
                                    <button onclick= "removeIncome('${row}')" class= 'btn btn-danger btn-sm' >
                                        <span class='fas fa-trash-alt'></span>
                                    </button>
                                 </div>`,

            },
        ],
        buttons: [
            {
                title: "INCOME LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "INCOME LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "INCOME LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "INCOME LIST",
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

//Hide or Show button action
tabIncome.click(() => {
    addIncome.show();
    addExpense.hide();
});

//Add new
addIncome.click(() => {
    clearIncome();
    setColorIncome();
    modalIncome.modal("show");
});

//Save data
saveIncome.click(() => {
    let response = validateIncome();
    let formData = new FormData();
    let files = attachment.get(0).files;

    if (files.length > 0) {
        formData.append("Attachment", files[0]);
    }

    formData.append("Client", client.val());
    formData.append("Payment", payment.val());
    formData.append("Type", incomeType.val());
    formData.append("Amount", amount.val());
    formData.append("VAT", vat.val());
    formData.append("Quantity", quantity.val());
    formData.append("DateInOrEx", dateIncome.val());
    formData.append("Exchange", exchangeRate.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Total", totalPrice.val());
    formData.append("Currency", currency.val());
    formData.append("Unit", unitPrice.val());
    formData.append("Description", description.val());
    formData.append("Noted", noted.val());
    formData.append("Code", invoice.val());

    response ? $.ajax({
        url: "/api/hr/incomes/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                incomeId.val(response.Id);
                income.ajax.reload();
                clearIncome();
                modalIncome.modal("hide");
                Swal.fire({
                    position: "top-end",
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
            500: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    toastr.error(xhr.responseJSON.message, "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ") :
                    console.log(xhr.responseText);
            },
        },
    }) : false;
});

//Get data by id
const editIncome = (id) => {
    $.ajax({
        url: "/api/hr/incomes/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                //console.log(response);
                setColorIncome();
                clearIncome();
                updateIncome.show();
                saveIncome.hide();

                incomeId.val(response.Income.Id);
                client.val(response.Client.Id);
                invoice.val(response.Income.Code);
                noted.val(response.Income.Noted);
                quantity.val(response.Income.Quantity);
                unitPrice.val(response.Income.Unit);
                amount.val(response.Income.Amount);
                description.val(response.Income.Description);
                if (response !== null) {
                    const d = new Date(response.Income.DateInOrEx);
                    const formattedDate =
                        d.getFullYear() +
                        "-" +
                        ("0" + (d.getMonth() + 1)).slice(-2) +
                        "-" +
                        ("0" + d.getDate()).slice(-2);
                    dateIncome.val(formattedDate);
                }
                exchangeRate.val(response.Income.Exchange);
                vat.val(response.Income.VAT);
                totalPrice.val(response.Income.Total);
                currency.val(response.Income.Currency);
                payment.val(response.Income.Payment);

                response.Income.Attachment ? $("#file").html(showFile(response.Income.Attachment)) : "";
                incomeType.val(response.Income.Type);
                modalIncome.modal("show");
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

//Update by id
updateIncome.click(() => {
    let response = validateIncome();
    let formData = new FormData();
    let files = attachment.get(0).files;

    if (files.length > 0) {
        formData.append("Attachment", files[0]);
    }

    formData.append("Client", client.val());
    formData.append("Payment", payment.val());
    formData.append("Type", incomeType.val());
    formData.append("Amount", amount.val());
    formData.append("VAT", vat.val());
    formData.append("Quantity", quantity.val());
    formData.append("DateInOrEx", dateIncome.val());
    formData.append("Exchange", exchangeRate.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Total", totalPrice.val());
    formData.append("Currency", currency.val());
    formData.append("Unit", unitPrice.val());
    formData.append("Description", description.val());
    formData.append("Noted", noted.val());
    formData.append("Code", invoice.val());

    response ? $.ajax({
        url: "/api/hr/incomes/put-by-id/" + incomeId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                income.ajax.reload();
                clearIncome();
                modalIncome.modal("hide");
                Swal.fire({
                    position: "top-end",
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
    }) : false;
});

//Delete data by id
const removeIncome = (id) => {
    Swal.fire({
        title: "តើអ្នកប្រាកដដែរឬទេ?",
        text: "ថាចង់លុបទិន្នន័យមួយនេះចេញ !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        reverseButtons: true,
        allowHtml: true,
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/incomes/delete-by-id/" + id,
                statusCode: {
                    200: (response) => {
                        income.ajax.reload();
                        Swal.fire({
                            title: response.message,
                            icon: "success",
                            showConfirmButton: false,
                            allowHtml: true,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
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
                title: "បានបោះបង់",
                text: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថភាពដដែល 🥰",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                customClass: { title: 'custom-swal-title' },
            });
    }).catch((err) => console.log(err.message));
};

//Clear control
const clearIncome = () => {
    updateIncome.hide();
    saveIncome.show();
    attachment.val("");
    quantity.val("");
    unitPrice.val("");
    exchangeRate.val(4000);
    dateIncome.val("");
    invoice.val("");
    totalPrice.val("0.00");
    amount.val("0.00");
    vat.val("0.00");
    currency.val("1");
    noted.val("");
    description.val("");
    payment.val("-1");
    incomeType.val("-1");
    client.val("-1");
};

//Set color to border control
const setColorIncome = () => {
    client.css("border-color", "#cccccc");
    invoice.css("border-color", "#cccccc");
    quantity.css("border-color", "#cccccc");
    unitPrice.css("border-color", "#cccccc");
    exchangeRate.css("border-color", "#cccccc");
    dateIncome.css("border-color", "#cccccc");
    payment.css("border-color", "#cccccc");
    incomeType.css("border-color", "#cccccc");
};

//Check validation
const validateIncome = () => {
    let isValid = true;
    if (incomeType.val() === "-1") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        incomeType.css("border-color", "red");
        incomeType.focus();
        isValid = false;
    } else {
        incomeType.css("border-color", "#cccccc");
        if (client.val() === "-1") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            client.css("border-color", "red");
            client.focus();
            isValid = false;
        } else {
            client.css("border-color", "#cccccc");
            if (unitPrice.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                unitPrice.css("border-color", "red");
                unitPrice.focus();
                isValid = false;
            } else {
                unitPrice.css("border-color", "#cccccc");
                if (dateIncome.val() === "") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    dateIncome.css("border-color", "red");
                    dateIncome.focus();
                    isValid = false;
                } else {
                    dateIncome.css("border-color", "#cccccc");
                    if (exchangeRate.val() === "") {
                        Swal.fire({
                            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        exchangeRate.css("border-color", "red");
                        exchangeRate.focus();
                        isValid = false;
                    } else {
                        exchangeRate.css("border-color", "#cccccc");
                        if (payment.val() === "-1") {
                            Swal.fire({
                                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                icon: "warning",
                                showConfirmButton: false,
                                customClass: { title: 'custom-swal-title' },
                                timer: 1500,
                            });
                            payment.css("border-color", "red");
                            payment.focus();
                            isValid = false;
                        } else {
                            payment.css("border-color", "#cccccc");
                            if (invoice.val() === "") {
                                Swal.fire({
                                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                    icon: "warning",
                                    showConfirmButton: false,
                                    customClass: { title: 'custom-swal-title' },
                                    timer: 1500,
                                });
                                invoice.css("border-color", "red");
                                invoice.focus();
                                isValid = false;
                            } else {
                                invoice.css("border-color", "#cccccc");
                            }
                        }
                    }
                }
            }
        }
    }
    return isValid;
};

//Change value and calculate
const amountAndTotal = (event) => {
    let qty = parseFloat(quantity.val()) || 0;
    let unit = parseFloat(unitPrice.val()) || 0;
    let rate = parseFloat(exchangeRate.val()) || 1;
    let cur = currency.val();
    let amt = qty * unit;
    let vt = amt / 10;
    let total = vt + amt;

    if (cur === "1") {
        amount.val(amt.toFixed(2));
        vat.val(vt.toFixed(2));
        totalPrice.val(total.toFixed(2));
    } else {
        amount.val((amt * rate).toFixed(2));
        vat.val((vt * rate).toFixed(2));
        totalPrice.val((total * rate).toFixed(2));
    }

    //   const inputElement = event.target;
    //   const inputValue = inputElement.value;
    //   console.log(`Value of ${inputElement.id}: ${inputValue}`);
};

//Count client
const countStaff = () => {
    $.ajax({
        url: "/transaction/countStaff",
        type: "GET",
        data: { staff: client.val() },
        dataType: "JSON",
        success: (response) => {
            //console.log(response)
            response ? quantity.val(response) : toastr.error("Not found staff worked IN :)", "ម៉ាស៊ីនបានឆ្លើយតបមកវិញ");
        },
        error: (hasError) => {
            console.log(hasError);
        },
    });
};