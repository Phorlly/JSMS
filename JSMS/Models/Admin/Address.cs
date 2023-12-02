using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin 
{

    public class Country
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
    
    public class State
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Country { get; set; }
    }

    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int State { get; set; } 
    } 

    public class Province
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameKh { get; set; }
    }

    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameKh { get; set; }
        public int Province { get; set; }
    }

    public class Commune
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameKh { get; set; }
        public int District { get; set; } 

    }

    public class Village
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NameKh { get; set; }

        public int Commune  { get; }  
    }
   
}