jQuery(document).ready(() => {
    loadingGif();
    getBehavior();
});

//Declare variable for use global
let behavior = [];
let addBevior = $("#add-bevior");
let behaviorId = $("#behavior-id");
let updateBevior = $("#update-behavior");
let saveBevior = $("#save-behavior");
let attachment = $("#attachment");
let confirmBy = $("#confirm-by");
let currentDate = $("#current-date");
let bNoted = $("#b-noted");
let applicantId = $("#applicant-id");
let fileShow = $("#get-file");
let modalBehavior = $("#modal-behavior");

//Get all data
const getBehavior = () => {
    behavior = $("#behavior").DataTable({
        ajax: {
            url: "/api/hr/behaviors/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        //destroy: true,
        // autoWidth: false,
        //scrollX: true,
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
                title: "N<sup>o</sup>",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                title: "Name of Applicant",
                data: null,
                render: (row) => `${row.Applicant.Name} ${row.Applicant.NickName}`
            },
            {
                title: "Gender",
                data: "Applicant.Gender",
                render: (row) => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                title: "Profile",
                data: "Applicant.Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                title: "Confirmed",
                data: "Behavior.ConfirmBy",
            },
            {
                title: "Date",
                data: "Behavior.CurrentDate",
                render: row => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                title: "Attachment",
                data: "Behavior.Attachment",
                render: row => {
                    if (row === null) {
                        return "";
                    } else {
                        let fileInfo = readFile(row);
                        return `<a href="${fileInfo.url}" target="_blank">${fileInfo.name}</a>`;
                    }
                },
            },
            {
                title: "Decription",
                data: "Behavior.Noted",
            },
            {
                title: "Created",
                data: "Behavior.CreatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "Behavior.UpdatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "Behavior.Id",
                render: row => `<div> 
                                    <button onclick= "editBehavior('${row}')" class= 'btn btn-warning btn-sm' >
                                        <span class='fas fa-edit'></span>
                                    </button>
                                    <button onclick= "removeBehavior('${row}')" class= 'btn btn-danger btn-sm' >
                                        <span class='fas fa-trash-alt'></span>
                                    </button>
                                </div>`,
            },
        ],
        buttons: [
            {
                title: "BEHAVIOR CERTIFICATE OF APPLICANT ",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "BEHAVIOR CERTIFICATE OF APPLICANT ",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "BEHAVIOR CERTIFICATE OF APPLICANT ",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "BEHAVIOR CERTIFICATE OF APPLICANT ",
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
addBevior.click(() => {
    clearBehavior();
    colorBehavior();
    modalBehavior.modal("show");
});

//Save data
saveBevior.click(() => {
    let isValid = validateBehavior();
    let formData = new FormData();
    let files = attachment.get(0).files;
    if (files.length > 0) {
        formData.append("Attachment", files[0]);
    }
    formData.append("Applicant", applicantId.val());
    formData.append("ConfirmBy", confirmBy.val());
    formData.append("CurrentDate", currentDate.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", bNoted.val());

    isValid ? $.ajax({
        url: "/api/hr/behaviors/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                behaviorId.val(response.Id);
                behavior.ajax.reload();
                clearBehavior();
                colorBehavior();
                //modalBehavior.modal("hide");
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
const editBehavior = (id) => {
    $.ajax({
        url: "/api/hr/behaviors/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                //console.log(response);
                colorBehavior();
                clearBehavior();
                updateBevior.show();
                saveBevior.hide();

                behaviorId.val(response.Behavior.Id);
                applicantId.val(response.Behavior.Applicant);
                confirmBy.val(response.Behavior.ConfirmBy);
                bNoted.val(response.Behavior.Noted);
                currentDate.val(formatDate(response.Behavior.CurrentDate));
                response.Behavior.Attachment ? fileShow.html(showFile(response.Behavior.Attachment)) : "";
                modalBehavior.modal("show");
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
updateBevior.click(() => {
    let isValid = validateBehavior();
    let formData = new FormData();
    let files = attachment.get(0).files;
    if (files.length > 0) {
        formData.append("Attachment", files[0]);
    }
    formData.append("Applicant", applicantId.val());
    formData.append("ConfirmBy", confirmBy.val());
    formData.append("CurrentDate", currentDate.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", bNoted.val());

    isValid ? $.ajax({
        url: "/api/hr/behaviors/put-by-id/" + behaviorId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                behavior.ajax.reload();
                modalBehavior.modal("hide");
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

//Delete data by id
const removeBehavior = (id) => {
    Swal.fire({
        title: "តើអ្នកប្រាកដដែរឬទេ?",
        text: "ថាចង់លុបទិន្នន័យមួយនេះចេញ !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/behaviors/delete-by-id/" + id,
                statusCode: {
                    200: (response) => {
                        behavior.ajax.reload();
                        Swal.fire({
                            //position: "top-end",
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
const clearBehavior = () => {
    saveBevior.show();
    updateBevior.hide();
    bNoted.val("");
    currentDate.val("");
    confirmBy.val("");
    attachment.val("");
    fileShow.html("");
    applicantId.val("-1");
};

//Set color to border control
const colorBehavior = () => {
    applicantId.css("border-color", "#cccccc");
    confirmBy.css("border-color", "#cccccc");
    currentDate.css("border-color", "#cccccc");
};

//Check validation
const validateBehavior = () => {
    let isValid = true;
    if (applicantId.val() === "-1") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        applicantId.css("border-color", "red");
        applicantId.focus();
        isValid = false;
    } else {
        applicantId.css("border-color", "#cccccc");
        if (confirmBy.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            confirmBy.css("border-color", "red");
            confirmBy.focus();
            isValid = false;
        } else {
            confirmBy.css("border-color", "#cccccc");
            if (currentDate.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                currentDate.css("border-color", "red");
                currentDate.focus();
                isValid = false;
            } else {
                currentDate.css("border-color", "#cccccc");
                if (currentDate.val() === "") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    currentDate.css("border-color", "red");
                    currentDate.focus();
                    isValid = false;
                } else {
                    currentDate.css("border-color", "#cccccc");
                }
            }
        }
    }
    return isValid;
};
