
jQuery(document).ready(() => {
    // The Calender
    $('#calendar').datetimepicker({
        format: 'L',
        inline: true,
        sideBySide: true,  // Display the date and time side by side
        //showTodayButton: true,  // Show the "Today" button
        icons: {
            next: 'fas fa-chevron-right',  // Customize the next button icon
            previous: 'fas fa-chevron-left'  // Customize the previous button icon
        }
    });
    createStockChart();
    showTime();
});
// Function to create the stock chart
const createStockChart = () => {
    let ctx = document.getElementById('pie-chart').getContext('2d');
    $.ajax({
        url: "/api/hr/reports/get-remain-stock",
        type: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "JSON",
        success: response => {
            let myPieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: response.map(item => `${item.Name} (${item.Total})`),
                    datasets: [{
                        data: response.map(item => item.Total),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    tooltips: {
                        callbacks: {
                            label: (tooltipItem, data) => {
                                return data.labels[tooltipItem.index];
                            }
                        },
                        bodyFontFamily: 'Battambang',
                        bodyFontSize: 14
                    }
                }

            });
        },
        error: (xhr) => console.error(xhr),
    });
}

//show date-time
const showTime = () => {
    let date = new Date();
    let h = date.getHours(); // 0 - 23
    let m = date.getMinutes(); // 0 - 59
    let s = date.getSeconds(); // 0 - 59
    let session = "AM";

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;


    let time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("display-date-time").innerText = time;
    document.getElementById("display-date-time").textContent = time;

    setTimeout(showTime, 1000);
}

// Get the current date
var currentDate = moment();

// Format the date
var formattedDate = currentDate.format("dddd, DD MMMM YYYY");

// Set the content of the span tag
document.getElementById("display-date").textContent = formattedDate;
