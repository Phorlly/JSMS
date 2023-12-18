using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class OtherExpense
    {
        public int Id { get; set; }
        public string InvoiceID { get; set; }
        public DateTime Date { get; set; }
        public decimal? Cost { get; set; }
        public string ExpenseType { get; set; }
        public string Note { get; set; }
        public int Status { get; set; }
        public string PaymentType { get; set; }
        public double Total { get; set; }
    }
}