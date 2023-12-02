using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.User
{
    public class OnlineClient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Company { get; set; } 
        public int Sex { get; set; }
        public string Email { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public int Country { get; set; }
        public int Province { get; set; }  
        public string Noted { get; set; }
        public bool IsActive { get; set; } 
        public int Status { get; set; } 
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}