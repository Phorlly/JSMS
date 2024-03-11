jQuery(document).ready(() => {
    loadingGif();
    monthYear.change(() => readReport());
    product.change(() => readReport());
    stock.change(() => readReport());
    readReport();
    datePicker("#date-in-out");
    $("#show").click(() => reads());
});

//Declare variable for use global
let tables = [];
const add = $("#add");
const redo = $(".redo");
const save = $(".save");
const modalDialog = $("#modal-stock");
const dataId = $("#data-id");
const productType = $("#product-type");
const stockIO = $("#stock-in-out");
const quantity = $("#quantity");
const dateIO = $("#date-in-out");
const noted = $("#noted");
const createdBy = $("#log-by").data("logby");
const monthYear = formatMonthYear("#month-year");
const product = $("#product");
const stock = $("#stock");


$("#refesh").click(() => location.reload());

//Get all data
const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/stocks/reads",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        destroy: true,
        // scrollX: true,
        //dom: "Bfrtip",
        language: {
            paginate: {
                previous: "<i class='fas fa-chevron-left'>",
                next: "<i class='fas fa-chevron-right'>",
            },
        },
        columns: [
            {
                //title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Product's Name",
                data: "product.Name",
            },
            {
                //title: "Image",
                data: "product.Image",
                render: (row) => {
                    const file = row ? row : "../Images/blank-image.png";
                    return `<img src="${file}" class='rounded-circle' width='50px' height="50px"/>`;
                },
            },
            {
                //title: "Stock In",
                data: null,
                render: row => row.stock.Status === 1 ? `<span class="text-warning fw-bolder">${lAmount}​ ${row.stock.Quantity}</span>` : 0
            },
            {
                //title: "Stock Out",
                data: null,
                render: row => row.stock.Status === 2 ? `<span class="text-danger fw-bolder">${lAmount}​ -${row.stock.Quantity}</span>` : 0
            },
            {
                //title: "Date In/Out",
                data: "stock.Date",
                render: (row) => row ? moment(row).format("DD MMM YYYY") : "",
            },
            {
                //title: "Description",
                data: "stock.Noted",
            },
            {
                //title: "Created",
                data: "stock.Created",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            //{
            //    //title: "Updated",
            //    data: "Stock.Updated",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            {
                //title: "Actions",
                data: "stock.Id",
                render: (row) => `<div> 
                                      <button onclick= "read('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-redo'></span>
                                      </button>
                                      <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,

            },
        ],
        //buttons: [
        //    {
        //        title: lProductAvailable,
        //        extend: "excelHtml5",
        //        text: "<i class='fa fa-file-excel'> </i> Excel",
        //        className: "btn btn-success btn-sm mt-2",
        //    },

        //    {
        //        title: lProductAvailable,
        //        extend: "print",
        //        text: "<i class='fa fa-print'> </i> Print",
        //        className: "btn btn-dark btn-sm mt-2",
        //    },
        //    {
        //        title: lProductAvailable,
        //        extend: "copy",
        //        text: "<i class='fa fa-copy'> </i> Copy Text",
        //        className: "btn btn-info btn-sm mt-2",
        //    },
        //    {
        //        title: lProductAvailable,
        //        extend: "colvis",
        //        text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
        //        className: "btn btn-primary btn-sm mt-2",
        //    },
        //],
    });
};

//Get report stock
const readReport = () => {
    $.ajax({
        url: "/api/hr/reports/get-stock",
        type: "GET",
        data: {
            monthYear: monthYear.val(),
            product: product.val(),
            stock: stock.val(),
        },
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            $('.table').DataTable().destroy();
            $('.table tbody').empty();
            $.each(response, (index, row) => {
                const date = moment(row.Created).format('DD MMM YY');
                const stockIn = row.Status === 1 ? `<b class="text-warning fst-italic fw-bolder">${lAmount} ${row.Quantity} </b>` : 0;
                const stockOut = row.Status === 2 ? `<b class="text-danger fst-italic fw-bolder">${lAmount}​ -${row.Quantity}</b>` : 0;

                var newRow = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${row.Name}</td>
                                    <td>${stockIn}</td>
                                    <td>${stockOut}</td>
                                    <td>${date}</td>
                                    <td>${row.Noted}</td>
                                  </tr>`;
                $('.table tbody').append(newRow);
            });

            // Initialize DataTables
            $('.table').DataTable({
                dom: "Bfrtip",
                buttons: ["excel", "pdf", "print"],
                language: {
                    paginate: {
                        previous: "<i class='fas fa-chevron-left'>",
                        next: "<i class='fas fa-chevron-right'>",
                    },
                },
                drawCallback: () => $(".DataTables_paginate > .pagination").addClass("pagination-rounded"),
                searching: false,
                lengthChange: false,
                buttons: [
                    {
                        title: lReportStockAvailable,
                        extend: "excelHtml5",
                        text: "<i class='fa fa-file-excel'> </i> Excel",
                        className: "btn btn-success btn-sm mt-2",
                    },
                    {
                        title: lReportStockAvailable,
                        extend: "pdfHtml5",
                        text: "<i class='fa fa-file-pdf'> </i> PDF",
                        className: "btn btn-danger btn-sm mt-2",
                    },
                    {
                        title: lReportStockAvailable,
                        extend: "print",
                        text: "<i class='fa fa-print'> </i> Print",
                        className: "btn btn-dark btn-sm mt-2",
                    },
                ],
            });
        },
    });
};


//Add new
$("#add").click(() => {
    clear();
    setColor();
    modalDialog.modal("show");
});

//Save data
save.click(() => {

    let response = validate();
    const data = {
        Product: productType.val(),
        Quantity: quantity.val(),
        Date: dateIO.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
        Status: stockIO.val()
    };

    response ? $.ajax({
        url: "/api/hr/stocks/create",
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

//Get data by id
const read = (id) => {
    $.ajax({
        url: "/api/hr/stocks/read/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            redo.show();
            save.hide();

            dataId.val(response.stock.Id);
            productType.val(response.product.Id);
            quantity.val(response.stock.Quantity);
            noted.val(response.stock.Noted);
            setCurrentDate("#date-in-out");
            stockIO.val(response.stock.Status === 1 ? 1 : 2)

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
};

//Update by id
redo.click(() => {
    let response = validate();
    const data = {
        Product: productType.val(),
        Quantity: quantity.val(),
        Date: dateIO.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
        Status: stockIO.val()
    };

    response ? $.ajax({
        url: "/api/hr/stocks/redo/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
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

//Deconste data by id
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
        param.value ?
            $.ajax({
                method: "DELETE",
                url: "/api/hr/stocks/delete/" + id,
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

//clearStock control
const clear = () => {
    redo.hide();
    save.show();
    noted.val("");
    productType.val("-1");
    dataId.val("");
    quantity.val("");
    stockIO.val("-1");
    setCurrentDate("#date-in-out");
};

//Set color to border control
const setColor = () => {
    productType.css("border-color", "#cccccc");
    stockIO.css("border-color", "#cccccc");
    quantity.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    const isValid = true;
    if (productType.val() === "-1") {
        Swal.fire({
            title: `${lSelect} ${lProduct}`,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        productType.css("border-color", "red");
        productType.focus();
        isValid = false;
    } else {
        productType.css("border-color", "#cccccc");
        if (stockIO.val() === "-1") {
            Swal.fire({
                title: `${lSelect} ${lStockType}`,
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            stockIO.css("border-color", "red");
            stockIO.focus();
            isValid = false;
        } else {
            stockIO.css("border-color", "#cccccc");
            if (quantity.val() === "") {
                Swal.fire({
                    title: `${lInput} ${lQuantity}`,
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                quantity.css("border-color", "red");
                quantity.focus();
                isValid = false;
            } else {
                quantity.css("border-color", "#cccccc");

            }
        }
    }
    return isValid;
};
