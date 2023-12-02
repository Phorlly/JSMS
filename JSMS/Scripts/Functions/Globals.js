//Format currency
const formatCurrency = (currencyType, data) => {
    currencyType === 1
        ? `<span class="btn btn-success btn-sm">${data
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <sup>$</sup></span>`
        : `<span class="btn btn-warning btn-sm">${data
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <sup>៛</sup></span>`;
};

const sexOption = (selecter, dataId) => {
    let select = document.getElementById(selecter);
    let data = [
        { id: -1, name: "---Please select option---" },
        { id: true, name: "Female" },
        { id: false, name: "Male" },
    ];
    data.forEach((item) => {
        let option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        // if (item.id === dataId) {
        //     option.selected = true;
        // }
        if (item.id === -1) {
            option.selected = true;
        }

        select.appendChild(option);
    });
};

//get file image
//const readUrl = (uploadInput, imagePreview) => {

//    let input = $(uploadInput);

//    if (input.files && input.files[0]) {
//        const reader = new FileReader();

//        reader.onload = function (e) {
//            $(imagePreview).src = e.target.result;
//        };

//        reader.readAsDataURL(input.files[0]);
//    }
//};

//Format to number and dot only
const numberOnly = (selector) => {
    let numberInput = document.getElementById(selector);

    numberInput.addEventListener("input", (e) => {
        let inputText = e.target.value;
        let numberPattern = /^[0-9]*$/;

        if (!numberPattern.test(inputText)) {
            e.target.value = inputText.replace(/[^\d.]/g, ""); // Remove non-numeric characters
        }
    });
};

//Show file in label
const showFile = (filePath) => {
    // Split the path by the forward slash '/'
    let pathParts = filePath.split("/");

    // Get the last part (the filename)
    let fileName = pathParts[pathParts.length - 1];

    return fileName !== null ? fileName : "";
};

//Read file by url
const readFile = (attachment) => {
    let fileName = attachment.split("/").pop(); // Get the file name from the URL
    return { name: fileName, url: attachment };
};

//Format education
const formatEducation = (id) => {
    let data = [
        { id: 1, name: "មិនបានសិក្សា" },
        { id: 2, name: "បឋមសិក្សា" },
        { id: 3, name: "អនុវិទ្យាល័យ" },
        { id: 4, name: "វិទ្យាល័យ" },
        { id: 5, name: "សាកលវិទ្យាល័យ" },
        { id: 6, name: "ផ្សេងៗ" },
    ];

    let matchedItem = data.find((item) => item.id === id);

    return matchedItem ? matchedItem.name : "";
};

//Format status
const formatStatus = (id) => {
    let data = [
        { id: 0, name: "Pending" },
        { id: 1, name: "Loading" },
        { id: 2, name: "Approved" },
    ];

    let matchedItem = data.find((item) => item.id === id);

    return matchedItem.id === 0
        ? `<span class="btn btn-danger btn-sm" style="cursor: default;font-weight: bold;">${matchedItem.name}</span>`
        : matchedItem.id === 1
            ? `<span class="btn btn-warning btn-sm" style="cursor: default;font-weight: bold;">${matchedItem.name}</span>`
            : matchedItem.id === 2
                ? `<span class="btn btn-success btn-sm" style="cursor: default;font-weight: bold;">${matchedItem.name}</span>`
                : "";
};

//Format income type
const formatIncome = (id) => {
    let data = [
        { id: 1, name: "ចំណូលពីការឧបត្ថម្ភស្ម័គ្រចិត្ត" },
        { id: 2, name: "ចំណូលពីការលក់សេវាកម្ម" },
        { id: 3, name: "ចំណូលពីការពីការឧបត្ថម្ភពីរដ្ឋ" },
        { id: 4, name: "ប្រាក់ចំណូលពីការលក់ផលិតផល" },
        { id: 5, name: "ចំណូលពីថ្លៃសេវា" },
        { id: 6, name: "ប្រាក់ចំណូលពីការផ្សាយពាណិជ្ជកម្ម" },
        { id: 7, name: "ចំណូលពីចំណូលការប្រាក់" },
        { id: 8, name: "ចំណូលពីសួយសារអាករ" },
        { id: 9, name: "ចំណូលពីថ្លៃប្រឹក្សាយោបល់" },
    ];

    let item = data.find((item) => item.id === id);
    return item.name;
};

//Format expense type
const formatExpense = (id) => {
    let data = [
        { id: 1, name: "បង់ពន្ធប្រចាំខែ" },
        { id: 2, name: "បង់ពន្ធប្រចាំឆ្នាំ" },
        { id: 3, name: "ប្រាក់បៀវត្សរ៍និងប្រាក់ឈ្នួលរបស់និយោជិត" },
        { id: 4, name: "ថ្លៃសម្ភារៈ និងការផ្គត់ផ្គង់" },
        { id: 5, name: "ការចំណាយលើការជួលទីតាំង" },
        { id: 6, name: "ការផ្គត់ផ្គង់ក្រុមហ៊ុន (អគ្គិសនី, ថ្លៃទឹក)" },
        { id: 7, name: "ការចំណាយលើការធានារ៉ាប់រង" },
        { id: 8, name: "ថ្លៃថែទាំ និងជួសជុល" },
        { id: 10, name: "ការចំណាយលើទីផ្សារ និងការផ្សាយពាណិជ្ជកម្ម" },
        { id: 11, name: "ការចំណាយលើសម្ភារៈ" },
        { id: 12, name: "ការចំណាយលើការធ្វើដំណើរ និងការកម្សាន្ត" },
    ];

    let item = data.find((item) => item.id === id);
    return item.name;
};

//Format expense type
const formatPosition = (id) => {
    let data = [
        { id: 1, name: "ម្ចាស់ភាគហ៊ុន" },
        { id: 2, name: "ថៅកែ" },
        { id: 3, name: "អ្នកគ្រប់គ្រង" },
        { id: 4, name: "ថលេខា" },
    ];

    let item = data.find((item) => item.id === id);
    return item.name;
};

//Format code for interview
const formatInterview = (id) => {
    let data = [
        { id: 1, name: "JLS-001" },
        { id: 2, name: "JLS-002" },
        { id: 3, name: "JLS-003" },
        { id: 4, name: "JLS-004" },
        { id: 5, name: "JLS-005" },
        { id: 6, name: "JLS-006" },
        { id: 7, name: "JLS-007" },
        { id: 8, name: "JLS-008" },
        { id: 9, name: "JLS-009" },
        { id: 10, name: "JLS-010" },
        { id: 11, name: "JLS-011" },
        { id: 12, name: "JLS-012" },
    ];

    let item = data.find((item) => item.id === id);
    return item.name;
};

//Format month year
const formatMonthYear = (selector) => {
    let currentDate = new Date();
    let dateFormat = currentDate.toISOString().slice(0, 7);
    let monthYear = $(selector).val(dateFormat);

    return monthYear;
}

//Format date
const formatDate = (val) => {
    let date = new Date(val);
    let dateFormated = date.getFullYear() + "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2);
    return val ? dateFormated : "";
};

//Loading gif
const loadingGif = () => {
    $(document).ajaxStart(() => {
        $("#loading-gif").addClass("show");
    }).ajaxStop(() => {
        $("#loading-gif").removeClass("show");
    });
}