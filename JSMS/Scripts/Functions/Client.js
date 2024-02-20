jQuery(document).ready(() => {
    loadingGif();
    //datePicker("#dob");
    $("#show").click(() => reads());
});

//Declare variable for use global
let tables = [];
let update = $("#update");
let save = $("#save");
let modalDialog = $("#modal-client");
let dataId = $("#data-id");
let imageFile = $("#imageFile");
let image = $("#image");
let ownername = $("#ownername");
let company = $("#company");
let vattin = $("#vattin");
let phone1 = $("#phone1");
let phone2 = $("#phone2");
let gender = $("#gender");
let position = $("#position");
let dob = $("#dob");
let noted = $("#noted");
let province = $("#province");
let district = $("#district");
let commune = $("#commune");
let village = $("#village");
let createdBy = $("#log-by").data("logby");
let districtId = $("#district-id");
let communeId = $("#commune-id");
let villageId = $("#village-id");

//Get all data
const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/clients/reads",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        autoWidth: false,
        destroy: true,
        //scrollX: true,
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
                data: "client.Name",
            },
            //{
            //    //title: "Gender",
            //    data: "Client.Gender",
            //    render: (row) => row === true ? lMale : lFemale,
            //},
            {
                //title: "Position",
                data: "client.Position",
                render: row => row ? formatPosition(row) : "",
            },
            {
                //title: "Company",
                data: "client.Company",
            },
            {
                //title: "Profile",
                data: "client.Image",
                render: (row) => {
                    const file = row ? row : "../Images/blank-image.png";
                    return `<img src="${file}" class='rounded-circle' width='50px' height="50px"/>`;
                },
            },
            {
                //title: "DOB",
                data: "client.DOB",
                render: (row) => row ? convertToKhmerDate(row) : "",
            },
            //{
            //    //title: "VATTIN",
            //    data: "Client.VATTIN",
            //    render: row => formatVattin(row),
            //},
            {
                //title: "Telephone",
                data: null,
                render: (row) => `${row.client.Phone1} ${row.client.Phone2}`,
            },
            {
                //title: "Address",
                data: null,
                render: (row) => `${row.village.NameKh}
                                  ${row.commune.NameKh}
                                  ${row.district.NameKh}
                                  ${row.province.NameKh}`
            },
            {
                //title: "Description",
                data: "Staff",
                render: row => countPeople(row),
            },
            {
                //title: "Description",
                data: "client.Noted",
            },
            //{
            //    //title: "Created",
            //    data: "client.CreatedAt",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            //{
            //    //title: "Updated",
            //    data: "client.UpdatedAt",
            //    render: (row) => row ? moment(row).fromNow() : "",
            //},
            {
                //title: "Actions",
                data: "client.Id",
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
                title: lClientList,
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: lClientList,
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: lClientList,
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: lClientList,
                extend: "colvis",
                text: "<i class='fas fa-angle-double-down'> </i> Colunm Vision",
                className: "btn btn-primary btn-sm mt-2",
            },
        ],
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

//get file image
const readUrl = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            image.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//Relaod data
/*refresh.click(() => location.reload());*/

//Add new
$("#add").click(() => {
    clear();
    setColor();
    modalDialog.modal("show");
});

//Save data
save.click(() => {
    let response = validate();
    let formData = new FormData();
    let files = imageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }

    formData.append("Name", ownername.val());
    formData.append("Company", company.val());
    formData.append("VATTIN", vattin.val());
    formData.append("Gender", gender.val());
    formData.append("DOB", dob.val());
    formData.append("Position", position.val());
    formData.append("Phone1", phone1.val());
    formData.append("Phone2", phone2.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", noted.val());
    formData.append("Province", province.val());
    formData.append("District", district.val());
    formData.append("Commune", commune.val());
    formData.append("Village", village.val());

    response ? $.ajax({
        url: "/api/hr/clients/create",
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
        url: "/api/hr/clients/read/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            setColor();
            clear();
            update.show();
            save.hide();

            dataId.val(response.client.Id);
            ownername.val(response.client.Name);
            company.val(response.client.Company);
            vattin.val(response.client.VATTIN);
            gender.val(response.client.Gender === true ? "true" : "false");
            phone1.val(response.client.Phone1);
            phone2.val(response.client.Phone2);
            position.val(response.client.Position);
            image.attr("src", response.client.Image ? response.client.Image : "../Images/blank-image.png");
            noted.val(response.client.Noted);
            dob.val(formatDate(response.client.DOB));
            province.val(response.province.Id);
            districtId.val(response.district.Id);
            communeId.val(response.commune.Id);
            villageId.val(response.village.Id);

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
    let formData = new FormData();
    let files = imageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }

    formData.append("Name", ownername.val());
    formData.append("Company", company.val());
    formData.append("Gender", gender.val());
    formData.append("VATTIN", vattin.val());
    formData.append("DOB", dob.val());
    formData.append("Position", position.val());
    formData.append("Phone1", phone1.val());
    formData.append("Phone2", phone2.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", noted.val());
    formData.append("Province", province.val());
    if (district.val() === "-1" && commune.val() === "-1" && village.val() === "-1") {
        formData.append("District", districtId.val());
        formData.append("Commune", communeId.val());
        formData.append("Village", villageId.val());
    } else {
        formData.append("District", district.val());
        formData.append("Commune", commune.val());
        formData.append("Village", village.val());
    }

    response ? $.ajax({
        url: "/api/hr/clients/update/" + dataId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
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
        param.value ? $.ajax({
            method: "DELETE",
            url: "/api/hr/clients/delete/" + id,
            success: (response) => {
                tables.ajax.reload();
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
    imageFile.val("");
    image.attr("src", "../Images/blank-image.png");
    ownername.val("");
    company.val("");
    vattin.val("-1");
    phone1.val("");
    phone2.val("");
    gender.val("false");
    position.val("-1");
    dob.val("");
    noted.val("");
    province.val("-1");
    district.val("-1");
    commune.val("-1");
    village.val("-1");
};

//Set color to border control
const setColor = () => {
    ownername.css("border-color", "#cccccc");
    company.css("border-color", "#cccccc");
    position.css("border-color", "#cccccc");
    vattin.css("border-color", "#cccccc");
    phone1.css("border-color", "#cccccc");
    dob.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (ownername.val() === "") {
        Swal.fire({
            title: `${lInput} ${lOwnerName}`,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        ownername.css("border-color", "red");
        ownername.focus();
        isValid = false;
    } else {
        ownername.css("border-color", "#cccccc");
        if (company.val() === "") {
            Swal.fire({
                title: `${lInput} ${lCompany}`,
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            company.css("border-color", "red");
            company.focus();
            isValid = false;
        } else {
            company.css("border-color", "#cccccc");
            if (vattin.val() === "-1") {
                Swal.fire({
                    title: `${lSelect} ${lVATTIN}`,
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                vattin.css("border-color", "red");
                vattin.focus();
                isValid = false;
            } else {
                vattin.css("border-color", "#cccccc");
                if (dob.val() === "") {
                    Swal.fire({
                        title: `${lSelect} ${lDOB}`,
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    dob.css("border-color", "red");
                    isValid = false;
                } else {
                    dob.css("border-color", "#cccccc");
                    if (phone1.val() === "") {
                        Swal.fire({
                            title: `${lInput} ${lPhone}`,
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        phone1.css("border-color", "red");
                        phone1.focus();
                        isValid = false;
                    } else {
                        phone1.css("border-color", "#cccccc");
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
                            if (province.val() === "-1") {
                                Swal.fire({
                                    title: `${lSelect} ${lProvince}`,
                                    icon: "warning",
                                    showConfirmButton: false,
                                    customClass: { title: 'custom-swal-title' },
                                    timer: 1500,
                                });
                                province.css("border-color", "red");
                                province.focus();
                                isValid = false;
                            } else {
                                province.css("border-color", "#cccccc");
                            }
                        }
                    }
                }
            }
        }
    }
    return isValid;
};

//Change value
province.change(() => {
    let provinceId = province.val();

    provinceId ? $.ajax({
        url: "/home/district",
        type: "GET",
        data: { province: provinceId },
        dataType: "JSON",
        success: (response) => {
            district.empty();
            commune.empty();
            village.empty();
            district.append($("<option>").val("-1").text(`---${lSelect} ${lDistrict}---`));
            commune.append($("<option>").val("-1").text(`---${lSelect} ${lCommune}---`));
            village.append($("<option>").val("-1").text(`---${lSelect} ${lVillage}---`));

            $.each(response, (inex, row) => {
                district.append(
                    $("<option>")
                        .val(row.Id)
                        .text(row.NameKh + " / " + row.Name)
                );
            });
        },
        error: (hasError) => {
            console.log(hasError);
        },
    }) : province.append($("<option>").val("-1").text(`---${lSelect} ${lProvince}---`));
});

//Change value
district.change(() => {
    let districtId = district.val();

    districtId ? $.ajax({
        url: "/home/commune",
        type: "GET",
        data: { district: districtId },
        dataType: "JSON",
        success: (response) => {
            commune.empty();
            village.empty();
            commune.append($("<option>").val("-1").text(`---${lSelect} ${lCommune}---`));
            village.append($("<option>").val("-1").text(`---${lSelect} ${lVillage}---`));

            $.each(response, (inex, row) => {
                commune.append(
                    $("<option>")
                        .val(row.Id)
                        .text(row.NameKh + " / " + row.Name)
                );
            });

        },
        error: (hasError) => {
            console.log(hasError);
        },
    }) : district.append($("<option>").val("-1").text(`---${lSelect} ${lVillage}---`));
});

//Change value
commune.change(() => {
    let communeId = commune.val();

    communeId ? $.ajax({
        url: "/home/village",
        type: "GET",
        data: { commune: communeId },
        dataType: "JSON",
        success: (response) => {
            village.empty();
            village.append($("<option>").val("-1").text(`---${lSelect} ${lVillage}---`));

            $.each(response, (inex, row) => {
                village.append(
                    $("<option>")
                        .val(row.Id)
                        .html(row.NameKh + " / " + row.Name)
                );
            });

        },
        error: (hasError) => {
            console.log(hasError);
        },
    }) : commune.append($("<option>").val("-1").text(`---${lSelect} ${lCommune}---`));
});
