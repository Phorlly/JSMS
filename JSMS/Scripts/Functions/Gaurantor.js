jQuery(document).ready(() => {
    loadingGif();
    getGuarantor();
    numberOnly("g-phone1");
    numberOnly("g-phone2");
});

//Declare variable for use global
let guarantor = [];
let gImageFile = $("#g-image-file");
let guarantorId = $("#guarantor-id");
let addGuanrantor = $("#add-guanrantor");
let modalGaurantor = $("#modal-gaurantor");
let updateGuarantor = $("#update-guarantor");
let saveGuarantor = $("#save-guarantor");
let gImage = $("#g-image");
let gBirthName = $("#g-birth-name");
let gNickName = $("#g-nick-name");
let gNational = $("#g-national");
let gNationality = $("#g-nationality");
let gPhone1 = $("#g-phone1");
let gPhone2 = $("#g-phone2");
let gGender = $("#g-gender");
let gEducation = $("#g-education");
let gNoted = $("#g-noted");
let gDOB = $("#g-dob");

//Place of birth
let gBProvince = $("#g-birth-province");
let gBDistrict = $("#g-birth-district");
let gBCommune = $("#g-birth-commune");
let gBVillage = $("#g-birth-village");

//Whe editGuarantor
let gBDistrictId = $("#g-birth-dis-id");
let gBCommuneId = $("#g-birth-com-id");
let gBVillageId = $("#g-birth-vil-id");

//Hide or show
let gBDis = $("#g-birth-dis");
let gBCom = $("#g-birth-com");
let gBVil = $("#g-birth-vil");

let gCProvince = $("#g-current-province");
let gCDistrict = $("#g-current-district");
let gCCommune = $("#g-current-commune");
let gCVillage = $("#g-current-village");

//When editGuarantor
let gCDistrictId = $("#g-current-dis-id");
let gCCommuneId = $("#g-current-com-id");
let gCVillageId = $("#g-current-vil-id");

//Hide or show
let gCDis = $("#g-current-dis");
let gCCom = $("#g-current-com");
let gCVil = $("#g-current-vil");

//Get all data
const getGuarantor = () => {
    guarantor = $("#guarantor").DataTable({
        ajax: {
            url: "/api/hr/gaurantors/get",
            dataSrc: "",
            method: "GET",
        },
        // responsive: true,
        autoWidth: true,
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
                title: "Name",
                data: null,
                render: (row) => `${row.Gaurantor.Name} ${row.Gaurantor.NickName}`,
            },
            {
                title: "Gender",
                data: "Gaurantor.Gender",
                render: (row) => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                title: "Education",
                data: "Gaurantor.Education",
                render: row => row ? formatEducation(row) : "",
            },
            {
                title: "Profile",
                data: "Gaurantor.Image",
                render: row => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                title: "DOB",
                data: "Gaurantor.DOB",
                render: (row) => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                title: "Nationality",
                data: "Gaurantor.Nationality",
            },
            {
                title: "Telephone",
                data: null,
                render: (row) => `${row.Gaurantor.Phone1} ${row.Gaurantor.Phone2}`,
            },
            {
                title: "Address",
                data: null,
                render: (row) => `${row.CVillage.NameKh},
                                  ${row.CCommune.NameKh},
                                  ${row.CDistrict.NameKh},
                                  ${row.CProvince.NameKh}`,
            },
            {
                title: "Created",
                data: "Gaurantor.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",

            },
            {
                title: "Updated",
                data: "Gaurantor.UpdatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "Gaurantor.Id",
                render: (row) => `<div> 
                                      <button onclick= "editGuarantor('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "removeGuarantor('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,
            },
        ],
        buttons: [
            {
                title: "GUARANTOR LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "GUARANTOR LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "GUARANTOR LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "GUARANTOR LIST",
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

//get file image
const guarantorImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            gImage.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//Add new
addGuanrantor.click(() => {
    clearGuarantor();
    colorGuarantor();
    modalGaurantor.modal("show");
});

//Save data
saveGuarantor.click(() => {
    let isValid = validateGuarantor();
    let formData = new FormData();
    let files = gImageFile.get(0).files;
    if (files.length > 0) {
        formData.append("Image", files[0]);
    }

    formData.append("Name", gBirthName.val());
    formData.append("NickName", gNickName.val());
    formData.append("National", gNational.val());
    formData.append("Nationality", gNationality.val());
    formData.append("Gender", gGender.val());
    formData.append("DOB", gDOB.val());
    formData.append("Education", gEducation.val());
    formData.append("Phone1", gPhone1.val());
    formData.append("Phone2", gPhone2.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Province", gCProvince.val());
    formData.append("District", gCDistrict.val());
    formData.append("Commune", gCCommune.val());
    formData.append("Village", gCVillage.val());
    formData.append("Noted", gNoted.val());
    formData.append("BProvince", gBProvince.val());
    formData.append("BDistrict", gBDistrict.val());
    formData.append("BCommune", gBCommune.val());
    formData.append("BVillage", gBVillage.val());

    isValid ? $.ajax({
        url: "/api/hr/gaurantors/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                guarantorId.val(response.Id);
                guarantor.ajax.reload();
                clearGuarantor();
                colorGuarantor();

                //modalGaurantor.modal("hide");
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
const editGuarantor = (id) => {
    $.ajax({
        url: "/api/hr/gaurantors/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        statusCode: {
            200: (response) => {
                //console.log(response);
                colorGuarantor();
                clearGuarantor();
                updateGuarantor.show();
                saveGuarantor.hide();

                response.Gaurantor.Gender === true ? gGender.val("true") : gGender.val("false");
                guarantorId.val(response.Gaurantor.Id);
                gBirthName.val(response.Gaurantor.Name);
                gNickName.val(response.Gaurantor.NickName);
                gNational.val(response.Gaurantor.National);
                gNationality.val(response.Gaurantor.Nationality);
                gPhone1.val(response.Gaurantor.Phone1);
                gPhone2.val(response.Gaurantor.Phone2);
                gEducation.val(response.Gaurantor.Education);
                response.Gaurantor.Image ? gImage.attr("src", response.Gaurantor.Image) : image.attr("src", "../Images/blank-image.png");
                gNoted.val(response.Gaurantor.Noted);
                gDOB.val(formatDate(response.Gaurantor.DOB));
                gBProvince.val(response.BProvince.Id);
                gBDistrictId.val(response.BDistrict.Id);
                gBCommuneId.val(response.BCommune.Id);
                gBVillageId.val(response.BVillage.Id);

                gBDis.hide();
                gBCom.hide();
                gBVil.hide();

                gCProvince.val(response.CProvince.Id);
                gCDistrictId.val(response.CDistrict.Id);
                gCCommuneId.val(response.CCommune.Id);
                gCVillageId.val(response.CVillage.Id);

                gBDis.hide();
                gBCom.hide();
                gBVil.hide();
                modalGaurantor.modal("show");
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
updateGuarantor.click(() => {
    let isValid = validateGuarantor();
    let formData = new FormData();
    let files = gImageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }

    formData.append("Name", gBirthName.val());
    formData.append("NickName", gNickName.val());
    formData.append("National", gNational.val());
    formData.append("Nationality", gNationality.val());
    formData.append("Gender", gGender.val());
    formData.append("DOB", gDOB.val());
    formData.append("Education", gEducation.val());
    formData.append("Phone1", gPhone1.val());
    formData.append("Phone2", gPhone2.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", gNoted.val());
    formData.append("Province", gCProvince.val());
    formData.append("BProvince", gBProvince.val());
    if ((gCDistrict.val() === "-1" && gCCommune.val() === "-1" && gCVillage.val() === "-1") ||
        (gBDistrict.val() === "-1" && gBCommune.val() === "-1" && gBVillage.val() === "-1")) {
        formData.append("District", gCDistrictId.val());
        formData.append("Commune", gCCommuneId.val());
        formData.append("Village", gCVillageId.val());

        formData.append("BDistrict", gBDistrictId.val());
        formData.append("BCommune", gBCommuneId.val());
        formData.append("BVillage", gBVillageId.val());
    } else {
        formData.append("District", gCDistrict.val());
        formData.append("Commune", gCCommune.val());
        formData.append("Village", gCVillage.val());

        formData.append("BDistrict", gBDistrict.val());
        formData.append("BCommune", gBCommune.val());
        formData.append("BVillage", gBVillage.val());
    }

    //for (var pair of formData.entries()) {
    //    console.log(pair[0] + " - " + pair[1]);
    //}

    isValid ? $.ajax({
        url: "/api/hr/gaurantors/put-by-id/" + guarantorId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                guarantor.ajax.reload();
                modalGaurantor.modal("hide");
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
const removeGuarantor = (id) => {
    Swal.fire({
        title: "តើអ្នកប្រាកដដែរឬទេ?",
        text: "ថាចង់លុបទិន្នន័យមួយនេះចេញ !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "យល់ព្រម",
        cancelButtonText: "បោះបង់",
        customClass: { title: 'custom-swal-title' },
    }).then((param) => {
        param.value ? $.ajax({
            method: "DELETE",
            url: "/api/hr/gaurantors/delete-by-id/" + id,
            statusCode: {
                200: (response) => {
                    guarantor.ajax.reload();
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
const clearGuarantor = () => {
    gBDis.hide();
    gBCom.hide();
    gBVil.hide();
    gCDis.hide();
    gCCom.hide();
    gCVil.hide();
    gImageFile.val("");
    gImage.attr("src", "../Images/blank-image.png");
    gBirthName.val("");
    gNickName.val("");
    gNational.val("");
    gNationality.val("");
    gPhone1.val("");
    gPhone2.val("");
    gGender.val("false");
    gEducation.val("-1");
    gDOB.val("");
    gCProvince.val("-1");
    gCDistrict.val("-1");
    gCCommune.val("-1");
    gCVillage.val("-1");
    gNoted.val("");
    gBProvince.val("-1");
    gBDistrict.val("-1");
    gBCommune.val("-1");
    gBVillage.val("-1");
    saveGuarantor.show();
    updateGuarantor.hide();
};

//Set color to border control
const colorGuarantor = () => {
    gBirthName.css("border-color", "#cccccc");
    gNickName.css("border-color", "#cccccc");
    gNational.css("border-color", "#cccccc");
    gNationality.css("border-color", "#cccccc");
    gDOB.css("border-color", "#cccccc");
    gPhone1.css("border-color", "#cccccc");
    gEducation.css("border-color", "#cccccc");
};

//Check validation
const validateGuarantor = () => {
    let isValid = true;
    if (gBirthName.val() === "") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        gBirthName.css("border-color", "red");
        gBirthName.focus();
        isValid = false;
    } else {
        gBirthName.css("border-color", "#cccccc");
        if (gNational.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            gNational.css("border-color", "red");
            gNational.focus();
            isValid = false;
        } else {
            gNational.css("border-color", "#cccccc");
            if (gNationality.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                gNationality.css("border-color", "red");
                gNationality.focus();
                isValid = false;
            } else {
                gNationality.css("border-color", "#cccccc");
                if (gEducation.val() === "-1") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    gEducation.css("border-color", "red");
                    gEducation.focus();
                    isValid = false;
                } else {
                    gEducation.css("border-color", "#cccccc");
                    if (gPhone1.val() === "") {
                        Swal.fire({
                            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        gPhone1.css("border-color", "red");
                        gPhone1.focus();
                        isValid = false;
                    } else {
                        gPhone1.css("border-color", "#cccccc");
                        if (gDOB.val() === "") {
                            Swal.fire({
                                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                icon: "warning",
                                showConfirmButton: false,
                                customClass: { title: 'custom-swal-title' },
                                timer: 1500,
                            });
                            gDOB.css("border-color", "red");
                            gDOB.focus();
                            isValid = false;
                        } else {
                            gDOB.css("border-color", "#cccccc");
                        }
                    }
                }
            }
        }
    }
    return isValid;
};

//==================Place of Birth=====================//
//Change value
gBProvince.change(() => {
    let provinceId = gBProvince.val();
    gBDis.show();

    //   console.log({ BProvince: provinceId });

    if (provinceId !== null) {
        gBDistrict.empty();
        gBCommune.empty();
        gBVillage.empty();
        gBDistrict.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/bDistrict",
            type: "GET",
            data: { BProvince: provinceId },
            dataType: "JSON",
            success: (response) => {
                // console.log(response);
                gBDistrict.empty(); // Clear the please wait
                gBDistrict.append(
                    $("<option>").val("-1").text("---Please Select District---")
                );
                gBCommune.append(
                    $("<option>").val("-1").text("---Please Select Commune---")
                );
                gBVillage.append(
                    $("<option>").val("-1").text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    gBDistrict.append(
                        $("<option>")
                            .val(row.Id)
                            .text(row.NameKh + " / " + row.Name)
                    );
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});

//Change value
gBDistrict.change(() => {
    let districtId = gBDistrict.val();
    gBCom.show();
    //   console.log({ BDistrict: districtId });

    if (districtId !== null) {
        gBCommune.empty();
        gBVillage.empty();
        gBCommune.append($("<option></option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/bCommune",
            type: "GET",
            data: { BDistrict: districtId },
            dataType: "JSON",
            success: (response) => {
                // console.log(response);
                gBCommune.empty(); // Clear the please wait
                gBCommune.append(
                    $("<option>").val("-1").text("---Please Select Commune---")
                );
                gBVillage.append(
                    $("<option>").val("-1").text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    gBCommune.append(
                        $("<option>")
                            .val(row.Id)
                            .text(row.NameKh + " / " + row.Name)
                    );
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});

//Change value
gBCommune.change(() => {
    let communeId = gBCommune.val();
    gBVil.show();
    //   console.log({ BCommune: communeId });

    if (communeId !== null) {
        gBVillage.empty();
        gBVillage.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/bVillage",
            type: "GET",
            data: { BCommune: communeId },
            dataType: "JSON",
            success: (response) => {
                // console.log(response);
                gBVillage.empty(); // Clear the please wait
                gBVillage.append(
                    $("<option>").val("-1").text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    gBVillage.append(
                        $("<option>")
                            .val(row.Id)
                            .html(row.NameKh + " / " + row.Name)
                    );
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});

//==================Current Address=====================//
//Change value
gCProvince.change(() => {
    let provinceId = gCProvince.val();
    gCDis.show();

    //   console.log({ CProvince: provinceId });

    if (provinceId !== null) {
        gCDistrict.empty();
        gCCommune.empty();
        gCVillage.empty();
        gCDistrict.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cDistrict",
            type: "GET",
            data: { CProvince: provinceId },
            dataType: "JSON",
            success: (response) => {
                // console.log(response);
                gCDistrict.empty(); // Clear the please wait
                gCDistrict.append(
                    $("<option>").val("-1").text("---Please Select District---")
                );
                gCCommune.append(
                    $("<option>").val("-1").text("---Please Select Commune---")
                );
                gCVillage.append(
                    $("<option>").val("-1").text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    gCDistrict.append(
                        $("<option>")
                            .val(row.Id)
                            .text(row.NameKh + " / " + row.Name)
                    );
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});

//Change value
gCDistrict.change(() => {
    let districtId = gCDistrict.val();
    gCCom.show();
    //   console.log({ CDistrict: districtId });

    if (districtId !== null) {
        gCCommune.empty();
        gCVillage.empty();
        gCCommune.append($("<option></option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cCommune",
            type: "GET",
            data: { CDistrict: districtId },
            dataType: "JSON",
            success: (response) => {
                // console.log(response);
                gCCommune.empty(); // Clear the please wait
                gCCommune.append(
                    $("<option>").val("-1").text("---Please Select Commune---")
                );
                gCVillage.append(
                    $("<option>").val("-1").text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    gCCommune.append(
                        $("<option>")
                            .val(row.Id)
                            .text(row.NameKh + " / " + row.Name)
                    );
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});

//Change value
gCCommune.change(() => {
    let communeId = gCCommune.val();
    gCVil.show();
    //   console.log({ CCommune: communeId });

    if (communeId !== null) {
        gCVillage.empty();
        gCVillage.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cVillage",
            type: "GET",
            data: { CCommune: communeId },
            dataType: "JSON",
            success: (response) => {
                // console.log(response);
                gCVillage.empty(); // Clear the please wait
                gCVillage.append(
                    $("<option>").val("-1").text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    gCVillage.append(
                        $("<option>")
                            .val(row.Id)
                            .html(row.NameKh + " / " + row.Name)
                    );
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});
