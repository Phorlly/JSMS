using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.User
{
    public class OnlineApplicant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NickName { get; set; }
        public int Sex { get; set; }
        public string National { get; set; }
        public string Nationality { get; set; } 
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public int Education { get; set; }
        public int POB { get; set; }
        public int Address { get; set; }
        public DateTime? DOB { get; set; }
        public int Position { get; set; }
        public string Attachment { get; set; }
        public bool IsActive { get; set; }  
        public string Noted { get; set; }
        public int Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; } 
    }
} 