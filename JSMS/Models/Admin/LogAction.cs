using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class LogAction
    {
        public int Id { get; set; }
        public string LogBy { get; set; }
        public DateTime? OnDate { get; set; } 
    }
}