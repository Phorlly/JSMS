using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class ShortList: Global
    {
        public int Applicant { get; set; }   
        public int Rating { get; set; }
        public int InterviewNo { get; set; }  
        public DateTime? CurrentDate { get; set; } 
    }
}