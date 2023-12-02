using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Attendance: Global
    {
        public int Staff { get; set; } 
        public DateTime? CheckIn { get; set; }
        public DateTime? CheckOut { get; set; } 
        public string Location { get; set; }
    }
}