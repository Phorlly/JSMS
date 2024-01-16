using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace JSMS.Models.Admin
{
    public class SubMenuItem 
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public string Action { get; set; } 
        public string Controller  { get; set; }
        public List<string> Role { get; set; }
    }
 
    public class MainMenuItem 
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public List<string> Role { get; set; }
        public List<SubMenuItem> SubMenuItems { get; set; } = null;
    }
}