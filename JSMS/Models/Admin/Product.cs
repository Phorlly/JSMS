using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }   
        public string Noted { get; set; }
        public DateTime? Created { get; set; } 
        public DateTime? Updated { get; set; }
        public DateTime? Deleted { get; set; }   
    }
}