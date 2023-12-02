//jQuery for load data
jQuery(document).ready(() => getAll());

//Declare variable for use global
let table = [];
let addNew = $("#add-new");
let update = $("#update");
let save = $("#save");
let username = $("#username");
let phone = $("#phone");
let role = $("#role");
let dataId = $("#data-id");
let password = $("#password");
let modalUser = $("#modal-user");
let refresh = $("#refresh");
//const Toast = Swal.mixin({
//    toast: true,
//    //position: "top-end",
//    showConfirmButton: false,
//    timer: 5000,
//});

//Get all data
const getAll = () => {
    table = $("#user").DataTable({
        ajax: {
            url: "/api/hr/users/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
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
                title: "Username",
                data: "Username",
            },
            {
                title: "Email Address",
                data: "Email",
            },
            {
                title: "Phone Number",
                data: "Phone",
            },
            {
                title: "Role Permission",
                data: "Role",
            },
            {
                title: "Actions",
                data: "UserId",
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
                title: "USER-ROLE LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "USER-ROLE LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "USER-ROLE LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "USER-ROLE LIST",
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

//Add new
addNew.click(() => {
    clear();
    setColor();
    modalUser.modal("show");
});

//Save data
save.click(() => {
    let response = validate();
    let data = {
        UserName: username.val(),
        Password: password.val(),
        Phone: phone.val(),
        Role: role.val(),
    };

    response ? $.ajax({
        url: "/api/hr/users/post",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                modalUser.modal("hide");
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
        url: "/api/hr/users/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                console.log(response);
                setColor();
                clear();
                update.show();
                save.hide();

                dataId.val(response.UserId);
                username.val(response.Username);
                password.val(response.Password);
                role.val(response.Role);
                phone.val(response.Phone);
                modalUser.modal("show");
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
update.click(() => {
    let response = validate();
    let data = {
        UserName: username.val(),
        Password: password.val(),
        Phone: phone.val(),
        Role: role.val(),
    };

    response ? $.ajax({
        url: "/api/hr/users/put-by-id/" + dataId.val(),
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                modalUser.modal("hide");
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
    })
        .then((param) => {
            param.value
                ? $.ajax({
                    method: "DELETE",
                    url: "/api/hr/users/delete-by-id/" + id,
                    statusCode: {
                        200: (response) => {
                            table.ajax.reload();
                            Swal.fire({
                                title: "Successfully Deleted ):(",
                                text: "Your file has been deleted.",
                                icon: "success",
                                showConfirmButton: false,
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

//Refresh data
refresh.click(() => location.reload());

//Clear control
const clear = () => {
    update.hide();
    save.show();
    username.val("");
    phone.val("");
    role.val("-1");
    password.val("");
};

//Set color to border control
const setColor = () => {
    username.css("border-color", "#cccccc");
    role.css("border-color", "#cccccc");
    password.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (username.val() === "") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        username.css("border-color", "red");
        username.focus();
        isValid = false;
    } else {
        username.css("border-color", "#cccccc");
        if (password.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            password.css("border-color", "red");
            password.focus();
            isValid = false;
        } else {
            password.css("border-color", "#cccccc");
            if (role.val() === "-1") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                role.css("border-color", "red");
                role.focus();
                isValid = false;
            } else {
                role.css("border-color", "#cccccc");
            }
        }
    }
    return isValid;
};
