using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Helpers
{
    public class AttendanceReport 
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Shift { get; set; }
        public string Location { get; set; }
        public int IOStatus { get; set; }
        //public Staff Staff { get; set; }
        public DateTime? AttendanceDate { get; set; }
    }

}