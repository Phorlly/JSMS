
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
            clear();
            Swal.fire({
                title: response.message,
                icon: "success",
                showConfirmButton: false,
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


//Clear control
const clear = () => {
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
