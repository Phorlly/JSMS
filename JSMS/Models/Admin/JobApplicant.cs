using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class JobApplicant : Global
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }  
        public string Phone { get; set; }
        public string Phone2 { get; set; } 
        public bool Sex { get; set; }
        public DateTime? DOB { get; set; }
        public int Village { get; set; }
        public int Commune { get; set; }
        public int District { get; set; }
        public int Province { get; set; }
        public string Attachments { get; set; }
        public string Image { get; set; }
    }
}