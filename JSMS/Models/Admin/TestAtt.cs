using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class TestAtt 
    {
        public int Id { get; set; }
        public int StaffId { get; set; }
        public int ClientId { get; set; }   
        public DateTime? CheckIn { get; set; } 
        public DateTime? CheckOut { get; set; }
    }
}