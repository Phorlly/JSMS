jQuery(document).ready(() => {
    loadingGif();
    $("#show").click(() => reads());
});

//Declare variable
let tables = [];
let modalDialog = $("#modal-product");
let save = $(".save");
let update = $(".update");
let dataId = $("#data-id");
let productName = $("#product-name");
let noted = $("#noted");
let image = $("#image");
let imageFile = $("#image-file")
let createdBy = $("#log-by").data("logby");


//Get all data
const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/products/reads",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        destroy: true,
        autoWidth: false,
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
                //title: "Name",
                data: "Name",
            },
            {
                //title: "Photo",
                data: "Image",
                render: (row) => {
                    const file = row ? row : "../Images/blank-image.png";
                    return `<img src="${file}" class='rounded-circle' width='50px' height="50px"/>`;
                },
            },
            {
                //title: "Total",
                data: "Total",
                render: row => countPeople(row),
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
                                      <button onclick= "read('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,

            },
        ],
        //buttons: [
        //    {
        //        title: lProductList,
        //        extend: "excelHtml5",
        //        text: "<i class='fa fa-file-excel'> </i> Excel",
        //        className: "btn btn-success btn-sm mt-2",
        //    },

        //    {
        //        title: lProductList,
        //        extend: "print",
        //        text: "<i class='fa fa-print'> </i> Print",
        //        className: "btn btn-dark btn-sm mt-2",
        //    },
        //    {
        //        title: lProductList,
        //        extend: "copy",
        //        text: "<i class='fa fa-copy'> </i> Copy Text",
        //        className: "btn btn-info btn-sm mt-2",
        //    },
        //    {
        //        title: lProductList,
        //        extend: "colvis",
        //        text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
        //        className: "btn btn-primary btn-sm mt-2",
        //    },
        //],
    });
};


const readImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            image.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//Add new product
$("#add").click(() => {
    clear();
    setColor();
    modalDialog.modal("show");
});

//Save data
save.click(() => {
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
        url: "/api/hr/products/create",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
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
        url: "/api/hr/products/read/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            clear();
            setColor();
            update.show();
            save.hide();

            dataId.val(response.Id);
            productName.val(response.Name);
            image.attr("src", response.Image ? response.Image : "../Images/blank-image.png");
            noted.val(response.Noted);

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
update.click(() => {
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
        url: "/api/hr/products/update/" + dataId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
            tables.ajax.reload();
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

//Delete data by id
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
                url: "/api/hr/products/delete/" + id,
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


//Clear control
const clear = () => {
    save.show();
    update.hide();
    productName.val("");
    imageFile.val("");
    image.attr("src", "../Images/blank-image.png");
    noted.val("");
    dataId.val("");
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
            title: `${lInput} ${lProduct}`,
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
