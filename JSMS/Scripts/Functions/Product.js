jQuery(document).ready(() => {
    addProduct.show();
    addStock.hide();
    getProduct();
});

//Declare variable
let table = [];
let modalProduct = $("#modal-product");
let addProduct = $("#add-product");
let addStock = $("#add-stock");
let tabProduct = $("#tab-product");
let tabStock = $("#tab-stock");
let tabSummary = $("#tab-summary");
let saveProduct = $("#save-product");
let updateProduct = $("#update-product");
let productId = $("#product-id");
let productName = $("#product-name");
let noted = $("#noted");
let image = $("#image");
let imageFile = $("#image-file")
let refresh = $("#refresh");
let createdBy = $("#log-by").data("logby");

//Get all data
const getProduct = () => {
    table = $("#product").DataTable({
        ajax: {
            url: "/api/hr/products/get",
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
        drawCallback: () => $(".dataTables_paginate > .pagination").addClass("pagination-rounded"),
        columns: [
            {
                title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                title: "Name",
                data: "Name",
            },
            {
                title: "Photo",
                data: "Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                title: "Description",
                data: "Noted",
            },
            {
                title: "Created",
                data: "Created",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "Updated",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
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
                title: "PRODUCT LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },

            {
                title: "PRODUCT LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "PRODUCT LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "PRODUCT LIST",
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

const productImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            image.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//Refresh data
refresh.click(() => location.reload());

//Hide show
tabProduct.click(() => {
    addProduct.show();
    addStock.hide();
});

tabStock.click(() => {
    addProduct.hide();
    addStock.show();
});

tabSummary.click(() => {
    addProduct.hide();
    addStock.hide();
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
        statusCode: {
            200: (response) => {
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
const edit = (id) => {
    $.ajax({
        url: "/api/hr/products/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
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
        statusCode: {
            200: (response) => {
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
                statusCode: {
                    200: (response) => {
                        table.ajax.reload();
                        Swal.fire({
                            title: response.message,
                            icon: "success",
                            showConfirmButton: false,
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
                title: "ទិន្នន័យរបស់អ្នកគឺនៅសុវត្ថភាពដដែល 🥰",
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
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
