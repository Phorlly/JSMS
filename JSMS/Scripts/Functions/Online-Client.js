jQuery(document).ready(() => {
    loadingGif();
    getClient();
});

//Declare vaariable 
let client = [];
let submitNow = $("#submit-now");
let registerName = $("#register-name");
let company = $("#company");
let gender = $("#gender");
let emailAddress = $("#email-address");
let cPhone1 = $("#c-phone1");
let cPhone2 = $("#c-phone2");
let county = $("#county");
let stateCity = $("#state-city");
let cNoted = $("#c-noted");

//Get data
const getClient = () => {
    client = $("#client").DataTable({
        ajax: {
            url: "/api/hr/online-clients/get",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        // autoWidth: false,
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
                render: row => `${row.Client.Name} (${row.Client.Company})`,
            },
            {
                title: "Gender",
                data: "Client.Sex",
                render: row => row === 2 ? "Male" : row === 1 ? "Female" : "Batmen"
            },
            {
                title: "Telephone",
                data: null,
                render: row => `${row.Client.Phone1} ${row.Client.Phone2}`,
            },
            {
                title: "Address",
                data: null,
                render: row => `${row.Province.Name}, ${row.Country.Name}`,
            },
            {
                title: "Description",
                data: "Client.Noted",
            },
            {
                title: "Status",
                data: "Client.Status",
                render: row => formatStatus(row),
            },
            {
                title: "Created",
                data: "Client.CreatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "Client.UpdatedAt",
                render: row => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "Client.Id",
                render: row => `<div> 
                                     <button onclick= "editClient('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "removeClient('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>      
                                </div>`,
            },
        ],
        buttons: [
            {
                title: "ONLINE CLIENT LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "ONLINE CLIENT LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "ONLINE CLIENT LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "ONLINE CLIENT LIST",
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


//Submit now
submitNow.click(() => {
    let isValid = validateClient();
    let data = {
        Name: registerName.val(),
        Company: company.val(),
        Sex: gender.val(),
        Email: emailAddress.val(),
        Phone1: cPhone1.val(),
        Phone2: cPhone2.val(),
        Country: county.val(),
        Province: stateCity.val(),
        Noted: cNoted.val()
    };

    isValid ? $.ajax({
        url: "/api/hr/online-clients/post",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {
                clearClient();
                setColorClient();
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

//clearClient control
const clearClient = () => {
    registerName.val("");
    company.val("");
    gender.val("-1");
    emailAddress.val("");
    cPhone1.val("");
    cPhone2.val("");
    county.val("-1");
    stateCity.val("-1");
    cNoted.val("");
};

//Set color control
const setColorClient = () => {
    registerName.css("border-color", "#cccccc");
    company.css("border-color", "#cccccc");
    gender.css("border-color", "#cccccc");
    cPhone1.css("border-color", "#cccccc");
    county.css("border-color", "#cccccc");
    stateCity.css("border-color", "#cccccc");
};

//Validation 
const validateClient = () => {
    let isValid = true;
    if (registerName.val() === "") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        registerName.css("border-color", "red");
        registerName.focus();
        isValid = false;
    } else {
        registerName.css("border-color", "#cccccc");
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
            if (gender.val() === "-1") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                gender.css("border-color", "red");
                gender.focus();
                isValid = false;
            } else {
                gender.css("border-color", "#cccccc");
                if (cPhone1.val() === "") {
                    Swal.fire({
                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1500,
                    });
                    cPhone1.css("border-color", "red");
                    cPhone1.focus();
                    isValid = false;
                } else {
                    cPhone1.css("border-color", "#cccccc");
                    if (county.val() === "-1") {
                        Swal.fire({
                            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1500,
                        });
                        county.css("border-color", "red");
                        county.focus();
                        isValid = false;
                    } else {
                        county.css("border-color", "#cccccc");
                        if (stateCity.val() === "-1") {
                            Swal.fire({
                                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                icon: "warning",
                                showConfirmButton: false,
                                customClass: { title: 'custom-swal-title' },
                                timer: 1500,
                            });
                            stateCity.css("border-color", "red");
                            stateCity.focus();
                            isValid = false;
                        } else {
                            stateCity.css("border-color", "#cccccc");
                        }
                    }
                }
            }
        }
    }

    return isValid;
};

//Change value
county.change(() => {
    let countryId = county.val();
    //console.log(countryId)

    countryId ? $.ajax({
        url: "/blog/state",
        type: "GET",
        data: { Country: countryId },
        dataType: "JSON",
        success: (response) => {
            //console.log(response);

            stateCity.empty();
            stateCity.append($("<option>").val("-1").html("Select Province/City"));

            $.each(response, (inex, row) => {
                stateCity.append($("<option>").val(row.Id).text(row.Name));
            });
        },
        error: (hasError) => console.log(hasError),
    }) : stateCity.append($("<option>").val("-1").html("Select Province/City"));
});
