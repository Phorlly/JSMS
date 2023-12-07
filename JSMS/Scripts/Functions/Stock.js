jQuery(document).ready(() => {
    loadingGif();
    getAll();
    monthYear.change(() => getReportStock());
    byProduct.change(() => getReportStock());
    byStock.change(() => getReportStock());
    getReportStock();
    datePicker("#date-in-out");
});

//Declare variable for use global
let tableStock = [];
let addStock2 = $("#add-stock"); 
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
                title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                title: "Product's Name",
                data: "Product.Name",
            },
            {
                title: "Image",
                data: "Product.Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                title: "Stock In",
                data: null,
                render: row => row.Stock.Status === 1 ? `<span class="text-warning fw-bolder">${row.Stock.Quantity}</span>` : 0
            },
            {
                title: "Stock Out",
                data: null,
                render: row => row.Stock.Status === 2 ? `<span class="text-danger fw-bolder">-${row.Stock.Quantity}</span>` : 0
            },
            //{
            //    title: "Total",
            //    data: "Quantity.Total",
            //},
            {
                title: "Date In/Out",
                data: "Stock.Date",
                render: (row) => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                title: "Description",
                data: "Stock.Noted",
            },
            {
                title: "Created",
                data: "Stock.Created",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "Stock.Updated",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "Stock.Id",
                render: (row) => `<div> 
                                      <button onclick= "editStock('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "removeStock('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,

            },
        ],
        buttons: [
            {
                title: "STOCK LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },

            {
                title: "STOCK LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "STOCK LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "STOCK LIST",
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

//Get report attendance
const getReportStock = () => {
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
        statusCode: {
            200: (response) => {
                $('#stock-summary').DataTable().destroy();
                $('#stock-summary tbody').empty();
                $.each(response, (index, row) => {
                    let date = moment(row.Date).format('DD/MMM/YY');
                    let stockIn = row.Status === 1 ? `<b class="text-warning fst-italic fw-bolder">${row.Quantity} </b>` : 0;
                    let stockOut = row.Status === 2 ? `<b class="text-danger fst-italic fw-bolder">-${row.Stock.Quantity}</b>` : 0;

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
                            title: "STOCK REPORT",
                            extend: "excelHtml5",
                            text: "<i class='fa fa-file-excel'> </i> Excel",
                            className: "btn btn-success btn-sm mt-2",
                        },
                        {
                            title: "STOCK REPORT",
                            extend: "print",
                            text: "<i class='fa fa-print'> </i> Print",
                            className: "btn btn-dark btn-sm mt-2",
                        },
                    ],
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
    });
};


//Add new
addStock2.click(() => {
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
        statusCode: {
            200: (response) => {

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
            400: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    Swal.fire({
                        //position: "top-end",
                        title: xhr.responseJSON.message,
                        icon: "success",
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

//Get data by id
const editStock = (id) => {
    $.ajax({
        url: "/api/hr/stocks/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                //console.log(response);
                setColorStock();
                clearStock();
                updateStock.show();
                saveStock.hide();

                dataId.val(response.Stock.Id);
                productType.val(response.Product.Id);
                quantity.val(response.Stock.Quantity);
                sNoted.val(response.Stock.Noted);
                dateIO.val(formatDate(response.Stock.Date));
                stockIO.val(response.Stock.Status === 1 ? 1 : 2)

                modalStock.modal("show");
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
        statusCode: {
            200: (response) => {
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
            400: (xhr) => {
                xhr.responseJSON && xhr.responseJSON.message ?
                    Swal.fire({
                        //position: "top-end",
                        title: xhr.responseJSON.message,
                        icon: "success",
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

//Delete data by id
const removeStock = (id) => {
    Swal.fire({
        title: "តើអ្នកប្រាកដដែរឬទេ?",
        text: "ថាចង់លុបទិន្នន័យមួយនេះចេញ !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value ?
            $.ajax({
                method: "DELETE",
                url: "/api/hr/stocks/delete-by-id/" + id,
                statusCode: {
                    200: (response) => {
                        tableStock.ajax.reload();
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
                title: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថភាពដដែល 🥰",
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
    dateIO.val("");
};

//Set color to border control
const setColorStock = () => {
    productType.css("border-color", "#cccccc");
    stockIO.css("border-color", "#cccccc");
    dateIO.css("border-color", "#cccccc");
    quantity.css("border-color", "#cccccc");
};

//Check validation
const validateStock = () => {
    let isValid = true;
    if (productType.val() === "-1") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
                if (dateIO.val() === "") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    dateIO.css("border-color", "red");
                    dateIO.focus();
                    isValid = false;
                } else {
                    dateIO.css("border-color", "#cccccc");
                }
            }
        }
    }
    return isValid;
};
