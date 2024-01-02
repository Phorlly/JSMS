using JSMS.Models.Admin;
using JSMS.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Helpers
{


    public class DataMappers
    {
        public IEnumerable<Applicant> Applicants { get; set; }
        public IEnumerable<Gaurantor> Gaurantors { get; set; }
    }
    public class ApplicantRecruitment
    {
        public Recruitment Recruitment { get; set; }
        public Applicant Applicant { get; set; }
    }

    public class ShortListApplicant
    {
        public ShortList ShortList { get; set; }
        public Applicant Applicant { get; set; }
    }

    public class ShortListClientMapper
    {
        public List<ShortListApplicant> ShortLists { get; set; }
        public List<Client> Clients { get; set; }
    }

    public class StaffList
    {
        public Staff Staff { get; set; }
        public Applicant Applicant { get; set; }
    }

    public class ApplicantProvince
    {
        public IEnumerable<Applicant> Applicants { get; set; }
        public IEnumerable<Province> Provinces { get; set; }
    }

    public class InvoiceClient
    {
        public IEnumerable<Client> Clients { get; set; }
        public IEnumerable<Invoice> Invoices { get; set; }
    }
       

    public class StaffClient
    {
        public IEnumerable<Staff> Staffs { get; set; }
        public IEnumerable<Client> Clients { get; set; } 
    }
}