using JSMS.Controllers.Api;
using JSMS.Helpers;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class ApplicantController : BaseController
    {
      
        // GET: Applicant
        public ActionResult Index()
        {
            var response = new ApplicantProvince()
            {
                Applicants = context.Applicants.ToList(),
                Provinces = context.Provinces.ToList(),
            };

            return View(response);
        }

        // GET: Guarantor
        public ActionResult Guarantor()
        {
            var response = new ApplicantProvince()
            {
                Applicants = context.Applicants.ToList(),
                Provinces = context.Provinces.ToList(),
            };

            return View(response);
        }

        // GET: Behavior
        public ActionResult Behavior()
        {
            var response = new ApplicantProvince()
            {
                Applicants = context.Applicants.ToList(),
                Provinces = context.Provinces.ToList(),
            };

            return View(response);
        }
    }
}