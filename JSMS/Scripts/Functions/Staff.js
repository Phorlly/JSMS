jQuery(document).ready(() => {
    loadingGif();
    refresh.click(() => getAll());
});

//Declare variable for use global
let table = [];
let addNew = $("#add-new");
let update = $("#update");
let save = $("#save");
let modalStaff = $("#modal-staff");
let dataId = $("#data-id");
let refresh = $("#refresh");
let shortList = $("#short-list");
let client = $("#client");
let onDate = $("#on-date");
datePicker("#on-date");
let mainSalary = $("#main-salary");
let position = $("#position");
let noted = $("#noted");
let code = $("#code");
let shift = $("#shift");
let createdBy = $("#log-by").data("logby");

//Get all data
const getAll = () => {
    table = $("#staff").DataTable({
        ajax: {
            url: "/api/hr/staffs/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        destroy: true,
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
                data: null,
                render: (row) => `${row.Applicant.Name} ${row.Applicant.NickName}`,
            },
            {
                //title: "Code",
                data: "Staff.Code",
            },
            {
                //title: "Gender",
                data: "Applicant.Gender",
                render: (row) => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                //title: "Shift",
                data: "Staff.Status",
                render: row => row === 0 ? "ថ្ងៃ" : "យប់"
            },
            {
                //title: "Profile",
                data: "Applicant.Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                //title: "Company",
                data: "Client.Company",
            },
            {
                //title: "Type",
                data: "Staff.Position",
                render: row => row === 1 ? "ការងារ​ពេញ​ម៉ោង" : row == 2 ? "ក្រៅ​ម៉ោង" : "ជំនួសគេ"
            },
            {
                //title: "Main",
                data: null,
                render: (row) => `${row.Staff.MainSalary.toFixed(2)} <sup>$</sup>`,
            },
            {
                //title: "Premier",
                data: null,
                render: (row) => `${row.Staff.PremierSalary.toFixed(2)} <sup>$</sup>`,
            },
            {
                //title: "Joined",
                data: "Staff.CurrentDate",
                render: (row) => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                //title: "Description",
                data: "Staff.Noted",
            },
            {
                //title: "Created",
                data: "Staff.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Updated",
                data: "Staff.UpdatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Actions",
                data: "Staff.Id",
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
                title: "STAFF LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },

            {
                title: "STAFF LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "STAFF LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "STAFF LIST",
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
    modalStaff.modal("show");
});

//Refresh data
/*refresh.click(() => location.reload());*/

//Save data
save.click(() => {
    let response = validate();
    let data = {
        ShortList: shortList.val(),
        Client: client.val(),
        Position: position.val(),
        MainSalary: mainSalary.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
        Code: "X" + code.val(),
        Status: shift.val()
    };

    //console.log(data);

    response ? $.ajax({
        url: "/api/hr/staffs/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {

                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                //modalStaff.modal("hide");
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

//Get data by id
const edit = (id) => {
    $.ajax({
        url: "/api/hr/staffs/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                //console.log(response);
                setColor();
                clear();
                update.show();
                save.hide();

                dataId.val(response.Staff.Id);
                shortList.val(response.ShortList.Id);
                client.val(response.Client.Id);
                position.val(response.Staff.Position);
                mainSalary.val(response.Staff.MainSalary);
                noted.val(response.Staff.Noted);
                onDate.val(formatDate(response.Staff.CurrentDate));
                code.val(response.Staff.Code);
                shift.val(response.Staff.Status === 0 ? 0 : 1)

                modalStaff.modal("show");
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
        ShortList: shortList.val(),
        Client: client.val(),
        Position: position.val(),
        MainSalary: mainSalary.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Code: code.val(),
        Noted: noted.val(),
        Status: shift.val()
    };

    //console.log(data);

    response ? $.ajax({
        url: "/api/hr/staffs/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                modalStaff.modal("hide");

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
                url: "/api/hr/staffs/delete-by-id/" + id,
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

//Clear control
const clear = () => {
    update.hide();
    save.show();
    noted.val("");
    shortList.val("-1");
    onDate.val("");
    mainSalary.val("");
    position.val("-1");
    client.val("-1");
    code.val("");
    shift.val("0");
};

//Set color to border control
const setColor = () => {
    client.css("border-color", "#cccccc");
    shortList.css("border-color", "#cccccc");
    position.css("border-color", "#cccccc");
    mainSalary.css("border-color", "#cccccc");
    onDate.css("border-color", "#cccccc");
    code.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (shortList.val() === "-1") {
        Swal.fire({
            //toast: true,
            //position: 'top-end',
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        shortList.css("border-color", "red");
        shortList.focus();
        isValid = false;
    } else {
        shortList.css("border-color", "#cccccc");
        if (client.val() === "-1") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            client.css("border-color", "red");
            client.focus();
            isValid = false;
        } else {
            client.css("border-color", "#cccccc");
            if (code.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                code.css("border-color", "red");
                code.focus();
                isValid = false;
            } else {
                code.css("border-color", "#cccccc");
                if (mainSalary.val() === "") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    mainSalary.css("border-color", "red");
                    mainSalary.focus();
                    isValid = false;
                } else {
                    mainSalary.css("border-color", "#cccccc");
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
                        if (position.val() === "-1") {
                            Swal.fire({
                                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                icon: "warning",
                                showConfirmButton: false,
                                customClass: { title: 'custom-swal-title' },
                                timer: 1500,
                            });
                            position.css("border-color", "red");
                            position.focus();
                            isValid = false;
                        } else {
                            position.css("border-color", "#cccccc");
                        }
                    }
                }
            }
        }
    }
    return isValid;
};
