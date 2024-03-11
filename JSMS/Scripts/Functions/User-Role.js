//jQuery for load data
jQuery(document).ready(() => {
    loadingGif();
    //show data
    $("#show").click(() => reads());
});

//Declare variable for use global
let tables = [];
const update = $("#update");
const save = $("#save");
const username = $("#username");
const phone = $("#phone");
const role = $("#role");
const dataId = $("#data-id");
const password = $("#password");
const modalDialog = $("#modal-user");
const confirmPassword = $("#confirm-password");
const showPassword = $("#show-passowrd");
const showChage = $("#show-change");
const isChange = $("#is-change");
const changePassword = $("#change-password");
const oldPassword = $("#old-password");
const newPassword = $("#new-password");
const confirmNewPassword = $("#confirm-new-password");
//const Toast = Swal.mixin({
//    toast: true,
//    //position: "top-end",
//    showConfirmButton: false,
//    timer: 5000,
//});


//Get all data
const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/users/reads",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        destroy: true,
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
                render: row => row ? formatRole(row) : ""
            },
            {
                //title: "Actions",
                data: "UserId",
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
        //        title: lUserRole,
        //        extend: "excelHtml5",
        //        text: "<i class='fa fa-file-excel'> </i> Excel",
        //        className: "btn btn-success btn-sm mt-2",
        //    },
        //    {
        //        title: lUserRole,
        //        extend: "print",
        //        text: "<i class='fa fa-print'> </i> Print",
        //        className: "btn btn-dark btn-sm mt-2",
        //    },
        //    {
        //        title: lUserRole,
        //        extend: "copy",
        //        text: "<i class='fa fa-copy'> </i> Copy Text",
        //        className: "btn btn-info btn-sm mt-2",
        //    },
        //    {
        //        title: lUserRole,
        //        extend: "colvis",
        //        text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
        //        className: "btn btn-primary btn-sm mt-2",
        //    },
        //],
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
$("#add").click(() => {
    clear();
    setColor();
    modalDialog.modal("toggle");
});

//Save data
save.click(() => {
    const response = validate();
    const data = {
        UserName: username.val(),
        Password: password.val(),
        ConfirmPassword: confirmPassword.val(),
        Phone: phone.val(),
        Role: role.val(),
        ConfirmPassword: confirmPassword.val()
    };

    response ? $.ajax({
        url: "/api/hr/users/create",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            reads();
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
        url: "/api/hr/users/read/" + id,
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
            modalDialog.modal("toggle");
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
    const response = validateUpdate();

    const data = {
        UserName: username.val(),
        OldPassword: oldPassword.val(),
        NewPassword: newPassword.val(),
        ConfirmPassword: confirmNewPassword.val(),
        Phone: phone.val(),
        Role: role.val(),
    };

    response ? $.ajax({
        url: "/api/hr/users/update/" + dataId.val(),
        type: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            dataId.val(response.Id);
            tables.ajax.reload();
            clear();
            modalDialog.modal("hide");
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

//Deconste data by id
const remove = (id) => {
    Swal.fire({
        title: lAreYouSure,
        text: lToDeconste,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `<i class='fas fa-times-circle'></i> <span>${lCancel}</span>`,
        confirmButtonText: `<i class='fas fa-trash'></i> <span>${lOK}</span>`,
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value ? $.ajax({
            method: "DEconstE",
            url: "/api/hr/users/delete/" + id,
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
    const isValid = true;
    if (username.val() === "") {
        Swal.fire({
            title: `${lInput} ${lUsername}`,
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
                title: `${lInput} ${lPassword}`,
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
                    title: `${lInput} ${lConfirmPassword}`,
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
                        title: `${lSelect} ${lRole}`,
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
    const isValid = true;
    if (username.val() === "") {
        Swal.fire({
            title: `${lInput} ${lUsername}`,
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
        if (changePassword.val() === "1") {

            if (oldPassword.val() === "") {
                Swal.fire({
                    title: `${lInput} ${lOldPassword}`,
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
                        title: `${lInput} ${lNewPassword}`,
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
                            title: `${lInput} ${lConfirmPassword}`,
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
                                title: `${lInput} ${lProduct}`,
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
                    title: `${lSelect} ${lRole}`,
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
