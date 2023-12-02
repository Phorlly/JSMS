using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Applicant: Global
    {
        public string Name { get; set; } 
        public string NickName { get; set; }
        public DateTime? DOB { get; set; } 
        public bool Gender { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string National { get; set; }
        public string Nationality { get; set; }
        public int Education { get; set; }
        public int CProvince { get; set; }
        public int CDistrict { get; set; }
        public int CCommune { get; set; }
        public int CVillage { get; set; }
        public string Image { get; set; }
        public int BProvince { get; set; }
        public int BDistrict { get; set; }
        public int BCommune { get; set; }
        public int BVillage { get; set; }
    }
}