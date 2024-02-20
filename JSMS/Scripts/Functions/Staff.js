jQuery(document).ready(() => {
    loadingGif();
    $("#show").click(() => reads());
    datePicker("#on-date");
});

//Declare variable for use global
let tables = [];
let update = $("#update");
let save = $("#save");
let modalDialog = $("#modal-staff");
let dataId = $("#data-id");
let shortList = $("#short-list");
let client = $("#client");
let onDate = $("#on-date");
let mainSalary = $("#main-salary");
let position = $("#position");
let noted = $("#noted");
let code = $("#code");
let shift = $("#shift");
let createdBy = $("#log-by").data("logby");

//Get all data
const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/staffs/reads",
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
        columns: [
            {
                //title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Name",
                data: "applicant.FullName",
            },
            {
                //title: "Code",
                data: "staff.Code",
            },
            {
                //title: "Gender",
                data: "applicant.Sex",
                render: (row) => row === true ? lMale : lFemale,
            },
            {
                //title: "Shift",
                data: "staff.Status",
                render: row => row === 0 ? lMorning : lNight
            },
            {
                //title: "Profile",
                data: "applicant.Image",
                render: (row) => {
                    const file = row ? row : "../Images/blank-image.png";
                    return `<img src="${file}" class='rounded-circle' width='50px' height="50px"/>`;
                },
            },
            {
                //title: "Company",
                data: "client.Company",
            },
            {
                //title: "Type",
                data: "staff.Position",
                render: row => row === 1 ? lFullTime : row == 2 ? lPartTime : lInstead
            },
            {
                //title: "Main",
                data: null,
                render: (row) => `${row.staff.MainSalary.toFixed(2)} <sup>$</sup>`,
            },
            {
                //title: "Premier",
                data: null,
                render: (row) => `${row.staff.PremierSalary.toFixed(2)} <sup>$</sup>`,
            },
            {
                //title: "Joined",
                data: "staff.CurrentDate",
                render: (row) => row ? moment(row).format("DD MMM YYYY") : "",
            },
            {
                //title: "Description",
                data: "staff.Noted",
            },
            //{
            //    //title: "Created",
            //    data: "staff.CreatedAt",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            //{
            //    //title: "Updated",
            //    data: "staff.UpdatedAt",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            {
                //title: "Actions",
                data: "staff.Id",
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
        buttons: [
            {
                title: lStaffList,
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },

            {
                title: lStaffList,
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: lStaffList,
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: lStaffList,
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            }) : console.log(xhr.responseText),
    });
};

//Add new
$("#add").click(() => {
    clear();
    setColor();
    modalDialog.modal("show");
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
        Code: code.val(),
        Status: shift.val()
    };

    //console.log(data);

    response ? $.ajax({
        url: "/api/hr/staffs/create",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            reads();
            dataId.val(response.Id);
            clear();
            tables.ajax.reload();
            
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
                showConfirmButton: true,
                customClass: { title: 'custom-swal-title' },
                //timer: 1500,
            }) : console.log(xhr.responseText),
    }) : false;
});

//Get data by id
const read = (id) => {
    $.ajax({
        url: "/api/hr/staffs/read/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();

            dataId.val(response.staff.Id);
            shortList.val(response.shortList.Id);
            client.val(response.client.Id);
            position.val(response.staff.Position);
            mainSalary.val(response.staff.MainSalary);
            noted.val(response.staff.Noted);
            onDate.val(formatDate(response.staff.CurrentDate));
            code.val(response.staff.Code);
            shift.val(response.staff.Status === 0 ? 0 : 1)

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
        url: "/api/hr/staffs/update/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
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
                url: "/api/hr/staffs/delete/" + id,
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
    update.hide();
    save.show();
    noted.val("");
    shortList.val("-1");
    setCurrentDate("#on-date");
    mainSalary.val("160");
    position.val("1");
    client.val("-1");
    code.val("X");
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
            title: `${lSelect} ${lJobApplicant}`,
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
                title: `${lSelect} ${lLocation}`,
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
            if (code.val() === "X") {
                Swal.fire({
                    title: `${lInput} ${lCode}`,
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
                        title: `${lInput} ${lMain}`,
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
                    if (position.val() === "-1") {
                        Swal.fire({
                            title: `${lSelect} ${lPosition}`,
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
    return isValid;
};
