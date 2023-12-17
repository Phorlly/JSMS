//Declare variable
let addCheckIn = $("#add-check-in");
let editCheckIn = $("#edit-check-in");
let staffCheckIn = $("#staff-check-in");
let staffCheckOut = $("#staff-check-out");
let locationIn = $("#location");

//Check In
addCheckIn.click(() => {
    let response = validate();

    response ? $.ajax({
        url: "/api/hr/attendances/post-check-in",
        type: "POST",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify({ Staff: staffCheckIn.val(), Location: locationIn.val() }),
        success: (response) => {
            staffCheckIn.val("-1");
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

//Check Out
editCheckIn.click(() => {
    let response = validate();

    response ? $.ajax({
        url: "/api/hr/attendances/put-ckeck-out",
        type: "PUT",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        data: JSON.stringify({ Staff: staffCheckOut.val() }),
        success: (response) => {
            staffCheckOut.val("-1");
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

//Validation control
const validate = () => {
    let isValid = true;
    if (staffCheckIn.val() === "-1") {
        Swal.fire({
            title: "សូមជ្រើសរើសអត្តលេខបុគ្គលិកមួយមក​",
            icon: "warning",
            showConfirmButton: false,
            customClass: { title: 'custom-swal-title' },
            timer: 1500,
        });
        staffCheckIn.css("border-color", "red");
        staffCheckIn.focus();
        isValid = false;
    } else {
        staffCheckIn.css("border-color", "#cccccc");
        if (staffCheckOut.val() === "-1") {
            Swal.fire({
                title: "សូមជ្រើសរើសអត្តលេខបុគ្គលិកមួយមក​",
                icon: "warning",
                showConfirmButton: false,
                allowHtml: true,
                customClass: { title: 'custom-swal-title' },
                timer: 1500,
            });
            staffCheckOut.css("border-color", "red");
            staffCheckOut.focus();
            isValid = false;
        } else {
            staffCheckOut.css("border-color", "#cccccc");
        }
    }
    return isValid;
};


const succes = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    //let url = `<a href="https://www.openstreetmap.org/#map=16/${latitude}/${longitude}">
    //                     Your current position: latitude: ${latitude}, longtitude: ${longitude}.
    //              </a>`;
    //let geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=km`;

    let urlApi = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(urlApi)
        .then(res => res.json())
        .then(data => {
            //console.log(data)
            locationIn.val(data.address.village + ", " + data.address.town + ", " + data.address.state);
        });
};

const error = (err) => {
    console.log(err);
};

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

if (!navigator.geolocation) {
    throw new Error("No geolocation availabe");
}
navigator.geolocation.getCurrentPosition(succes, error, options);