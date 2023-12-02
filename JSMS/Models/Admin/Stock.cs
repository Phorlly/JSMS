using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Stock
    {
        public int Id { get; set; }
        public int Product { get; set; }
        public int Total { get; set; } 
    }

    public class StockTransaction
    {
        public int Id { get; set; }
        public int Product { get; set; }
        public int Quantity { get; set; }
        public DateTime? Date { get; set; }
        public string Noted { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }  
        public int Status { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? Deleted { get; set; }
    }
}