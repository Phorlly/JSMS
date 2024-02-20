
let fileList = [];
const save = $("#save");
const firstName = $("#first-name");
const lastName = $("#last-name");
const phone = $("#phone");
const phone2 = $("#phone2");
const imageFile = $("#image-file");
const image = $("#image");
const sex = $("#sex");
const dob = $("#dob");
const province = $("#province");
const district = $("#district");
const disVal = $("#dis-val");
const commune = $("#commune");
const comVal = $("#com-val");
const village = $("#village");
const vilVal = $("#vil-val");
const noted = $("#noted");


//get file image
const readImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
            image.attr("src", e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

save.click(() => {
    let isValid = validate();
    const formData = new FormData();
    const files = imageFile.get(0).files;
    if (files.length > 0) {
        formData.append("Image", files[0]);
    }
    const otherFiles = fileList;
    if (otherFiles.length > 0) {
        otherFiles.forEach((file) => {
            formData.append('Files[]', file);
        });
    }
    formData.append("FirstName", firstName.val());
    formData.append("LastName", lastName.val());
    formData.append("CreatedBy", "administrator");
    formData.append("DOB", dob.val());
    formData.append("Sex", sex.val());
    formData.append("Phone", phone.val());
    formData.append("Phone2", phone2.val());
    formData.append("Province", province.val());
    formData.append("District", district.val());
    formData.append("Commune", commune.val());
    formData.append("Village", village.val());
    formData.append("Noted", noted.val());

    isValid ? $.ajax({
        url: "/api/hr/job-applicants/create",
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
                customClass: { title: 'custom-swal-title' },
                timer: 1500
            });

        },
        error: (xhr) => xhr.responseJSON && xhr.responseJSON.message ?
            Swal.fire({
                title: xhr.responseJSON.message,
                icon: "error",
            }) : console.log(xhr.responseText),
    }) : false;
});

const clear = () => {
    fileList = [];
    $("#fileList").html('');
    imageFile.val("");
    image.attr("src", "../Images/blank-image.png");
    firstName.val("");
    lastName.val("");
    phone.val("");
    phone2.val("");
    sex.val("false");
    dob.val("");
    province.val("-1");
    district.val("-1");
    commune.val("-1");
    village.val("-1");
    noted.val("");
};

const setDefault = () => {
    firstName.css("border-color", "#cccccc");
    lastName.css("border-color", "#cccccc");
    phone.css("border-color", "#cccccc");
    dob.css("border-color", "#cccccc");
    province.css("border-color", "#cccccc");
    district.css("border-color", "#cccccc");
    commune.css("border-color", "#cccccc");
    village.css("border-color", "#cccccc");
};

//Check validation
const validate = () => {
    let isValid = true;
    if (firstName.val() === "") {
        Swal.fire({
            title: `${lInput} ${lFirstName}`,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1000
        });
        firstName.css("border-color", "red");
        firstName.focus();
        isValid = false;
    } else {
        firstName.css("border-color", "#cccccc");
        if (lastName.val() === "") {
            Swal.fire({
                title: `${lInput} ${lLastName}`,
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1000
            });
            lastName.css("border-color", "red");
            lastName.focus();
            isValid = false;
        } else {
            lastName.css("border-color", "#cccccc");
            if (phone.val() === "") {
                Swal.fire({
                    title: `${lInput} ${lPhone}`,
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1000
                });
                phone.css("border-color", "red");
                phone.focus();
                isValid = false;
            } else {
                phone.css("border-color", "#cccccc");
                if (dob.val() === "") {
                    Swal.fire({
                        title: `${lSelect} ${lDOB}`,
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1000
                    });
                    dob.css("border-color", "red");
                    isValid = false;
                } else {
                    dob.css("border-color", "#cccccc");
                    if (province.val() === "-1") {
                        Swal.fire({
                            title: `${lSelect} ${lProvince}`,
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1000
                        });
                        province.css("border-color", "red");
                        province.focus();
                        isValid = false;
                    } else {
                        province.css("border-color", "#cccccc");
                        //if (district.val() === "-1") {
                        //    Swal.fire({
                        //        title: `${lSelect} ${lDistrict}`,
                        //        icon: "warning",
                        //        showConfirmButton: false,
                        //        customClass: { title: 'custom-swal-title' },
                        //        timer: 1000
                        //    });
                        //    district.css("border-color", "red");
                        //    district.focus();
                        //    isValid = false;
                        //} else {
                        //    district.css("border-color", "#cccccc");
                        //    if (commune.val() === "-1") {
                        //        Swal.fire({
                        //            title: `${lSelect} ${lCommune}`,
                        //            icon: "warning",
                        //            showConfirmButton: false,
                        //            customClass: { title: 'custom-swal-title' },
                        //            timer: 1000
                        //        });
                        //        commune.css("border-color", "red");
                        //        commune.focus();
                        //        isValid = false;
                        //    } else {
                        //        commune.css("border-color", "#cccccc");
                        //        if (village.val() === "-1") {
                        //            Swal.fire({
                        //                title: `${lSelect} ${lVillage}`,
                        //                icon: "warning",
                        //                showConfirmButton: false,
                        //                customClass: { title: 'custom-swal-title' },
                        //                timer: 1000
                        //            });
                        //            village.css("border-color", "red");
                        //            village.focus();
                        //            isValid = false;
                        //        } else {
                        //            village.css("border-color", "#cccccc");
                        //        }
                        //    }
                        //}
                    }
                }
            }
        }
    }

    return isValid;
};

const updateFileList = () => {
    var fileListContainer = document.getElementById('fileList');
    fileListContainer.innerHTML = ''; // Clear previous file list

    fileList.forEach((file, index) => {
        var fileItem = document.createElement('div');
        fileItem.className = 'fileItem';

        var fileName = document.createElement('span');
        fileName.textContent = file.name;
        fileItem.appendChild(fileName);

        var cancelButton = document.createElement('button');
        cancelButton.innerHTML = `<span class="fas fa-times-circle"></span>`; // Add the icon
        cancelButton.addEventListener('click', () => {
            fileList.splice(index, 1); // Remove file from the array
            fileItem.remove(); // Remove file item from the DOM
        });

        fileItem.appendChild(cancelButton);
        fileListContainer.appendChild(fileItem);
    });
}

document.getElementById('dropArea').addEventListener('dragover', event => {
    event.preventDefault();
    this.classList.add('dragover');
});

document.getElementById('dropArea').addEventListener('dragleave', () => {
    this.classList.remove('dragover');
});

document.getElementById('dropArea').addEventListener('drop', event => {
    event.preventDefault();
    this.classList.remove('dragover');

    var files = event.dataTransfer.files;
    Array.from(files).forEach(file => {
        fileList.push(file);
    });

    updateFileList();
});

document.getElementById('dropArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', event => {
    var files = event.target.files;
    Array.from(files).forEach(file => {
        fileList.push(file);
    });

    updateFileList();
});

//Change value
province.change(() => {
    const provinceId = province.val();

    provinceId ? $.ajax({
        url: "/home/district",
        type: "GET",
        data: { province: provinceId },
        dataType: "JSON",
        success: (response) => {
            district.empty();
            commune.empty();
            village.empty();
            district.append($("<option>").val(-1).text(`---${lSelect} ${lDistrict}---`));
            commune.append($("<option>").val(-1).text(`---${lSelect} ${lCommune}---`));
            village.append($("<option>").val(-1).text(`---${lSelect} ${lVillage}---`));

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
    }) : province.append($("<option>").val(-1).text(`---${lSelect} ${lProvince}---`));

});

//Change value
district.change(() => {
    const districtId = district.val();

    districtId ? $.ajax({
        url: "/home/commune",
        type: "GET",
        data: { district: districtId },
        dataType: "JSON",
        success: (response) => {
            commune.empty();
            village.empty();
            commune.append($("<option>").val(-1).text(`---${lSelect} ${lCommune}---`));
            village.append($("<option>").val(-1).text(`---${lSelect} ${lVillage}---`));

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
    }) : district.append($("<option>").val(-1).text(`---${lSelect} ${lDistrict}---`));
});

//Change value
commune.change(() => {
    const communeId = commune.val();

    communeId ? $.ajax({
        url: "/home/village",
        type: "GET",
        data: { commune: communeId },
        dataType: "JSON",
        success: (response) => {
            village.empty();
            village.append($("<option>").val(-1).text(`---${lSelect} ${lVillage}---`));

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
    }) : commune.append($("<option>").val(-1).text(`---${lSelect} ${lCommune}---`));
});
