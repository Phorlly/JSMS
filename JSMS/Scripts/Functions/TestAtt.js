
let checkIn = $("#checkin"); // Corrected the ID
let checkOut = $("#checkout"); // Corrected the ID
let staffId = $("#staffid"); // Corrected the ID
let dataId = $("#data-id");

checkIn.click(() => {
    let isValid = validate();

    if (!isValid) {
        return false;
    }

    let data = {
        StaffId: staffId.val(),
        CheckIn: new Date().toISOString(),
        CheckOut: null
    };

    console.log(data);

    $.ajax({
        url: "/api/hr/test/post-checkin",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify(data),
        statusCode: {
            200: (response) => {
                Swal.fire({
                    icon: "success",
                    title: "សូមអរគុណ",
                    text: "អ្នកបានស្កេនបានជោគជ័យ",
                });
                console.log(response);
            },
            400: (xhr) => {
                Swal.fire({
                    icon: "error",
                    title: "សូមអធ្យាស្រ័យ",
                    text: "សូមស្កេនម៉ោងចេញសិន",
                });
                console.log(xhr.responseText);
            },
            404: (xhr) => {
                Swal.fire({
                    icon: "error",
                    title: "សូមអធ្យាស្រ័យ",
                    text: "អត្តលេខអ្នកមិនមាន",
                });
                var errorMessage = xhr.responseJSON ? xhr.responseJSON.Message : "Not Found";
                console.log(xhr.responseText);
            },
            500: (xhr) => {
                Swal.fire({
                    icon: "error",
                    title: "សូមអធ្យាស្រ័យ",
                    text: "ប្រព័ន្ធមានបញ្ហា",
                });
                console.log(xhr.responseText);
            },
        },
    });
});

checkOut.click(() => {
    let isValid = validate();

    if (!isValid) {
        return false;
    }

    let dataCheckOut = {
        StaffId: staffId.val(),
        CheckOut: new Date().toISOString()
        //why bos body nis tv post checkout cause checkout null
    };

    console.log("Request URL:", "/api/hr/test/post-checkout/" + staffId.val());
    console.log("Data for Checkout:", dataCheckOut);

    $.ajax({ 
        url: "/api/hr/test/post-checkout/" + staffId.val(),
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
       // data: JSON.stringify(dataCheckOut),
       data: null,
        statusCode: {
            200: (response) => {
                Swal.fire({
                    icon: "success",
                    title: "សូមអរគុណ",
                    text: "អ្នកបានស្កេនបានជោគជ័យ",
                });
                console.log(response);
            },
            //400: (xhr) => {
            //    Swal.fire({
            //        icon: "error",
            //        title: "សូមអធ្យាស្រ័យ",
            //        text: "សូមស្កេនម៉ោងចូលសិន",
            //    });
            //    var errorMessage = xhr.responseJSON ? xhr.responseJSON.Message : "Bad Request";
            //    console.log(xhr.responseText);
            //},
            404: (xhr) => {
                Swal.fire({
                    icon: "error",
                    title: "សូមអធ្យាស្រ័យ",
                    text: "សូមស្កេនម៉ោងចូលសិន",
                    customClass: {
                        title: 'your-custom-font-class',
                        content: 'your-custom-font-class'
                    }
                });
                var errorMessage = xhr.responseJSON ? xhr.responseJSON.Message : "Not Found";
                console.log(xhr.responseText);
            },
            500: (xhr) => {
                Swal.fire({
                    icon: "error",
                    title: "សូមអធ្យាស្រ័យ",
                    text: "ប្រព័ន្ធមានបញ្ហា",
                });
                var errorMessage = xhr.responseJSON ? xhr.responseJSON.Message : "Internal Server Error";
                console.log(xhr.responseText);
            },
        },
    });
});

//checkOut.click(() => {
//    let isValid = validate();

//    if (!isValid) {
//        return false;
//    }

//    let data = {
//        StaffId: staffId.val(),
//    };

//    console.log(data);

//    $.ajax({
//        url: "/api/hr/test/post-checkout/" + staffId.val(),
//        type: "POST",
//        contentType: "application/json;charset=UTF-8",
//        dataType: "JSON",
//        data: JSON.stringify(data),
//        statusCode: {
//            200: (response) => {
//                // Handle success
//                console.log(response);
//            },
//            400: (xhr) => {
//                toastr.error("You need to Check In before Check Out", "Server Response");
//                console.log(xhr.responseText);
//            },
//            500: (xhr) => {
//                toastr.error("Something happened", "Server Response");
//                console.log(xhr.responseText);
//            },
//        },
//    });
//});


const validate = () => {
    let isValid = true;

    if (staffId.val() === "-1") {
        Swal.fire({
            title: "សូមជ្រើសរើសអត្តលេខ",
            text: "រើសអត្តលេខដែលត្រូវស្រង់វដ្ដមាន",
            icon: "question",
            customClass: {
                title: 'title-class',
                text:'text-class',
                icon: 'icon-class'
            },
        });
        staffId.css("border-color", "red");
        staffId.focus();
        isValid = false;
    }

    return isValid;
};
