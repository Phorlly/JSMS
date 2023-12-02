jQuery(document).ready(() => {
    loadingGif();
});

//Declare vaiable
let addExpense = $("#add-expense");
let monthly = formatMonthYear("#monthly-expense");
let modalExpense = $("#modal-expense");
let generalSalary = $("#general-salary");
let generalTransaction = $("#general-transaction");
let salaryTransaction = $("#salary-transaction");
let tabExpense = $("#tab-expense");
let saveExpense = $("#save-expense");
let updateExpense = $("#update-expense");
let expenseType = $("#expense-type");
let gPayment = $("#g-payment");
let gAmount = $("#g-amount");
let gExchangeRate = $("#g-exchange-rate");
let gDateExpense = $("#g-date-expense");
let gCurrency = $("#g-currency");
let gDescription = $("#g-description");
let staff = $("#staff");
let sLocation = $("#s-location");
let mainSalary = $("#main-salary");
let sAmount = $("#s-amount");
let sExchangeRate = $("#s-exchange-rate");
let sCurrency = $("#s-currency");
let sPayment = $("#s-payment");
let sDescription = $("#s-description");

//Add new
addExpense.click(() => {
    modalExpense.modal("show");
    generalTransaction.show();
    salaryTransaction.hide();
    clearExpense();
});

//Hide show 
tabExpense.click(() => {
    addIncome.hide();
    addExpense.show();
});

//Change value
generalSalary.change(() => {
    //console.log(generalSalary.val())
    if (generalSalary.val() === "0") {
        generalTransaction.show();
        salaryTransaction.hide();
    } else {
        generalTransaction.hide();
        salaryTransaction.show();
    }
});

//Clear control 
const clearExpense = () => {
    saveExpense.show();
    updateExpense.hide();
};

//Chacnge value
staff.change(() => {
    let staffId = staff.val();
    staffId ? $.ajax({
        url: "/transaction/code",
        type: "GET",
        data: { staff: staffId },
        dataType: "JSON",
        success: (response) => {
            sLocation.val(response.Noted);
            mainSalary.val(response.MainSalary.toFixed(2));
        },
        error: (hasError) => console.log(hasError),
    }) : sLocation.append($("<input>").val("Location Standby"));
});