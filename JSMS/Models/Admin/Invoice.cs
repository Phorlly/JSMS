using System;
using System.Web;
using System.Linq;
using System.Collections.Generic;

namespace JSMS.Models.Admin
{
    public class Invoice
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string InvoiceNumber { get; set; }
        public int ClientId { get; set; }
        public string Description { get; set; }

        public int Qty { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Amount { get; set; }

        public decimal? Tax { get; set; }

        public decimal? Total { get; set; }

        public string Note { get; set; }
    }
}