jQuery(document).ready(() => {
    loadingGif();
    monthYear.change(() => getStockReport());
    byProduct.change(() => getStockReport());
    byStock.change(() => getStockReport());
    getStockReport();
    datePicker("#date-in-out");
    numberOnly("quantity");
    $("#show-stock").click(() => getAll());
});

//Declare variable for use global
let tableStock = [];
let addStock = $("#add-stock");
let updateStock = $("#update-stock");
let saveStock = $("#save-stock");
let modalStock = $("#modal-stock");
let dataId = $("#data-id");
let productType = $("#product-type");
let stockIO = $("#stock-in-out");
let quantity = $("#quantity");
let dateIO = $("#date-in-out");
let sNoted = $("#s-noted");
let createdBy2 = $("#log-by").data("logby");
let monthYear = formatMonthYear("#month-year");
let byProduct = $("#by-product");
let byStock = $("#by-stock");


$("#refesh").click(() => location.reload());

//Get all data
const getAll = () => {
    tableStock = $("#stock").DataTable({
        ajax: {
            url: "/api/hr/stocks/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        destroy: true,
        // scrollX: true,
        dom: "Bfrtip",
        language: {
            paginate: {
                previous: "<i class='fas fa-chevron-left'>",
                next: "<i class='fas fa-chevron-right'>",
            },
        },
        drawCallback: () => $(".datatableStocks_paginate > .pagination").addClass("pagination-rounded"),
        columns: [
            {
                //title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Product's Name",
                data: "Product.Name",
            },
            {
                //title: "Image",
                data: "Product.Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                //title: "Stock In",
                data: null,
                render: row => row.Stock.Status === 1 ? `<span class="text-warning fw-bolder">${lAmount}​ ${row.Stock.Quantity}</span>` : 0
            },
            {
                //title: "Stock Out",
                data: null,
                render: row => row.Stock.Status === 2 ? `<span class="text-danger fw-bolder">${lAmount}​ -${row.Stock.Quantity}</span>` : 0
            },
            {
                //title: "Date In/Out",
                data: "Stock.Date",
                render: (row) => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                //title: "Description",
                data: "Stock.Noted",
            },
            {
                //title: "Created",
                data: "Stock.Created",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            //{
            //    //title: "Updated",
            //    data: "Stock.Updated",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            {
                //title: "Actions",
                data: "Stock.Id",
                render: (row) => `<div> 
                                      <button onclick= "editStock('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-redo'></span>
                                      </button>
                                      <button onclick= "removeStock('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,

            },
        ],
        buttons: [
            {
                title: lProductAvailable,
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },

            {
                title: lProductAvailable,
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: lProductAvailable,
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: lProductAvailable,
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
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

//Get report stock
const getStockReport = () => {
    $.ajax({
        url: "/api/hr/reports/get-stock",
        type: "GET",
        data: {
            monthYear: monthYear.val(),
            product: byProduct.val(),
            stock: byStock.val(),
        },
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            $('#stock-summary').DataTable().destroy();
            $('#stock-summary tbody').empty();
            $.each(response, (index, row) => {
                let date = moment(row.Created).format('DD/MMM/YY');
                let stockIn = row.Status === 1 ? `<b class="text-warning fst-italic fw-bolder">${lAmount} ${row.Quantity} </b>` : 0;
                let stockOut = row.Status === 2 ? `<b class="text-danger fst-italic fw-bolder">${lAmount}​ -${row.Stock.Quantity}</b>` : 0;

                var newRow = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${row.Name}</td>
                                    <td>${stockIn}</td>
                                    <td>${stockOut}</td>
                                    <td>${date}</td>
                                    <td>${row.Noted}</td>
                                  </tr>`;
                $('#stock-summary tbody').append(newRow);
            });

            // Initialize DataTables
            $('#stock-summary').DataTable({
                dom: "Bfrtip",
                buttons: ["excel", "pdf", "print"],
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
                        title: lReportStockAvailable,
                        extend: "excelHtml5",
                        text: "<i class='fa fa-file-excel'> </i> Excel",
                        className: "btn btn-success btn-sm mt-2",
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
addStock.click(() => {
    clearStock();
    setColorStock();
    modalStock.modal("show");
});

//Save data
saveStock.click(() => {

    let response = validateStock();
    let data = {
        Product: productType.val(),
        Quantity: quantity.val(),
        Date: dateIO.val(),
        CreatedBy: createdBy2,
        Noted: sNoted.val(),
        Status: stockIO.val()
    };

    response ? $.ajax({
        url: "/api/hr/stocks/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            getAll();
            dataId.val(response.Id);
            tableStock.ajax.reload();
            clearStock();
            //modalStock.modal("hide");
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
const editStock = (id) => {
    $.ajax({
        url: "/api/hr/stocks/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColorStock();
            clearStock();
            updateStock.show();
            saveStock.hide();

            dataId.val(response.Stock.Id);
            productType.val(response.Product.Id);
            quantity.val(response.Stock.Quantity);
            sNoted.val(response.Stock.Noted);
            setCurrentDate("#date-in-out");
            stockIO.val(response.Stock.Status === 1 ? 1 : 2)

            modalStock.modal("show");
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
updateStock.click(() => {
    let response = validateStock();
    let data = {
        Product: productType.val(),
        Quantity: quantity.val(),
        Date: dateIO.val(),
        CreatedBy: createdBy2,
        Noted: sNoted.val(),
        Status: stockIO.val()
    };

    response ? $.ajax({
        url: "/api/hr/stocks/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            tableStock.ajax.reload();
            clearStock();
            modalStock.modal("hide");

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
const removeStock = (id) => {
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
                url: "/api/hr/stocks/delete-by-id/" + id,
                success: (response) => {
                    tableStock.ajax.reload();
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
const clearStock = () => {
    updateStock.hide();
    saveStock.show();
    sNoted.val("");
    productType.val("-1");
    dataId.val("");
    quantity.val("");
    stockIO.val("-1");
    setCurrentDate("#date-in-out");
};

//Set color to border control
const setColorStock = () => {
    productType.css("border-color", "#cccccc");
    stockIO.css("border-color", "#cccccc");
    quantity.css("border-color", "#cccccc");
};

//Check validation
const validateStock = () => {
    let isValid = true;
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
