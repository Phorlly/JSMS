jQuery(document).ready(() => {
    loadingGif()
    $("#show").click(() => reads())
})

let tables = []
let fileList = []
const modalDialog = $("#modal-job-applicant")
const dataId = $("#data-id")
const update = $("#update")
const save = $("#save")
const firstName = $("#first-name")
const lastName = $("#last-name")
const phone = $("#phone")
const phone2 = $("#phone2")
const imageFile = $("#image-file")
const image = $("#image")
const sex = $("#sex")
const dob = $("#dob")
//const setStatus = $("#status")
const province = $("#province")
const district = $("#district")
const disVal = $("#dis-val")
const commune = $("#commune")
const comVal = $("#com-val")
const village = $("#village")
const vilVal = $("#vil-val")
const noted = $("#noted")
const createdBy = $("#log-by").data("logby")

$("#add").click(() => {
    clear()
    setDefault()
    modalDialog.modal("toggle")
})

//get file image
const readImage = (input) => {
    if (input.files && input.files[0]) {
        var reader = new FileReader()
        reader.onload = (e) => {
            image.attr("src", e.target.result)
        }
        reader.readAsDataURL(input.files[0])
    }
}

const reads = () => {
    tables = $(".table").DataTable({
        ajax: {
            url: "/api/hr/job-applicants/reads",
            dataSrc: "",
            method: "GET",
        },
        responsive: true,
        destroy: true,
        // autoWidth: false,
        scrollX: true,
        //dom: "Bfrtip",
        language: {
            paginate: {
                previous: "<i class='fas fa-chevron-left'>",
                next: "<i class='fas fa-chevron-right'>",
            },
        },
        columns: [
            {
                data: null,
                render: (data, type, row, meta) => `${meta.row + 1}`,
            },
            {
                data: "applicant.FullName",
            },
            {
                data: "applicant.Sex",
                render: (row) => row === true ? lMale : lFemale,
            },
            {
                data: "applicant.Image",
                render: (row) => {
                    const file = row ? row : "../Images/blank-image.png"
                    return `<img src="${file}" class='rounded-circle' width='50px' height="50px"/>`
                },
            },
            {
                data: null,
                render: (row) => combineName(row.applicant.Phone, row.applicant.Phone2),
            },
            {
                data: "applicant.DOB",
                render: row => row ? convertToKhmerDate(row) : "",
            },
            {
                data: null,
                render: (row) => `${row.village.NameKh}
                                 ​ ${row.commune.NameKh}
                                  ${row.district.NameKh}
                                  ${row.province.NameKh}`,
            },
            {
                data: "applicant.Status",
                render: row => formatStatus(row),
            },
            {
                data: "applicant.Attachments",
                render: row => {
                    if (row === null || row === undefined) {
                        return ""
                    } else {
                        let fileInfoArray = readFiles(row) // Get array of file objects
                        let fileLinks = fileInfoArray.map(fileInfo => `<a href="${fileInfo.url}" target="_blank">${fileInfo.name}</a>`) // Map each file object to HTML string
                        return fileLinks.join('<br>') // Join HTML strings with comma separator
                    }
                },
            },
            {
                data: "applicant.Noted",
            },
            {
                data: "applicant.Id",
                render: row => {
                    return `<div> 
                                <button onclick= "read('${row}')" class= 'btn btn-warning btn-sm' >
                                    <span class='fas fa-edit'></span>
                                </button>
                                <button onclick= "remove('${row}')" class= 'btn btn-danger btn-sm' >
                                    <span class='fas fa-trash-alt'></span>
                                </button>
                            </div>`
                },
            },
        ],
    })
}

save.click(() => {
    let isValid = validate()
    const formData = new FormData()
    const files = imageFile.get(0).files
    if (files.length > 0) {
        formData.append("Image", files[0])
    }
    const otherFiles = fileList
    if (otherFiles.length > 0) {
        otherFiles.forEach((file) => {
            formData.append('Files[]', file)
        })
    }
    formData.append("FirstName", firstName.val())
    formData.append("LastName", lastName.val())
    formData.append("CreatedBy", createdBy)
    formData.append("DOB", dob.val())
    formData.append("Sex", sex.val())
    // formData.append("Status", setStatus.val())
    formData.append("Phone", phone.val())
    formData.append("Phone2", phone2.val())
    formData.append("Province", province.val())
    formData.append("District", district.val())
    formData.append("Commune", commune.val())
    formData.append("Village", village.val())
    formData.append("Noted", noted.val())

    isValid ? $.ajax({
        url: "/api/hr/job-applicants/create",
        type: "POST",
        contentType: false,
        processData: false,
        data: formData,
        success: (res) => {
            reads()
            dataId.val(res.Id)
            tables.ajax.reload()
            clear()
            //modalDialog.modal("hide")

            Swal.fire({
                title: res.message,
                icon: "success",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500
            })

        },
        error: (xhr) => xhr.resJSON && xhr.resJSON.message ?
            Swal.fire({
                title: xhr.resJSON.message,
                icon: "error",
            }) : console.log(xhr.resText),
    }) : false
})

const read = (id) => {
    crud({
        url: `job-applicants/read/${id}`,
        method: "GET",
        whenComplete: (res) => {
            clear()
            setDefault()
            update.show()
            save.hide()

            sex.val(res.applicant.Sex === true ? "true" : "false")
            dataId.val(res.applicant.Id)
            firstName.val(res.applicant.FirstName)
            lastName.val(res.applicant.LastName)
            /*setStatus.val(res.applicant.Status)*/
            phone.val(res.applicant.Phone)
            phone2.val(res.applicant.Phone2)
            res.applicant.Image ? image.attr("src", res.applicant.Image) : image.attr("src", "../Images/blank-image.png")
            noted.val(res.applicant.Noted)
            dob.val(formatDate(res.applicant.DOB))
            province.val(res.province.Id)
            disVal.val(res.district.Id)
            comVal.val(res.commune.Id)
            vilVal.val(res.village.Id)
            $("#fileList").html(res.applicant.Attachments ? showFiles(res.applicant.Attachments) : "")

            modalDialog.modal("toggle")
        }
    })
}

update.click(() => {
    let isValid = validate()
    const formData = new FormData()
    const files = imageFile.get(0).files
    if (files.length > 0) {
        formData.append("Image", files[0])
    }
    const fileUrls = document.getElementById("fileInput").files
    if (fileUrls.length > 0) {
        Array.from(fileUrls).forEach((file) => {
            formData.append("Files[]", file)
        })
    }
    formData.append("FirstName", firstName.val())
    formData.append("LastName", lastName.val())
    formData.append("CreatedBy", createdBy)
    formData.append("DOB", dob.val())
    formData.append("Sex", sex.val())
    // formData.append("Status", setStatus.val())
    formData.append("Phone", phone.val())
    formData.append("Phone2", phone2.val())
    formData.append("Province", province.val())
    if (district.val() === "-1" && commune.val() === "-1" && village.val() === "-1") {
        formData.append("District", disVal.val())
        formData.append("Commune", comVal.val())
        formData.append("Village", vilVal.val())
    } else {
        formData.append("District", district.val())
        formData.append("Commune", commune.val())
        formData.append("Village", village.val())
    }
    formData.append("Noted", noted.val())

    isValid ? $.ajax({
        url: "/api/hr/job-applicants/update/" + dataId.val(),
        type: "PUT",
        contentType: false,
        processData: false,
        data: formData,
        success: (res) => {
            reads()
            dataId.val(res.Id)
            tables.ajax.reload()
            clear()
            modalDialog.modal("toggle")

            Swal.fire({
                title: res.message,
                icon: "success",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1500
            })

        },
        error: (xhr) => xhr.resJSON && xhr.resJSON.message ?
            Swal.fire({
                title: xhr.resJSON.message,
                icon: "error",
            }) : alert(xhr.resText),
    }) : false
})

const remove = (id) => {
    Swal.fire({
        title: lAreYouSure,
        text: lToDelete,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `<i class='fas fa-times-circle'></i> <span>${lCancel}</span>`,
        confirmButtonText: `<i class='fas fa-trash'></i> <span>${lOK}</span>`,
    }).then((param) => {
        param.value ? $.ajax({
            method: "DELETE",
            url: "/api/hr/job-applicants/delete/" + id,
            success: (res) => {
                tables.ajax.reload()
                Swal.fire({
                    title: res.message,
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500
                })
            },
            error: (xhr) => xhr.resJSON && xhr.resJSON.message ?
                Swal.fire({
                    title: xhr.resJSON.message,
                    icon: "error",
                    showConfirmButton: true,
                    //timer: 1500
                }) : console.log(xhr.resText),
        }) : param.dismiss === Swal.DismissReason.cancel &&
        Swal.fire({
            title: lTheSame,
            icon: "error",
            showConfirmButton: false,
            timer: 1500
        })
    }).catch((err) => console.log(err.message))
}

const clear = () => {
    save.show()
    update.hide()
    fileList = []
    $("#fileList").html('')
    imageFile.val("")
    image.attr("src", "../Images/blank-image.png")
    firstName.val("")
    lastName.val("")
    //setStatus.val("1")
    phone.val("")
    phone2.val("")
    sex.val("false")
    dob.val("")
    province.val("-1")
    district.val("-1")
    commune.val("-1")
    village.val("-1")
    noted.val("")
}

const setDefault = () => {
    firstName.css("border-color", "#cccccc")
    lastName.css("border-color", "#cccccc")
    phone.css("border-color", "#cccccc")
    dob.css("border-color", "#cccccc")
    province.css("border-color", "#cccccc")
    district.css("border-color", "#cccccc")
    commune.css("border-color", "#cccccc")
    village.css("border-color", "#cccccc")
}

//Check validation
const validate = () => {
    let isValid = true
    if (firstName.val() === "") {
        Swal.fire({
            title: `${lInput} ${lFirstName}`,
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1000
        })
        firstName.css("border-color", "red")
        firstName.focus()
        isValid = false
    } else {
        firstName.css("border-color", "#cccccc")
        if (lastName.val() === "") {
            Swal.fire({
                title: `${lInput} ${lLastName}`,
                icon: "warning",
                showConfirmButton: false,
                customClass: { title: 'custom-swal-title' },
                timer: 1000
            })
            lastName.css("border-color", "red")
            lastName.focus()
            isValid = false
        } else {
            lastName.css("border-color", "#cccccc")
            if (phone.val() === "") {
                Swal.fire({
                    title: `${lInput} ${lPhone}`,
                    icon: "warning",
                    showConfirmButton: false,
                    customClass: { title: 'custom-swal-title' },
                    timer: 1000
                })
                phone.css("border-color", "red")
                phone.focus()
                isValid = false
            } else {
                phone.css("border-color", "#cccccc")
                if (dob.val() === "") {
                    Swal.fire({
                        title: `${lSelect} ${lDOB}`,
                        icon: "warning",
                        showConfirmButton: false,
                        customClass: { title: 'custom-swal-title' },
                        timer: 1000
                    })
                    dob.css("border-color", "red")
                    isValid = false
                } else {
                    dob.css("border-color", "#cccccc")
                    if (province.val() === "-1") {
                        Swal.fire({
                            title: `${lSelect} ${lProvince}`,
                            icon: "warning",
                            showConfirmButton: false,
                            customClass: { title: 'custom-swal-title' },
                            timer: 1000
                        })
                        province.css("border-color", "red")
                        province.focus()
                        isValid = false
                    } else {
                        province.css("border-color", "#cccccc")
                        //if (district.val() === "-1") {
                        //    Swal.fire({
                        //        title: `${lSelect} ${lDistrict}`,
                        //        icon: "warning",
                        //        showConfirmButton: false,
                        //        customClass: { title: 'custom-swal-title' },
                        //        timer: 1000
                        //    })
                        //    district.css("border-color", "red")
                        //    district.focus()
                        //    isValid = false
                        //} else {
                        //    district.css("border-color", "#cccccc")
                        //    if (commune.val() === "-1") {
                        //        Swal.fire({
                        //            title: `${lSelect} ${lCommune}`,
                        //            icon: "warning",
                        //            showConfirmButton: false,
                        //            customClass: { title: 'custom-swal-title' },
                        //            timer: 1000
                        //        })
                        //        commune.css("border-color", "red")
                        //        commune.focus()
                        //        isValid = false
                        //    } else {
                        //        commune.css("border-color", "#cccccc")
                        //        if (village.val() === "-1") {
                        //            Swal.fire({
                        //                title: `${lSelect} ${lVillage}`,
                        //                icon: "warning",
                        //                showConfirmButton: false,
                        //                customClass: { title: 'custom-swal-title' },
                        //                timer: 1000
                        //            })
                        //            village.css("border-color", "red")
                        //            village.focus()
                        //            isValid = false
                        //        } else {
                        //            village.css("border-color", "#cccccc")
                        //        }
                        //    }
                        //}
                    }
                }
            }
        }
    }

    return isValid
}


const updateFileList = () => {
    var fileListContainer = document.getElementById('fileList')
    fileListContainer.innerHTML = '' // Clear previous file list

    fileList.forEach((file, index) => {
        var fileItem = document.createElement('div')
        fileItem.className = 'fileItem'

        var fileName = document.createElement('span')
        fileName.textContent = file.name
        fileItem.appendChild(fileName)

        var cancelButton = document.createElement('button')
        cancelButton.innerHTML = `<span class="fas fa-times-circle"></span>` // Add the icon
        cancelButton.addEventListener('click', () => {
            fileList.splice(index, 1) // Remove file from the array
            fileItem.remove() // Remove file item from the DOM
        })

        fileItem.appendChild(cancelButton)
        fileListContainer.appendChild(fileItem)
    })
}

document.getElementById('dropArea').addEventListener('dragover', event => {
    event.preventDefault()
    this.classList.add('dragover')
})

document.getElementById('dropArea').addEventListener('dragleave', () => {
    this.classList.remove('dragover')
})

document.getElementById('dropArea').addEventListener('drop', event => {
    event.preventDefault()
    this.classList.remove('dragover')

    var files = event.dataTransfer.files
    Array.from(files).forEach(file => {
        fileList.push(file)
    })

    updateFileList()
})

document.getElementById('dropArea').addEventListener('click', () => {
    document.getElementById('fileInput').click()
})

document.getElementById('fileInput').addEventListener('change', event => {
    var files = event.target.files
    Array.from(files).forEach(file => {
        fileList.push(file)
    })

    updateFileList()
})

//Change value
province.change(() => {
    const provinceId = province.val()

    provinceId ? $.ajax({
        url: "/home/district",
        type: "GET",
        data: { province: provinceId },
        dataType: "JSON",
        success: (res) => {
            district.empty()
            commune.empty()
            village.empty()
            district.append($("<option>").val(-1).text(`---${lSelect} ${lDistrict}---`))
            commune.append($("<option>").val(-1).text(`---${lSelect} ${lCommune}---`))
            village.append($("<option>").val(-1).text(`---${lSelect} ${lVillage}---`))

            $.each(res, (inex, row) => {
                district.append(
                    $("<option>")
                        .val(row.Id)
                        .text(row.NameKh + " / " + row.Name)
                )
            })
        },
        error: (hasError) => {
            console.log(hasError)
        },
    }) : province.append($("<option>").val(-1).text(`---${lSelect} ${lProvince}---`))

})

//Change value
district.change(() => {
    const districtId = district.val()

    districtId ? $.ajax({
        url: "/home/commune",
        type: "GET",
        data: { district: districtId },
        dataType: "JSON",
        success: (res) => {
            commune.empty()
            village.empty()
            commune.append($("<option>").val(-1).text(`---${lSelect} ${lCommune}---`))
            village.append($("<option>").val(-1).text(`---${lSelect} ${lVillage}---`))

            $.each(res, (inex, row) => {
                commune.append(
                    $("<option>")
                        .val(row.Id)
                        .text(row.NameKh + " / " + row.Name)
                )
            })
        },
        error: (hasError) => {
            console.log(hasError)
        },
    }) : district.append($("<option>").val(-1).text(`---${lSelect} ${lDistrict}---`))
})

//Change value
commune.change(() => {
    const communeId = commune.val()

    communeId ? $.ajax({
        url: "/home/village",
        type: "GET",
        data: { commune: communeId },
        dataType: "JSON",
        success: (res) => {
            village.empty()
            village.append($("<option>").val(-1).text(`---${lSelect} ${lVillage}---`))

            $.each(res, (inex, row) => {
                village.append(
                    $("<option>")
                        .val(row.Id)
                        .html(row.NameKh + " / " + row.Name)
                )
            })
        },
        error: (hasError) => {
            console.log(hasError)
        },
    }) : commune.append($("<option>").val(-1).text(`---${lSelect} ${lCommune}---`))
})
