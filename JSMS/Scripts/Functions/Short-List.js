jQuery(document).ready(() => {
    loadingGif();
    $("#show").click(() => reads());
    datePicker("#on-date");
});

//Declare variable for use global
let tables = [];
let rating;
const add = $("#add");
const update = $("#update");
const save = $("#save");
const modalDialog = $("#modal-short-list");
const dataId = $("#data-id");
const applicant = $("#job-applicant");
const interview = $("#interview-number");
const onDate = $("#on-date");
const noted = $("#noted");
const createdBy = $("#log-by").data("logby");

//Get all data
const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/short-lists/reads",
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
        columns: [
            {
                //title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Name",
                data: null,
                render: (row) => `${row.applicant.FirstName} ${row.applicant.LastName}`,
            },
            {
                //title: "Gender",
                data: "applicant.Sex",
                render: (row) => row === true ? lMale : lFemale,
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
                //title: "Code",
                data: "shortList.InterviewNo",
                render: row => row ? formatInterview(row) : "",
            },
            {
                //title: "Rating",
                data: null,
                render: (row) => {
                    const rating = row.shortList.Rating;
                    const filledStarIcon = '<i class="fas fa-star" style="color: #f8d101;"></i>';
                    const unfilledStarIcon = '<i class="far fa-star" style="color: #ddd;"></i>';
                    const starIcons = filledStarIcon.repeat(rating) + unfilledStarIcon.repeat(5 - rating);

                    return `${starIcons}`;
                }
            },
            {
                //title: "Date",
                data: "shortList.CurrentDate",
                render: (row) => row ? moment(row).format("DD MMM YYYY") : "",
            },
            {
                data: "shortList.Status",
                render: row => formatStatus(row),
            },
            {
                //title: "Decription",
                data: "shortList.Noted",
            },
            {
                //title: "Created",
                data: "shortList.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            //{
            //    //title: "Updated",
            //    data: "shortList.UpdatedAt",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            {
                //title: "Actions",
                data: "shortList.Id",
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
                title: lApplicantShortList,
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: lApplicantShortList,
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: lApplicantShortList,
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: lApplicantShortList,
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
    });
};


$('.rating input').change((event) => {
    rating = $(event.target).val();
});

//Add new
add.click(() => {
    clear();
    setColor();
    modalDialog.modal("toggle");
});

//Save data
save.click(() => {
    let response = validate();
    const data = {
        Applicant: applicant.val(),
        Rating: rating,
        InterviewNo: interview.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/short-lists/create",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            reads();
            dataId.val(response.Id);
            tables.ajax.reload();
            clear();
            //modalDialog.modal("hide");
            Swal.fire({
                title: response.message,
                icon: "success",
                showConfirmButton: false,
                timer: 2000,
            });
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            }) : console.log(xhr.responseText),
    }) : false;
});

//Get data by id
const read = (id) => {
    $.ajax({
        url: "/api/hr/short-lists/read/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();

            dataId.val(response.shortList.Id);
            applicant.val(response.shortList.Applicant);
            interview.val(response.shortList.InterviewNo);
            $('input[name="rating"][value="' + response.shortList.Rating + '"]').prop('checked', true);
            //rating.val(response.shortList.Rating);
            noted.val(response.shortList.Noted);
            onDate.val(formatDate(response.shortList.CurrentDate));

            modalDialog.modal("toggle");
        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                title: xhr.responseJSON.message,
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            }) : console.log(xhr.responseText),
    });
};

//Update by id
update.click(() => {
    let response = validate();
    const data = {
        applicant: applicant.val(),
        Rating: rating,
        InterviewNo: interview.val(),
        CurrentDate: onDate.val(),
        CreatedBy: createdBy,
        Noted: noted.val(),
    };

    response ? $.ajax({
        url: "/api/hr/short-lists/update/" + dataId.val(),
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        success: (response) => {
            dataId.val(response.Id);
            tables.ajax.reload();
            clear();
            modalDialog.modal("toggle");
            Swal.fire({
                title: response.message,
                icon: "success",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 2000,
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
        text: lToDelete,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `<i class='fas fa-times-circle'></i> <span>${lCancel}</span>`,
        confirmButtonText: `<i class='fas fa-trash'></i> <span>${lOK}</span>`,
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value
            ? $.ajax({
                method: "DELETE",
                url: "/api/hr/short-lists/delete/" + id,
                success: (response) => {
                    tables.ajax.reload();
                    Swal.fire({
                        title: response.message,
                        icon: "success",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 2000,
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
    applicant.val("-1");
    setCurrentDate("#on-date");
    interview.val("-1");
    $('.rating input[value="2"]').prop('checked', true);
};

//Set color to border control
const setColor = () => {
    applicant.css("border-color", "#cccccc");
    interview.css("border-color", "#cccccc");
    onDate.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    const isValid = true;

    if (applicant.val() === "-1") {
        Swal.fire({
            title: `${lSelect} ${lJobApplicant}`,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 2000,
        });
        applicant.css("border-color", "red");
        applicant.focus();
        isValid = false;
    } else {
        applicant.css("border-color", "#cccccc");
        if (interview.val() === "-1") {
            Swal.fire({
                title: `${lSelect} ${lCode}`,
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
        }
    }
    return isValid;
};
