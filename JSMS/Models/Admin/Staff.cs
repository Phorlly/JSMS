using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Staff: Global
    {
        public string Code { get; set; }
        public int ShortList { get; set; }
        public int Client { get; set; } 
        public int Position { get; set; }
        public decimal? MainSalary { get; set; }
        public decimal? PremierSalary { get; set; } 
        public DateTime? CurrentDate { get; set; }

        public Staff()
        {
            PremierSalary = 15;
        }
    }
}