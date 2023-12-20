jQuery(document).ready(() => {
    loadingGif();
    numberOnly("phone1");
    numberOnly("phone2");
    addNew.show();
    addBevior.hide();
    addGuanrantor.hide();
    dataApplicant.show();
    dataBehavior.hide();
    dataGuarantor.hide();
    titleApplicant.show();
    titleBehavior.hide();
    titleGuarantor.hide();
    $("#show-data-applicant").click(() => getApplicant());
    datePicker("#dob");
});

//Declare variable for use global
let table = [];
let addNew = $("#add-new");
let update = $("#update");
let save = $("#save");
let tabApplicant = $("#tab-applicant");
let tabGuarntor = $("#tab-guarantor");
let tabBehavior = $("#tab-behavior");
let modalApplicant = $("#modal-applicant");
let dataId = $("#data-id");
let imageFile = $("#image-file");
let image = $("#image");
let birthName = $("#birth-name");
let nickName = $("#nick-name");
let national = $("#national");
let nationality = $("#nationality");
let phone1 = $("#phone1");
let phone2 = $("#phone2");
let gender = $("#gender");
let education = $("#education");
let bProvince = $("#birth-province");
let bDistrict = $("#birth-district");
let bCommune = $("#birth-commune");
let bVillage = $("#birth-village");
let createdBy = $("#log-by").data("logby");
let bDistrictId = $("#birth-dis-id");
let bCommuneId = $("#birth-com-id");
let bVillageId = $("#birth-vil-id");

let bDis = $("#birth-dis");
let bCom = $("#birth-com");
let bVil = $("#birth-vil");
let noted = $("#noted");
let cProvince = $("#current-province");
let cDistrict = $("#current-district");
let cCommune = $("#current-commune");
let cVillage = $("#current-village");
let dob = $("#dob");
let cDistrictId = $("#current-dis-id");
let cCommuneId = $("#current-com-id");
let cVillageId = $("#current-vil-id");
let dataApplicant = $("#show-data-applicant");
let dataGuarantor = $("#show-data-guarantor");
let dataBehavior = $("#show-data-behavior");
let titleApplicant = $("#title-applicant");
let titleGuarantor = $("#title-guaranotor");
let titleBehavior = $("#title-behavior");

let cDis = $("#current-dis");
let cCom = $("#current-com");
let cVil = $("#current-vil");


//Get all data of applicant
const getApplicant = () => {
    table = $("#applicant").DataTable({
        ajax: {
            url: "/api/hr/applicants/get",
            dataSrc: "",
            method: "GET",
        },
        //responsive: true,
        // autoWidth: false,
        scrollX: true,
        destroy: true,
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
                //title: "N<sup>o</sup>",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                //title: "Name",
                data: null,
                render: (row) => `${row.Applicant.Name} ${row.Applicant.NickName}`,
            },
            {
                //title: "Gender",
                data: "Applicant.Gender",
                render: (row) => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                //title: "Profile",
                data: "Applicant.Image",
                render: (row) => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle'  width='50px'/>",
            },
            {
                //title: "Education",
                data: "Applicant.Education",
                render: row => formatEducation(row),
            },
            {
                //title: "DOB",
                data: "Applicant.DOB",
                render: row => row ? moment(row).format("DD/MMM/YYYY") : ""
            },
            {
                //title: "Nationality",
                data: "Applicant.Nationality",
            },
            {
                //title: "Telephone",
                data: null,
                render: (row) => `${row.Applicant.Phone1} ${row.Applicant.Phone2}`,
            },
            {
                //title: "Address",
                data: null,
                render: (row) => `${row.CVillage.NameKh},
                                 ​ ${row.CCommune.NameKh},
                                  ${row.CDistrict.NameKh},
                                  ${row.CProvince.NameKh}`,
            },
            {
                //title: "Description",
                data: "Applicant.Noted",
            },
            {
                //title: "Created",
                data: "Applicant.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Updated",
                data: "Applicant.UpdatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                //title: "Actions",
                data: "Applicant.Id",
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
                title: "បញ្ជីបេក្ខជនបានដាក់ពាក្យ",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "បញ្ជីបេក្ខជនបានដាក់ពាក្យ",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "បញ្ជីបេក្ខជនបានដាក់ពាក្យ",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "បញ្ជីបេក្ខជនបានដាក់ពាក្យ",
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
const applicantImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            image.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

//Add new
addNew.click(() => {
    clear();
    setColor();
    modalApplicant.modal("show");
});

//Hide or show button action
tabApplicant.click(() => {
    addNew.show();
    addBevior.hide();
    addGuanrantor.hide();
    dataApplicant.show();
    dataBehavior.hide();
    dataGuarantor.hide();
    titleApplicant.show();
    titleBehavior.hide();
    titleGuarantor.hide();
    location.reload();
});

tabBehavior.click(() => {
    addBevior.show();
    addNew.hide();
    addGuanrantor.hide();
    dataBehavior.show();
    dataApplicant.hide();
    dataGuarantor.hide();
    titleApplicant.hide();
    titleBehavior.show();
    titleGuarantor.hide();
});

tabGuarntor.click(() => {
    addGuanrantor.show();
    addBevior.hide();
    addNew.hide();
    dataGuarantor.show();
    dataBehavior.hide();
    dataApplicant.hide();
    titleApplicant.hide();
    titleBehavior.hide();
    titleGuarantor.show();
});

//Save data
save.click(() => {
    let isValid = validate();

    let formData = new FormData();
    let files = imageFile.get(0).files;

    //Applicant
    if (files.length > 0) {
        formData.append("Image", files[0]);
    }
    formData.append("Name", birthName.val());
    formData.append("NickName", nickName.val());
    formData.append("National", national.val());
    formData.append("Nationality", nationality.val());
    formData.append("Gender", gender.val());
    formData.append("DOB", dob.val());
    formData.append("Education", education.val());
    formData.append("Phone1", phone1.val());
    formData.append("Phone2", phone2.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Province", cProvince.val());
    formData.append("District", cDistrict.val());
    formData.append("Commune", cCommune.val());
    formData.append("Village", cVillage.val());
    formData.append("Noted", noted.val());
    formData.append("BProvince", bProvince.val());
    formData.append("BDistrict", bDistrict.val());
    formData.append("BCommune", bCommune.val());
    formData.append("BVillage", bVillage.val());

    isValid ? $.ajax({
        url: "/api/hr/applicants/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
            dataId.val(response.Id);
            table.ajax.reload();
            clear();
            //modalApplicant.modal("hide");
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
        url: "/api/hr/applicants/get-by-id/" + id,
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: (response) => {
            //console.log(response);
            clear();
            setColor();
            update.show();
            save.hide();

            response.Applicant.Gender === true ? gender.val("true") : gender.val("false");
            dataId.val(response.Applicant.Id);
            birthName.val(response.Applicant.Name);
            nickName.val(response.Applicant.NickName);
            national.val(response.Applicant.National);
            nationality.val(response.Applicant.Nationality);
            phone1.val(response.Applicant.Phone1);
            phone2.val(response.Applicant.Phone2);
            education.val(response.Applicant.Education);
            response.Applicant.Image ? image.attr("src", response.Applicant.Image) : image.attr("src", "../Images/blank-image.png");
            noted.val(response.Applicant.Noted);
            dob.val(formatDate(response.Applicant.DOB));
            bProvince.val(response.BProvince.Id);
            bDistrictId.val(response.BDistrict.Id);
            bCommuneId.val(response.BCommune.Id);
            bVillageId.val(response.BVillage.Id);
            bDis.hide();
            bCom.hide();
            bVil.hide();

            cProvince.val(response.CProvince.Id);
            cDistrictId.val(response.CDistrict.Id);
            cCommuneId.val(response.CCommune.Id);
            cVillageId.val(response.CVillage.Id);
            cDis.hide();
            cCom.hide();
            cVil.hide();

            modalApplicant.modal("show");
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
    let isValid = validate();
    let formData = new FormData();
    let files = imageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }
    formData.append("Name", birthName.val());
    formData.append("NickName", nickName.val());
    formData.append("National", national.val());
    formData.append("Nationality", nationality.val());
    formData.append("Gender", gender.val());
    formData.append("DOB", dob.val());
    formData.append("Education", education.val());
    formData.append("Phone1", phone1.val());
    formData.append("Phone2", phone2.val());
    formData.append("CreatedBy", createdBy);
    formData.append("Noted", noted.val());
    formData.append("BProvince", bProvince.val());
    formData.append("Province", cProvince.val());
    if ((cDistrict.val() === "-1" && cCommune.val() === "-1" && cVillage.val() === "-1") ||
        (bDistrict.val() === "-1" && bCommune.val() === "-1" && bVillage.val() === "-1")) {
        formData.append("District", cDistrictId.val());
        formData.append("Commune", cCommuneId.val());
        formData.append("Village", cVillageId.val());

        formData.append("BDistrict", bDistrictId.val());
        formData.append("BCommune", bCommuneId.val());
        formData.append("BVillage", bVillageId.val());
    } else {
        formData.append("District", cDistrict.val());
        formData.append("Commune", cCommune.val());
        formData.append("Village", cVillage.val());

        formData.append("BDistrict", bDistrict.val());
        formData.append("BCommune", bCommune.val());
        formData.append("BVillage", bVillage.val());
    }

    isValid ? $.ajax({
        url: "/api/hr/applicants/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
            table.ajax.reload();
            modalApplicant.modal("hide");
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
        param.value ?
            $.ajax({
                method: "DELETE",
                url: "/api/hr/applicants/delete-by-id/" + id,
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
    bDis.show();
    bCom.show();
    bVil.show();
    cDis.show();
    cCom.show();
    cVil.show();
    imageFile.val("");
    image.attr("src", "../Images/blank-image.png");
    birthName.val("");
    nickName.val("");
    national.val("");
    nationality.val("");
    phone1.val("");
    phone2.val("");
    gender.val("false");
    education.val("-1");
    dob.val("");
    cProvince.val("-1");
    cDistrict.val("-1");
    cCommune.val("-1");
    cVillage.val("-1");
    noted.val("");
    bProvince.val("-1");
    bDistrict.val("-1");
    bCommune.val("-1");
    bVillage.val("-1");
};

//Set color to border control
const setColor = () => {
    birthName.css("border-color", "#cccccc");
    nickName.css("border-color", "#cccccc");
    national.css("border-color", "#cccccc");
    nationality.css("border-color", "#cccccc");
    dob.css("border-color", "#cccccc");
    phone1.css("border-color", "#cccccc");
    education.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (birthName.val() === "") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        birthName.css("border-color", "red");
        birthName.focus();
        isValid = false;
    } else {
        birthName.css("border-color", "#cccccc");
        if (national.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            national.css("border-color", "red");
            national.focus();
            isValid = false;
        } else {
            national.css("border-color", "#cccccc");
            if (nationality.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                nationality.css("border-color", "red");
                nationality.focus();
                isValid = false;
            } else {
                nationality.css("border-color", "#cccccc");
                if (education.val() === "-1") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    education.css("border-color", "red");
                    education.focus();
                    isValid = false;
                } else {
                    education.css("border-color", "#cccccc");
                    if (phone1.val() === "") {
                        Swal.fire({
                            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
                        if (dob.val() === "") {
                            Swal.fire({
                                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                icon: "warning",
                                showConfirmButton: false,
                                customClass: { title: 'custom-swal-title' },
                                timer: 1500,
                            });
                            dob.css("border-color", "red");
                            dob.focus();
                            isValid = false;
                        } else {
                            dob.css("border-color", "#cccccc");
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
bProvince.change(() => {
    let provinceId = bProvince.val();
    bDis.show();

    //console.log({ BProvince: provinceId });

    if (provinceId !== null) {
        bDistrict.empty();
        bCommune.empty();
        bVillage.empty();
        bDistrict.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/bDistrict",
            type: "GET",
            data: { BProvince: provinceId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                bDistrict.empty(); // Clear the please wait
                bDistrict.append(
                    $("<option>").val(-1).text("---Please Select District---")
                );
                bCommune.append(
                    $("<option>").val(-1).text("---Please Select Commune---")
                );
                bVillage.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    bDistrict.append(
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
bDistrict.change(() => {
    let districtId = bDistrict.val();
    bCom.show();
    //console.log({ BDistrict: districtId });

    if (districtId !== null) {
        bCommune.empty();
        bVillage.empty();
        bCommune.append($("<option></option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/bCommune",
            type: "GET",
            data: { BDistrict: districtId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                bCommune.empty(); // Clear the please wait
                bCommune.append(
                    $("<option>").val(-1).text("---Please Select Commune---")
                );
                bVillage.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    bCommune.append(
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
bCommune.change(() => {
    let communeId = bCommune.val();
    bVil.show();
    //console.log({ BCommune: communeId });

    if (communeId !== null) {
        bVillage.empty();
        bVillage.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/bVillage",
            type: "GET",
            data: { BCommune: communeId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                bVillage.empty(); // Clear the please wait
                bVillage.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    bVillage.append(
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
cProvince.change(() => {
    let provinceId = cProvince.val();
    cDis.show();

    //console.log({ CProvince: provinceId });

    if (provinceId !== null) {
        cDistrict.empty();
        cCommune.empty();
        cVillage.empty();
        cDistrict.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cDistrict",
            type: "GET",
            data: { CProvince: provinceId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                cDistrict.empty(); // Clear the please wait
                cDistrict.append(
                    $("<option>").val(-1).text("---Please Select District---")
                );
                cCommune.append(
                    $("<option>").val(-1).text("---Please Select Commune---")
                );
                cVillage.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    cDistrict.append(
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
cDistrict.change(() => {
    let districtId = cDistrict.val();
    cCom.show();
    //console.log({ CDistrict: districtId });

    if (districtId !== null) {
        cCommune.empty();
        cVillage.empty();
        cCommune.append($("<option></option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cCommune",
            type: "GET",
            data: { CDistrict: districtId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                cCommune.empty(); // Clear the please wait
                cCommune.append(
                    $("<option>").val(-1).text("---Please Select Commune---")
                );
                cVillage.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

                $.each(response, (inex, row) => {
                    cCommune.append($("<option>").val(row.Id).text(row.NameKh + " / " + row.Name));
                });
            },
            error: (hasError) => console.log(hasError),
        });
    }
});

//Change value
cCommune.change(() => {
    let communeId = cCommune.val();
    cVil.show();
    //console.log({ CCommune: communeId });

    if (communeId !== null) {
        cVillage.empty();
        cVillage.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cVillage",
            type: "GET",
            data: { CCommune: communeId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                cVillage.empty(); // Clear the please wait
                cVillage.append($("<option>").val(-1).text("---Please Select Village---"));
                $.each(response, (inex, row) => {
                    cVillage.append($("<option>").val(row.Id).html(row.NameKh + " / " + row.Name));
                });
            },
            error: (hasError) => {
                console.log(hasError);
            },
        });
    }
});
