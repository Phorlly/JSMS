jQuery(document).ready(() => {
    loadingGif();
    getApplicant();
});

//Declare variable 
let applicant = [];
let applyNow = $("#apply-now");
let refresh = $("#refresh");
let nameIn = $("#name-in-certificate");
let nickName = $("#nick-name");
let sex = $("#sex");
let national = $("#national");
let nationality = $("#nationality");
let phone1 = $("#phone1");
let phone2 = $("#phone2");
let education = $("#education");
let pob = $("#place-of-birth");
let dob = $("#date-of-birth");
let address = $("#address");
let position = $("#position");
let attachment = $("#attachment");
let noted = $("#noted");

//Get data
const getApplicant = () => {
    applicant = $("#applicant").DataTable({
        ajax: {
            url: "/api/hr/online-applicants/get",
            dataSrc: "",
            method: "GET",
        },
        //responsive: true,
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
                title: "N<sup>o</sup>",
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                title: "Name",
                data: null,
                render: (row) => `${row.Applicant.Name} ${row.Applicant.NickName}`,
            },
            {
                title: "Gender",
                data: "Applicant.Sex",
                render: (row) => row === 2 ? "Male" : row === 1 ? "Female" : "Batman",
            },
            {
                title: "Education",
                data: "Applicant.Education",
                render: row => formatEducation(row),
            },
            {
                title: "Position",
                data: "Applicant.Position",
                render: row => row === 1 ? "IT" : row === 2 ? "HR" : "Guard",
            },
            {
                title: "DOB",
                data: "Applicant.DOB",
                render: (row) => row ? moment(row).format("YYYY") : ""
            },
            {
                title: "Nationality",
                data: null,
                render: (row) => `${row.Applicant.National}`,
            },
            {
                title: "Telphone",
                data: null,
                render: (row) => `${row.Applicant.Phone1} ${row.Applicant.Phone2}`,
            },
            {
                title: "Address",
                data: "Address.NameKh",
            },
            {
                title: "Attachment",
                data: "Applicant.Attachment",
                render: (row) => {
                    if (row === null) {
                        return "";
                    } else {
                        let fileInfo = readFile(row);
                        return `<a href="${fileInfo.url}" target="_blank">${fileInfo.name}</a>`;
                    }
                },
            },
            {
                title: "Description",
                data: "Applicant.Noted",
            },
            {
                title: "Status",
                data: "Applicant.Status",
                render: row => formatStatus(row),
            },
            {
                title: "Created",
                data: "Applicant.CreatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Updated",
                data: "Applicant.UpdatedAt",
                render: (row) => row ? moment(row).fromNow() : "",
            },
            {
                title: "Actions",
                data: "Applicant.Id",
                render: (row) => `<div> 
                                      <button onclick= "editApplicant('${row}')" class= 'btn btn-warning btn-sm' >
                                          <span class='fas fa-edit'></span>
                                      </button>
                                      <button onclick= "removeApplicant('${row}')" class= 'btn btn-danger btn-sm' >
                                          <span class='fas fa-trash-alt'></span>
                                      </button>
                                  </div>`,
            },
        ],
        buttons: [
            {
                title: "ONLINE APPLICANT LIST",
                extend: "excelHtml5",
                text: "<i class='fa fa-file-excel'> </i> Excel",
                className: "btn btn-success btn-sm mt-2",
            },
            {
                title: "ONLINE APPLICANT LIST",
                extend: "print",
                text: "<i class='fa fa-print'> </i> Print",
                className: "btn btn-dark btn-sm mt-2",
            },
            {
                title: "ONLINE APPLICANT LIST",
                extend: "copy",
                text: "<i class='fa fa-copy'> </i> Copy Text",
                className: "btn btn-info btn-sm mt-2",
            },
            {
                title: "ONLINE APPLICANT LIST",
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

//Reload data
refresh.click(() => location.reload());

//Apply now 
applyNow.click(() => {
    let isValid = validate();
    let formData = new FormData();
    let files = attachment.get(0).files;

    if (files.length > 0) {
        formData.append("Attachment", files[0]);
    }
    formData.append("Name", nameIn.val());
    formData.append("NickName", nickName.val());
    formData.append("National", national.val());
    formData.append("Nationality", nationality.val());
    formData.append("Sex", sex.val());
    formData.append("DOB", dob.val());
    formData.append("Education", education.val());
    formData.append("Phone1", phone1.val());
    formData.append("Phone2", phone2.val());
    formData.append("Position", position.val());
    formData.append("Noted", noted.val());
    formData.append("POB", pob.val());
    formData.append("Address", address.val());

    isValid ? $.ajax({
        url: "/api/hr/online-applicants/post",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        statusCode: {
            200: (response) => {
                setColor();
                clear();
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

//Edit data by id
const editApplicant = async (id) => {
    let { value: data } = await Swal.fire({
        title: "Update Status",
        html: `<select class="form-select" id="status">
                    <option value="0">Pending</option>
                    <option value="1">Loading</option>
                    <option value="2">Approved</option>
              </select> `,
        focusConfirm: false,
        preConfirm: () => {
            return $("#status").val();
        }
    });
    data ? Swal.fire(JSON.stringify(data)) : "";

};

//Remove data by id
const removeApplicant = (id) => {
    alert(id)
};

//Clear control
const clear = () => {
    nameIn.val("");
    nickName.val("");
    sex.val("");
    national.val("");
    nationality.val("");
    phone1.val("");
    phone2.val("");
    education.val("-1");
    pob.val("-1");
    dob.val("");
    address.val("-1");
    position.val("-1");
    attachment.val("");
    noted.val("");
};

//Set Color
const setColor = () => {
    nameIn.css("border-color", "#cccccc");
    nickName.css("border-color", "#cccccc");
    sex.css("border-color", "#cccccc");
    national.css("border-color", "#cccccc");
    nationality.css("border-color", "#cccccc");
    phone1.css("border-color", "#cccccc");
    education.css("border-color", "#cccccc");
    pob.css("border-color", "#cccccc");
    dob.css("border-color", "#cccccc");
    address.css("border-color", "#cccccc");
    position.css("border-color", "#cccccc");
    attachment.css("border-color", "#cccccc");
};

//Validation 
const validate = () => {
    let isValid = true;
    if (nameIn.val() === "") {
        Swal.fire({
            title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        nameIn.css("border-color", "red");
        nameIn.focus();
        isValid = false;
    } else {
        nameIn.css("border-color", "#cccccc");
        if (nickName.val() === "") {
            Swal.fire({
                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            nickName.css("border-color", "red");
            nickName.focus();
            isValid = false;
        } else {
            nickName.css("border-color", "#cccccc");
            if (sex.val() === "-1") {
                Swal.fire({
                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1500,
                });
                sex.css("border-color", "red");
                sex.focus();
                isValid = false;
            } else {
                sex.css("border-color", "#cccccc");
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
                                if (pob.val() === "-1") {
                                    Swal.fire({
                                        title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                        icon: "warning",
                                        showConfirmButton: false,
                                        customClass: { title: 'custom-swal-title' },
                                        timer: 1500,
                                    });
                                    pob.css("border-color", "red");
                                    pob.focus();
                                    isValid = false;
                                } else {
                                    pob.css("border-color", "#cccccc");
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
                                        if (address.val() === "-1") {
                                            Swal.fire({
                                                title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                                icon: "warning",
                                                showConfirmButton: false,
                                                customClass: { title: 'custom-swal-title' },
                                                timer: 1500,
                                            });
                                            address.css("border-color", "red");
                                            address.focus();
                                            isValid = false;
                                        } else {
                                            address.css("border-color", "#cccccc");
                                            if (attachment.val() === "") {
                                                Swal.fire({
                                                    title: "នៅត្រង់កន្លែងនេះមិនអាចគ្មានទិន្នន័យបានទេ 😲",
                                                    icon: "warning",
                                                    showConfirmButton: false,
                                                    customClass: { title: 'custom-swal-title' },
                                                    timer: 1500,
                                                });
                                                attachment.css("border-color", "red");
                                                attachment.focus();
                                                isValid = false;
                                            } else {
                                                attachment.css("border-color", "#cccccc");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return isValid;
};

