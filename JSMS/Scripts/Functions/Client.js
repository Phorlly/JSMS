jQuery(document).ready(() => {
    loadingGif();
    getAll();
    numberOnly("phone1");
    numberOnly("phone2");
});

//Declare variable for use global
let table = [];
let addNew = $("#add-new");
let update = $("#update");
let save = $("#save");
let modalClient = $("#modal-client");
let dataId = $("#data-id");
let refresh = $("#refresh");
let imageFile = $("#imageFile");
let image = $("#image");
let ownername = $("#ownername");
let company = $("#company");
let gdtreg = $("#gdtreg");
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
let dis = $("#dis");
let com = $("#com");
let vil = $("#vil");

//Get all data
const getAll = () => {
    table = $("#client").DataTable({
        ajax: {
            url: "/api/hr/clients/get",
            dataSrc: "",
            method: "GET",
        },
        // responsive: true,
        // autoWidth: false,
        scrollX: true,
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
                title: "#",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                title: "Name",
                data: "Client.Name",
            },
            {
                title: "Gender",
                data: "Client.Gender",
                render: (row) => row === true ? "ប្រុស" : "ស្រី",
            },
            {
                title: "Position",
                data: "Client.Position",
                render: row => row ? formatPosition(row) : "",
            },
            {
                title: "Company",
                data: "Client.Company",
            },
            {
                title: "Profile",
                data: "Client.Image",
                render: row => row ? `<img src="${row}" class='rounded-circle' width='50px'/>` :
                    "<img src='../Images/blank-image.png' class='rounded-circle' width='50px'/>",
            },
            {
                title: "DOB",
                data: "Client.DOB",
                render: (row) => row ? moment(row).format("DD/MMM/YYYY") : "",
            },
            {
                title: "GDTREG",
                data: "Client.GDTREG",
            },
            {
                title: "VATTIN",
                data: "Client.VATTIN",
            },
            {
                title: "Telephone",
                data: null,
                render: (row) => `${row.Client.Phone1} ${row.Client.Phone2}`,
            },
            {
                title: "Address",
                data: null,
                render: (row) => `${row.Village.NameKh},
                                  ${row.Commune.NameKh},
                                  ${row.District.NameKh},
                                  ${row.Province.NameKh}`,
            },
            {
                title: "Description",
                data: "Client.Noted",
            },
            {
                title: "Created",
                data: "Client.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "Client.UpdatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "Client.Id",
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
                title: "CLIENT LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "CLIENT LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "CLIENT LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "CLIENT LIST",
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
refresh.click(() => location.reload());

//Add new
addNew.click(() => {
    clear();
    setColor();
    dis.hide();
    com.hide();
    vil.hide();
    modalClient.modal("show");
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
    formData.append("GDTREG", gdtreg.val());
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
        url: "/api/hr/clients/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                dataId.val(response.Id);
                table.ajax.reload();
                clear();
                //modalClient.modal("hide");
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
const edit = (id) => {
    $.ajax({
        url: "/api/hr/clients/get-by-id/" + id,
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

                dataId.val(response.Client.Id);
                ownername.val(response.Client.Name);
                company.val(response.Client.Company);
                gdtreg.val(response.Client.GDTREG);
                vattin.val(response.Client.VATTIN);
                response.Client.Gender === true ? gender.val("true") : gender.val("false");
                phone1.val(response.Client.Phone1);
                phone2.val(response.Client.Phone2);
                position.val(response.Client.Position);
                response.Client.Image ? image.attr("src", response.Client.Image) : image.attr("src", "../Images/blank-image.png");
                noted.val(response.Client.Noted);
                dob.val(formatDate(response.Client.DOB));
                province.val(response.Province.Id);
                districtId.val(response.District.Id);
                communeId.val(response.Commune.Id);
                villageId.val(response.Village.Id);

                dis.hide();
                com.hide();
                vil.hide();
                modalClient.modal("show");
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
    let formData = new FormData();
    let files = imageFile.get(0).files;

    if (files.length > 0) {
        formData.append("Image", files[0]);
    }

    formData.append("Name", ownername.val());
    formData.append("Company", company.val());
    formData.append("GDTREG", gdtreg.val());
    formData.append("VATTIN", vattin.val());
    formData.append("Gender", gender.val());
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
        url: "/api/hr/clients/put-by-id/" + dataId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                table.ajax.reload();
                clear();
                modalClient.modal("hide");
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
        param.value ? $.ajax({
            method: "DELETE",
            url: "/api/hr/clients/delete-by-id/" + id,
            statusCode: {
                200: (response) => {
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
    imageFile.val("");
    image.attr("src", "../Images/blank-image.png");
    ownername.val("");
    company.val("");
    gdtreg.val("");
    vattin.val("");
    phone1.val("");
    phone2.val("");
    gender.val("true");
    position.val(-1);
    dob.val("");
    noted.val("");
    province.val(-1);
    district.val(-1);
    commune.val(-1);
    village.val(-1);
};

//Set color to border control
const setColor = () => {
    ownername.css("border-color", "#cccccc");
    company.css("border-color", "#cccccc");
    gdtreg.css("border-color", "#cccccc");
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
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
            if (gdtreg.val() === "") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                gdtreg.css("border-color", "red");
                gdtreg.focus();
                isValid = false;
            } else {
                gdtreg.css("border-color", "#cccccc");
                if (vattin.val() === "") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
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
    }
    return isValid;
};

//Change value
province.change(() => {
    let provinceId = province.val();
    dis.show();

    //console.log({ CProvince: provinceId });

    if (provinceId !== null) {
        district.empty();
        commune.empty();
        village.empty();
        district.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cDistrict",
            type: "GET",
            data: { CProvince: provinceId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                district.empty(); // Clear the please wait
                district.append(
                    $("<option>").val(-1).text("---Please Select District---")
                );
                commune.append(
                    $("<option>").val(-1).text("---Please Select Commune---")
                );
                village.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

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
        });
    }
});

//Change value
district.change(() => {
    let districtId = district.val();
    com.show();
    //console.log({ CDistrict: districtId });

    if (districtId !== null) {
        commune.empty();
        village.empty();
        commune.append($("<option></option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cCommune",
            type: "GET",
            data: { CDistrict: districtId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                commune.empty(); // Clear the please wait
                commune.append(
                    $("<option>").val(-1).text("---Please Select Commune---")
                );
                village.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

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
        });
    }
});

//Change value
commune.change(() => {
    let communeId = commune.val();
    vil.show();
    //console.log({ CCommune: communeId });

    if (communeId !== null) {
        village.empty();
        village.append($("<option>").val("").html("Please wait ..."));

        $.ajax({
            url: "/home/cVillage",
            type: "GET",
            data: { CCommune: communeId },
            dataType: "JSON",
            success: (response) => {
                //console.log(response);
                village.empty(); // Clear the please wait
                village.append(
                    $("<option>").val(-1).text("---Please Select Village---")
                );

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
        });
    }
});
