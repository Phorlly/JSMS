using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Transaction: Global 
    {
        public string Code { get; set; }
        public int Client { get; set; }
        public int Staff { get; set; } 
        public int Payment { get; set; }  
        public int Type { get; set; }
        public decimal? Amount { get; set; }
        public decimal? VAT { get; set; }
        public int Quantity { get; set; } 
        public DateTime? DateInOrEx { get; set; }  
        public int Income { get; set; }
        public decimal? Exchange { get; set; } 
        public decimal? Total { get; set; }
        public int Currency { get; set; }
        public decimal? Unit { get; set; }
        public string Description { get; set; }  
        public string Attachment { get; set; }
    }
}