jQuery(document).ready(() => { loadingGif(); getAll(); });

//Declare variable for use global
let table = [];
let addNew = $("#add-new");
let update = $("#update");
let save = $("#save");
let modalShortList = $("#modal-short-List");
let dataId = $("#data-id");
let refresh = $("#refresh");
let recruitment = $("#recruitment");
let interview = $("#interview-number");
let onDate = $("#on-date");
let rating = $("#rating");
let noted = $("#noted");
let createdBy = $("#log-by").data("logby");

//Get all data
const getAll = () => {
    table = $("#short-list").DataTable({
        ajax: {
            url: "/api/hr/short-lists/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        // autoWidth: false,
        // scrollX: true,
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
                title: "Name",
                data: null,
                render: (row) => `${row.Applicant.Name} ${row.Applicant.NickName}`,
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
                title: "Code",
                data: "ShortList.InterviewNo",
                render: row => row ? formatInterview(row) : "",
            },
            {
                title: "Rating",
                data: null,
                render: (row) => `${row.ShortList.Rating} 🖤`,
            },
            {
                title: "Date",
                data: "ShortList.CurrentDate",
                render: (row) => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                title: "Decription",
                data: "ShortList.Noted",
            },
            {
                title: "Created",
                data: "ShortList.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "ShortList.UpdatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "ShortList.Id",
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
                title: "SHORT-LIST LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "SHORT-LIST LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "SHORT-LIST LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "SHORT-LIST LIST",
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

//Reload data
refresh.click(() => location.reload());

//Add new
addNew.click(() => {
    clear();
    setColor();
    modalShortList.modal("show");
});


//Save data
save.click(() => {
    let response = validate();
    let data = {
        Recruitment: recruitment.val(),
        Rating: rating.val(),
        InterviewNo: interview.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/short-lists/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                //modalShortList.modal("hide");
                Swal.fire({
                    //position: "top-end",
                    title: response.message,
                    icon: "success",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 2000,
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
        url: "/api/hr/short-lists/get-by-id/" + id,
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

                dataId.val(response.ShortList.Id);
                recruitment.val(response.ShortList.Recruitment);
                interview.val(response.ShortList.InterviewNo);
                rating.val(response.ShortList.Rating);
                noted.val(response.ShortList.Noted);
                onDate.val(formatDate(response.ShortList.CurrentDate));

                modalShortList.modal("show");
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
        Recruitment: recruitment.val(),
        Rating: rating.val(),
        InterviewNo: interview.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/short-lists/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                modalShortList.modal("hide");
                Swal.fire({
                    //position: "top-end",
                    title: response.message,
                    icon: "success",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 2000,
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
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/short-lists/delete-by-id/" + id,
                statusCode: {
                    200: (response) => {
                        table.ajax.reload();
                        Swal.fire({
                            title: response.message,
                            icon: "success",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 2000,
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
                timer: 2000,
                customClass: { title: 'custom-swal-title' },
            });
    }).catch((err) => console.log(err.message));
};

//Clear control
const clear = () => {
    update.hide();
    save.show();
    noted.val("");
    recruitment.val(-1);
    onDate.val("");
    interview.val("-1");
    rating.val(-1);
};

//Set color to border control
const setColor = () => {
    recruitment.css("border-color", "#cccccc");
    interview.css("border-color", "#cccccc");
    rating.css("border-color", "#cccccc");
    onDate.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (recruitment.val() === "-1") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 2000,
        });
        recruitment.css("border-color", "red");
        recruitment.focus();
        isValid = false;
    } else {
        recruitment.css("border-color", "#cccccc");
        if (interview.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 2000,
            });
            interview.css("border-color", "red");
            interview.focus();
            isValid = false;
        } else {
            interview.css("border-color", "#cccccc");
            if (onDate.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 2000,
                });
                onDate.css("border-color", "red");
                onDate.focus();
                isValid = false;
            } else {
                onDate.css("border-color", "#cccccc");
                if (rating.val() === "-1") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 2000,
                    });
                    rating.css("border-color", "red");
                    rating.focus();
                    isValid = false;
                } else {
                    rating.css("border-color", "#cccccc");
                }
            }
        }
    }
    return isValid;
};
