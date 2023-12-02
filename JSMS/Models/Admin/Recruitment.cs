using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Recruitment : Global
    {
        public int Applicant { get; set; }
        public int Gaurantor { get; set; }
        public DateTime? CurrentDate { get; set; } 
    }
}