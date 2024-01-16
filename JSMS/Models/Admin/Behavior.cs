using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Behavior: Global
    {
        public string ConfirmBy { get; set; }
        public DateTime? CurrentDate { get; set; }
        public int Applicant { get; set; }
        public string Attachment { get; set; }
    } 
}