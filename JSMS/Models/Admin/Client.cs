using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Client : Global
    {
        public string Name { get; set; }
        public string Company { get; set; }
        public string GDTREG { get; set; }
        public string VATTIN { get; set; }
        public bool Gender { get; set; }
        public bool IsClient { get; set; }
        public DateTime? DOB { get; set; }
        public int Position { get; set; }
        public int Province { get; set; }
        public int District { get; set; }
        public int Commune { get; set; }
        public int Village { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string Image { get; set; }
    }
}