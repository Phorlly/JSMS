jQuery(document).ready(() => {
    loadingGif();
    refresh.click(() => getAll());
});

//Declare variable for use global
let table = [];
let addNew = $("#add-new");
let update = $("#update");
let save = $("#save");
let modalRecruitment = $("#modal-Recruitment");
let dataId = $("#data-id");
let refresh = $("#refresh");
let applicant = $("#applicant");
let gaurantor = $("#gaurantor");
let onDate = $("#on-date");
datePicker("#on-date");
let noted = $("#noted");
let createdBy = $("#log-by").data("logby");

//Get all data
const getAll = () => {
    table = $("#recruitment").DataTable({
        ajax: {
            url: "/api/hr/recruitments/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        destroy: true,
        // autoWidth: false,
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
                //title: "Name of Applicant",
                data: null,
                render: row => `${row.Applicant.Name} ${row.Applicant.NickName}`,
            },
            {
                //title: "Gender",
                data: "Applicant.Gender",
                render: row => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                //title: "Profile",
                data: "Applicant.Image",
                render: row => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>"
            },
            {
                //title: "Name of Gaurantor",
                data: null,
                render: row => `${row.Gaurantor.Name} ${row.Gaurantor.NickName}`,
            },
            {
                //title: "Gender",
                data: "Gaurantor.Gender",
                render: row => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                //title: "Profile",
                data: "Gaurantor.Image",
                render: row => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                //title: "Date",
                data: "Recruitment.CurrentDate",
                render: row => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                //title: "Description",
                data: "Recruitment.Noted",
            },
            {
                //title: "Created",
                data: "Recruitment.CreatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Updated",
                data: "Recruitment.UpdatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Actions",
                data: "Recruitment.Id",
                render: row => `<div> 
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
                title: "បញ្ជីបេក្ខេជនដាក់ពាក្យត្រូវបានជ្រើសរើស",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "បញ្ជីបេក្ខេជនដាក់ពាក្យត្រូវបានជ្រើសរើស",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "បញ្ជីបេក្ខេជនដាក់ពាក្យត្រូវបានជ្រើសរើស",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "បញ្ជីបេក្ខេជនដាក់ពាក្យត្រូវបានជ្រើសរើស",
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

//Relaod data
//refresh.click(() => location.reload());

//Add new
addNew.click(() => {
    clear();
    setColor();
    modalRecruitment.modal("show");
});

//Save data
save.click(() => {
    let response = validate();
    let data = {
        Gaurantor: gaurantor.val(),
        Applicant: applicant.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/recruitments/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            table.ajax.reload();
            clear();
            //modalRecruitment.modal("hide");
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
        url: "/api/hr/recruitments/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();

            dataId.val(response.Recruitment.Id);
            applicant.val(response.Recruitment.Applicant);
            gaurantor.val(response.Recruitment.Gaurantor);
            noted.val(response.Recruitment.Noted);
            onDate.val(formatDate(response.Recruitment.CurrentDate));
            modalRecruitment.modal("show");
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
    let response = validate();
    let data = {
        Gaurantor: gaurantor.val(),
        Applicant: applicant.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/recruitments/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            table.ajax.reload();
            clear();
            modalRecruitment.modal("hide");
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
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/recruitments/delete-by-id/" + id,
                success: (response) => {
                    table.ajax.reload();
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
const clear = () => {
    update.hide();
    save.show();
    noted.val("");
    applicant.val(-1);
    onDate.val("");
    gaurantor.val(-1);
};

//Set color to border control
const setColor = () => {
    applicant.css("border-color", "#cccccc");
    gaurantor.css("border-color", "#cccccc");
    onDate.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (applicant.val() === "-1") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        applicant.css("border-color", "red");
        applicant.focus();
        isValid = false;
    } else {
        applicant.css("border-color", "#cccccc");
        if (gaurantor.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            gaurantor.css("border-color", "red");
            gaurantor.focus();
            isValid = false;
        } else {
            gaurantor.css("border-color", "#cccccc");
            if (onDate.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                onDate.css("border-color", "red");
                onDate.focus();
                isValid = false;
            } else {
                onDate.css("border-color", "#cccccc");
            }
        }
    }
    return isValid;
};
