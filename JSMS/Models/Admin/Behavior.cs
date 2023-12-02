using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Behavior
    {
        public int Id { get; set; }
        public string ConfirmBy { get; set; }
        public DateTime? CurrentDate { get; set; }
        public int Applicant { get; set; }
        public string CreatedBy { get; set; }
        public string Attachment { get; set; }
        public int Status { get; set; }
        public bool IsActive { get; set; }
        public string Noted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    } 
}