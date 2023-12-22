//jQuery for load data
jQuery(document).ready(() => {
    loadingGif();
    //Refresh data
    refresh.click(() => getAll());
});

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
let confirmPassword = $("#confirm-password");
let showPassword = $("#show-passowrd");
let showChage = $("#show-change");
let isChange = $("#is-change");
let changePassword = $("#change-password");
let oldPassword = $("#old-password");
let newPassword = $("#new-password");
let confirmNewPassword = $("#confirm-new-password");
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
        destroy: true,
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
                //title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Username",
                data: "Username",
            },
            {
                //title: "Email Address",
                data: "Email",
            },
            {
                //title: "Phone Number",
                data: "Phone",
            },
            {
                //title: "Role Permission",
                data: "Role",
            },
            {
                //title: "Actions",
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
                title: "បញ្ជីអ្នកប្រើប្រាស់តាមតួនាទី",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "បញ្ជីអ្នកប្រើប្រាស់តាមតួនាទី",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "បញ្ជីអ្នកប្រើប្រាស់តាមតួនាទី",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "បញ្ជីអ្នកប្រើប្រាស់តាមតួនាទី",
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


//Show hide
changePassword.change(() => {
    if (changePassword.val() === "0") {
        showChage.hide();
        showPassword.hide();
    } else {
        showChage.show();
        showPassword.hide();
    }
});

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
        ConfirmPassword: confirmPassword.val(),
        Phone: phone.val(),
        Role: role.val(),
        ConfirmPassword: confirmPassword.val()
    };

    response ? $.ajax({
        url: "/api/hr/users/post",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
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
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
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
        url: "/api/hr/users/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();
            isChange.show();
            showChage.hide();
            showPassword.hide();
            dataId.val(response.UserId);
            username.val(response.Username);
            role.val(response.Role);
            phone.val(response.Phone);
            modalUser.modal("show");
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
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
    let response = validateUpdate();

    let data = {
        UserName: username.val(),
        OldPassword: oldPassword.val(),
        NewPassword: newPassword.val(),
        ConfirmPassword: confirmNewPassword.val(),
        Phone: phone.val(),
        Role: role.val(),
    };

    response ? $.ajax({
        url: "/api/hr/users/put-by-id/" + dataId.val(),
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
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
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
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
    })
        .then((param) => {
            param.value ?
                $.ajax({
                    method: "DELETE",
                    url: "/api/hr/users/delete-by-id/" + id,
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
const clear = () => {
    update.hide();
    save.show();
    username.val("");
    phone.val("");
    role.val("-1");
    password.val("");
    isChange.hide();
    showChage.hide();
    showPassword.show();
    changePassword.val("0");
    oldPassword.val("");
    newPassword.val("");
    confirmNewPassword.val("");
    confirmPassword.val("");
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
            title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
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
                title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
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
            if (confirmPassword.val() === "") {
                Swal.fire({
                    title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                confirmPassword.css("border-color", "red");
                confirmPassword.focus();
                isValid = false;
            } else {
                confirmPassword.css("border-color", "#cccccc");
                if (role.val() === "-1") {
                    Swal.fire({
                        title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
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
    }
    return isValid;
};

const validateUpdate = () => {
    let isValid = true;
    if (username.val() === "") {
        Swal.fire({
            title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
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
        if (changePassword.val === "1") {

            if (oldPassword.val() === "") {
                Swal.fire({
                    title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                oldPassword.css("border-color", "red");
                oldPassword.focus();
                isValid = false;
            } else {
                oldPassword.css("border-color", "#cccccc");
                if (newPassword.val() === "") {
                    Swal.fire({
                        title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    newPassword.css("border-color", "red");
                    newPassword.focus();
                    isValid = false;
                } else {
                    newPassword.css("border-color", "#cccccc");
                    if (confirmNewPassword.val() === "") {
                        Swal.fire({
                            title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        confirmNewPassword.css("border-color", "red");
                        confirmNewPassword.focus();
                        isValid = false;
                    } else {
                        confirmNewPassword.css("border-color", "#cccccc");
                        if (role.val() === "-1") {
                            Swal.fire({
                                title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
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
            }
        } else {
            if (role.val() === "-1") {
                Swal.fire({
                    title: "សូមបញ្ចូលទិន្នន័យមួយនេះផង",
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
