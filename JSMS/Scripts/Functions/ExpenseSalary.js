jQuery(document).ready(() => {
    loadingGif();
});

let modalExpenseSalary = $("#modal-expense-salary");
addExpenseSalary.click(() => {
    modalExpenseSalary.modal("show");
});