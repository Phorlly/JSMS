using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class MenuItem
    {
        public string Name { get; set; }
        public string Action { get; set; } 
        public string Controller  { get; set; }
        public string Icon { get; set; }
        public List<string> Role { get; set; }     
    }
}