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
        public int ClientOrStaff { get; set; } 
        public int Payment { get; set; }  
        public int Type { get; set; }
        public float Amount { get; set; }
        public float Tax { get; set; } 
        public int Quantity { get; set; } 
        public DateTime? Date { get; set; }   
        public float Exchange { get; set; } 
        public float Cost { get; set; } 
        public int Currency { get; set; }
        public float UnitPrice { get; set; } 
        public string Attachment { get; set; }
    }
}