jQuery(document).ready(() => {
    loadingGif();
    addProduct.show();
    addStock.hide();
    titleProduct.show();
    titleStock.hide();
    titleRemain.hide();
    titleRport.hide();
    showProduct.show();
    showStock.hide();
    showRemain.hide();
    //getRemainStockReport();
    showProduct.click(() => getProduct());
    showRemain.click(() => getRemainStockReport());
});

//Declare variable
let table = [];
let modalProduct = $("#modal-product");
let addProduct = $("#add-product");
let addStock = $("#add-stock");
let tabProduct = $("#tab-product");
let tabStock = $("#tab-stock");
let tabSummary = $("#tab-summary");
let tabRemain = $("#tab-remain");
let saveProduct = $("#save-product");
let updateProduct = $("#update-product");
let productId = $("#product-id");
let productName = $("#product-name");
let noted = $("#noted");
let image = $("#image");
let imageFile = $("#image-file")
let createdBy = $("#log-by").data("logby");
let titleProduct = $("#title-product");
let titleStock = $("#title-stock");
let titleRport = $("#title-report");
let titleRemain = $("#title-remain");
let showProduct = $("#show-product");
let showStock = $("#show-stock");
let showRemain = $("#show-remain");

//Get all data
const getProduct = () => {
    table = $("#product").DataTable({
        ajax: {
            url: "/api/hr/products/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        destroy: true,
        autoWidth: false,
        // scrollX: true,
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
                //title: "Name",
                data: "Name",
            },
            {
                //title: "Photo",
                data: "Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                //title: "Description",
                data: "Noted",
            },
            {
                //title: "Created",
                data: "Created",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Updated",
                data: "Updated",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Actions",
                data: "Id",
                render: (row) => `<div> 
                                      <button onclick= "edit('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,

            },
        ],
        buttons: [
            {
                title: "បញ្ជីមុខទំនិញដែលមាន",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },

            {
                title: "បញ្ជីមុខទំនិញដែលមាន",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "បញ្ជីមុខទំនិញដែលមាន",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "បញ្ជីមុខទំនិញដែលមាន",
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

//Get report stock
const getRemainStockReport = () => {
    $.ajax({
        url: "/api/hr/reports/get-remain-stock",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: response => {
            $('#remain-stock').DataTable().destroy();
            $('#remain-stock tbody').empty();
            $.each(response, (index, row) => {
                let created = moment(row.Created).fromNow();
                let image = row.Image ? `<img src="${row.Image}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>";
                var newRow = `<tr>
                                    <td>${index + 1}</td>
                                    <td>${row.Name}</td>
                                    <td>${image}</td>
                                    <td>${row.Total}</td>
                                    <td>${created}</td>
                                    <td>${row.Noted}</td>
                                  </tr>`;
                $('#remain-stock tbody').append(newRow);
            });

            // Initialize DataTables
            $('#remain-stock').DataTable({
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
                        title: "របាយការណ៍ទំនិញនៅសល់ក្នុងស្តុក",
                        extend: "excelHtml5",
                        text: "<i class='fa fa-file-excel'> </i> Excel",
                        className: "btn btn-success btn-sm mt-2",
                    },
                    {
                        title: "របាយការណ៍ទំនិញនៅសល់ក្នុងស្តុក",
                        extend: "print",
                        text: "<i class='fa fa-print'> </i> Print",
                        className: "btn btn-dark btn-sm mt-2",
                    },
                ],
            });
        },
        error: (xhr) => console.error(xhr),
    });
};


const productImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            image.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//Hide show
tabProduct.click(() => {
    addProduct.show();
    addStock.hide();
    titleProduct.show();
    titleStock.hide();
    titleRemain.hide();
    titleRport.hide();
    showProduct.show();
    showStock.hide();
    showRemain.hide();
});

tabStock.click(() => {
    addProduct.hide();
    addStock.show();
    titleProduct.hide();
    titleStock.show();
    titleRemain.hide();
    titleRport.hide();
    showProduct.hide();
    showStock.show();
    showRemain.hide();
});

tabSummary.click(() => {
    addProduct.hide();
    addStock.hide();
    titleProduct.hide();
    titleStock.hide();
    titleRemain.hide();
    titleRport.show();
    showProduct.hide();
    showStock.hide();
    showRemain.hide();
});

tabRemain.click(() => {
    addProduct.hide();
    addStock.hide();
    titleProduct.hide();
    titleStock.hide();
    titleRemain.show();
    titleRport.hide();
    showProduct.hide();
    showStock.hide();
    showRemain.show();
});

//Add new product
addProduct.click(() => {
    clearProduct();
    setColor();
    modalProduct.modal("show");
});

//Save data
saveProduct.click(() => {
    let isValid = validate();
    let formData = new FormData();
    let files = imageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }
    formData.append("Name", productName.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", noted.val());

    isValid ? $.ajax({
        url: "/api/hr/products/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
            productId.val(response.Id);
            table.ajax.reload();
            clearProduct();
            //modalProduct.modal("hide");
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
const edit = (id) => {
    $.ajax({
        url: "/api/hr/products/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            clearProduct();
            setColor();
            updateProduct.show();
            saveProduct.hide();

            productId.val(response.Id);
            productName.val(response.Name);
            response.Image ? image.attr("src", response.Image) : image.attr("src", "../Images/blank-image.png");
            noted.val(response.Noted);

            modalProduct.modal("show");
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
updateProduct.click(() => {
    let isValid = validate();
    let formData = new FormData();
    let files = imageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }
    formData.append("Name", productName.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", noted.val());

    isValid ? $.ajax({
        url: "/api/hr/products/put-by-id/" + productId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
            table.ajax.reload();
            modalProduct.modal("hide");
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
const remove = (id) => {
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
                url: "/api/hr/products/delete-by-id/" + id,
                success: (response) => {
                    table.ajax.reload();
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
                title: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថភាពដដែល",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
                customClass: { title: 'custom-swal-title' },
            });
    }).catch((err) => console.log(err.message));
};


//Clear control
const clearProduct = () => {
    saveProduct.show();
    updateProduct.hide();
    productName.val("");
    imageFile.val("");
    image.attr("src", "../Images/blank-image.png");
    noted.val("");
    productId.val("");
};

//Set color to border control
const setColor = () => {
    productName.css("border-color", "#cccccc");
    noted.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (productName.val() === "") {
        Swal.fire({
            title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        productName.css("border-color", "red");
        productName.focus();
        isValid = false;
    } else {
        productName.css("border-color", "#cccccc");
    }
    return isValid;
};
