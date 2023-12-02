$(document).ready(() => {
 
});

//Declare variable for use global
let table = [];
let update = $("#update");
let save = $("#save");
let dataId = $("#data-id");
let createdBy = $("#log-by").data("logby");
let tabTransaction = $("#tab-transaction");


//Get all data
const getAll = () => {
    table = $("#transaction").DataTable({
        ajax: {
            url: "/api/hr/transactions/get",
            dataSrc: "",
            method: "GET",
        },
        // responsive: true,
        // autoWidth: false,
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
                title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                title: "Name",
                data: null,
                render: (row) => `${row.Client.Name} ${row.Client.Company}`,
            },
            {
                title: "Profile",
                data: "Client.Image",
                render: (row) => {
                    if (row == null || row == "") {
                        return "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>";
                    }
                    return `<img src="${row}" class='rounded-circle' width='50px'/>`;
                },
            },
            {
                title: "Date",
                data: "Transaction.DateInOrEx",
                render: (data) => data ? moment(data).format("DD/MMM/YYYY") : "",
            },
            {
                title: "Currency",
                data: "Transaction.Currency",
                render: (row) => row === 1 ? `<span class="btn btn-success rounded-circle" style="cursor: default;">$</span>` : `<span class="btn btn-warning rounded-circle" style="cursor: default;">៛</span>`,
            },
            {
                title: "Total Price",
                data: null,
                render: (row) => formatCurrency(row.Transaction.Currency, row.Transaction.Total),
            },
            {
                title: "Purpose",
                data: "Transaction.Noted",
            },
            {
                title: "In",
                data: "Transaction.Noted",
            },
            {
                title: "Purpose",
                data: "Transaction.Noted",
            },
            //   {
            //     title: "Transaction",
            //     data: null,
            //     render: (data, type, row, meta) => {
            //       let symbol = row.Transaction.Currency === 1 ? "$" : "៛";
            //       let amount = row.Transaction.Amount;
            //       let total = row.Transaction.Total;
            //       let vat = row.Transaction.VAT;
            //       let unit = row.Transaction.Unit;
            //       let subTotal = total - vat;
            //       // ${meta.row + 1}
            //       //                             ${row.Transaction.Description}
            //       //                             ${row.Transaction.Quantity}
            //       //                             ${formatCurrency(unit, symbol)}
            //       //                             <td>${formatCurrency(amount, symbol)}
            //     },
            //   },
            {
                title: "Invoice",
                data: "Transaction.Code",
            },
            {
                title: "File",
                data: "Transaction.Attachment",
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
                title: "Description",
                data: "Transaction.Description",
            },
            {
                title: "Created",
                data: "Transaction.CreatedAt",
                render: (data) => {
                    if (data != null) {
                        return moment(data).fromNow();
                    }
                },
            },
            {
                title: "Updated",
                data: "Transaction.UpdatedAt",
                render: (data) => {
                    if (data != null) {
                        return moment(data).fromNow();
                    }
                },
            },
            {
                title: "Transaction",
                data: "Transaction.Id",
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

//Reload data
$("#refresh").click(() => location.reload());

tabTransaction.click(() => {
    addIncome.hide();
    addExpense.hide();
});

////Add new
//addIncome.click(() => {
//    clear();
//    setColor();
//    incomeOrExpense();
//    modalTransaction.modal("show");
//});

////Save data
//save.click(() => {
//    let response = validate();
//    let formData = new FormData();
//    let files = attachment.get(0).files;

//    if (files.length > 0) {
//        formData.append("Attachment", files[0]);
//    }

//    formData.append("Client", client.val());
//    formData.append("Payment", payment.val());
//    formData.append("Type", type.val());
//    formData.append("Amount", amount.val());
//    formData.append("VAT", vat.val());
//    formData.append("Quantity", quantity.val());
//    formData.append("DateInOrEx", dateInOrEx.val());
//    formData.append("Income", incomeExpense.val());
//    formData.append("Exchange", exchangeRate.val());
//    formData.append("CreatedBy", createdBy);
//    formData.append("Total", totalPrice.val());
//    formData.append("Currency", currency.val());
//    formData.append("Unit", unitPrice.val());
//    formData.append("Description", description.val());
//    formData.append("Noted", noted.val());
//    formData.append("Code", invoice.val());

//    if (response === false) {
//        return false;
//    } else {
//        //for (var pair of formData.entries()) {
//        //  console.log(pair[0] + " - " + pair[1]);
//        //}

//        $.ajax({
//            url: "/api/hr/transactions/post",
//            type: "POST",
//            contentType: false,
//            processData: false,
//            data: formData,
//            statusCode: {
//                200: (response) => {
//                    dataId.val(response.Id);
//                    table.ajax.reload();
//                    clear();
//                    modalTransaction.modal("hide");
//                    toastr.success("Successfully Saved ):(", "Sever Response :(");
//                    // location.reload();
//                },
//                400: (xhr) => {
//                    toastr.error(
//                        "Data is already exist in Database :)",
//                        "Server Resonse"
//                    );
//                    console.log(xhr.responseText);
//                },
//                500: (xhr) => {
//                    toastr.error("Something what happen :)", "Server Resonse");
//                    console.log(xhr.responseText);
//                },
//            },
//        });
//    }
//});

////Get data by id
//const edit = (id) => {
//    $.ajax({
//        url: "/api/hr/transactions/get-by-id/" + id,
//        type: "GET",
//        contentType: "application/json;charset=UTF-8",
//        dataType: "JSON",
//        statusCode: {
//            200: (response) => {
//                console.log(response);
//                setColor();
//                clear();
//                update.show();
//                save.hide();

//                dataId.val(response.Transaction.Id);
//                client.val(response.Client.Id);
//                incomeExpense.val(response.Transaction.Income);
//                invoice.val(response.Transaction.Code);
//                noted.val(response.Transaction.Noted);
//                quantity.val(response.Transaction.Quantity);
//                unitPrice.val(response.Transaction.Unit);
//                amount.val(response.Transaction.Amount);
//                description.val(response.Transaction.Description);
//                if (response !== null) {
//                    const d = new Date(response.Transaction.DateInOrEx);
//                    const formattedDate =
//                        d.getFullYear() +
//                        "-" +
//                        ("0" + (d.getMonth() + 1)).slice(-2) +
//                        "-" +
//                        ("0" + d.getDate()).slice(-2);
//                    dateInOrEx.val(formattedDate);
//                }
//                exchangeRate.val(response.Transaction.Exchange);
//                vat.val(response.Transaction.VAT);
//                totalPrice.val(response.Transaction.Total);
//                currency.val(response.Transaction.Currency);
//                payment.val(response.Transaction.Payment);

//                $("#file").html(showFile(response.Transaction.Attachment));
//                type.val(response.Transaction.Type);
//                modalTransaction.modal("show");
//            },
//            404: (xhr) => {
//                toastr.error("Data not found :)", "Server Resonse");
//                console.log(xhr.responseText);
//            },
//            500: (xhr) => {
//                toastr.error("Something what happen :)", "Server Resonse");
//                console.log(xhr.responseText);
//            },
//        },
//    });
//};

////Update by id
//update.click(() => {
//    let response = validate();
//    let formData = new FormData();
//    let files = attachment.get(0).files;

//    if (files.length > 0) {
//        formData.append("Attachment", files[0]);
//    }

//    formData.append("Client", client.val());
//    formData.append("Payment", payment.val());
//    formData.append("Type", type.val());
//    formData.append("Amount", amount.val());
//    formData.append("VAT", vat.val());
//    formData.append("Quantity", quantity.val());
//    formData.append("DateInOrEx", dateInOrEx.val());
//    formData.append("Income", incomeExpense.val());
//    formData.append("Exchange", exchangeRate.val());
//    formData.append("CreatedBy", createdBy);
//    formData.append("Total", totalPrice.val());
//    formData.append("Currency", currency.val());
//    formData.append("Unit", unitPrice.val());
//    formData.append("Description", description.val());
//    formData.append("Noted", noted.val());
//    formData.append("Code", invoice.val());

//    if (response === false) {
//        return false;
//    } else {
//        for (var pair of formData.entries()) {
//            console.log(pair[0] + " - " + pair[1]);
//        }

//        $.ajax({
//            url: "/api/hr/transactions/put-by-id/" + dataId.val(),
//            type: "PUT",
//            contentType: false,
//            processData: false,
//            data: formData,
//            statusCode: {
//                200: (response) => {
//                    table.ajax.reload();
//                    clear();
//                    modalTransaction.modal("hide");
//                    toastr.success("Successfully Updated ):(", "Sever Response :(");
//                    // location.reload();
//                },
//                400: (xhr) => {
//                    toastr.error(
//                        "Data is already exist in Database :)",
//                        "Server Resonse"
//                    );
//                    console.log(xhr.responseText);
//                },
//                404: (xhr) => {
//                    toastr.error("Data is not found in Database :)", "Server Resonse");
//                    console.log(xhr.responseText);
//                },
//                500: (xhr) => {
//                    toastr.error("Something what happen :)", "Server Resonse");
//                    console.log(xhr.responseText);
//                },
//            },
//        });
//    }
//});

////Delete data by id
//const remove = (id) => {
//    console.log(id);
//    Swal.fire({
//        title: "Are you sure?",
//        text: "You won't be able to revert this!",
//        icon: "warning",
//        showCancelButton: !0,
//        //confirmButtonText: "Yes, delete it",
//        //cancelButtonText: "No, cancel",
//        confirmButtonClass: "btn btn-success mt-2",
//        cancelButtonClass: "btn btn-danger ms-2 mt-2",
//        buttonsStyling: !1,
//    })
//        .then((param) => {
//            param.value
//                ? $.ajax({
//                    method: "DELETE",
//                    url: "/api/hr/transactions/delete-by-id/" + id,
//                    statusCode: {
//                        200: (response) => {
//                            tableData.ajax.reload();
//                            Swal.fire({
//                                title: "Successfully Deleted ):(",
//                                text: "Your file has been deleted.",
//                                icon: "success",
//                                showConfirmButton: false,
//                                timer: 1500,
//                            });
//                        },
//                        404: (xhr) => {
//                            toastr.error(
//                                "Data id no match with request :)",
//                                "Server Resonse"
//                            );
//                            console.log(xhr.responseText);
//                        },
//                        500: (xhr) => {
//                            toastr.error("Something what happen :)", "Server Resonse");
//                            console.log(xhr.responseText);
//                        },
//                    },
//                })
//                : param.dismiss === Swal.DismissReason.cancel &&
//                Swal.fire({
//                    title: "Cancelled",
//                    text: "Your imaginary file is safe :)",
//                    icon: "error",
//                });
//        })
//        .catch((err) => console.log(err.message));
//};

////Clear control
//const clear = () => {
//    update.hide();
//    save.show();
//    attachment.val("");
//    quantity.val("");
//    unitPrice.val("");
//    exchangeRate.val(4000);
//    dateInOrEx.val("");
//    incomeExpense.val(1);
//    invoice.val("");
//    totalPrice.val("0.00");
//    amount.val("0.00");
//    vat.val("0.00");
//    currency.val(1);
//    noted.val("");
//    description.val("");
//    payment.val(-1);
//    type.val(-1);
//    client.val(-1);
//};

////Set color to border control
//const setColor = () => {
//    client.css("border-color", "#cccccc");
//    invoice.css("border-color", "#cccccc");
//    incomeExpense.css("border-color", "#cccccc");
//    quantity.css("border-color", "#cccccc");
//    unitPrice.css("border-color", "#cccccc");
//    exchangeRate.css("border-color", "#cccccc");
//    dateInOrEx.css("border-color", "#cccccc");
//    payment.css("border-color", "#cccccc");
//    type.css("border-color", "#cccccc");
//};

////Check validation
//const validate = () => {
//    let isValid = true;
//    if (client.val() === "-1") {
//        toastr.error("This field cannot null :)", "Server Resonse");
//        client.css("border-color", "red");
//        client.focus();
//        isValid = false;
//    } else {
//        client.css("border-color", "#cccccc");
//        if (incomeExpense.val() === "-1") {
//            toastr.error("This field cannot null :)", "Server Resonse");
//            incomeExpense.css("border-color", "red");
//            incomeExpense.focus();
//            isValid = false;
//        } else {
//            incomeExpense.css("border-color", "#cccccc");
//            if (invoice.val() === "") {
//                toastr.error("This field cannot null :)", "Server Resonse");
//                invoice.css("border-color", "red");
//                invoice.focus();
//                isValid = false;
//            } else {
//                invoice.css("border-color", "#cccccc");
//                if (quantity.val() === "") {
//                    toastr.error("This field cannot null :)", "Server Resonse");
//                    quantity.css("border-color", "red");
//                    quantity.focus();
//                    isValid = false;
//                } else {
//                    quantity.css("border-color", "#cccccc");
//                    if (exchangeRate.val() === "") {
//                        toastr.error("This field cannot null :)", "Server Resonse");
//                        exchangeRate.css("border-color", "red");
//                        exchangeRate.focus();
//                        isValid = false;
//                    } else {
//                        exchangeRate.css("border-color", "#cccccc");
//                        if (dateInOrEx.val() === "") {
//                            toastr.error("This field cannot null :)", "Server Resonse");
//                            dateInOrEx.css("border-color", "red");
//                            dateInOrEx.focus();
//                            isValid = false;
//                        } else {
//                            dateInOrEx.css("border-color", "#cccccc");
//                            if (payment.val() === "-1") {
//                                toastr.error("This field cannot null :)", "Server Resonse");
//                                payment.css("border-color", "red");
//                                payment.focus();
//                                isValid = false;
//                            } else {
//                                payment.css("border-color", "#cccccc");
//                                if (type.val() === "-1") {
//                                    toastr.error("This field cannot null :)", "Server Resonse");
//                                    type.css("border-color", "red");
//                                    type.focus();
//                                    isValid = false;
//                                } else {
//                                    type.css("border-color", "#cccccc");
//                                }
//                            }
//                        }
//                    }
//                }
//            }
//        }
//    }
//    return isValid;
//};


////Format Income or Expense
//const incomeOrExpense = () => {
//    if (incomeExpense.val() === "1") {
//        isExpense.hide();
//        isIncome.show();
//        slectClient.show();
//        expenseType.hide();
//        incomeType.show();
//    } else {
//        isExpense.show();
//        isIncome.hide();
//        slectClient.hide();
//        expenseType.show();
//        incomeType.hide();
//    }
//};


