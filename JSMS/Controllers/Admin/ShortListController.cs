using JSMS.Helpers;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class ShortListController : Controller
    {
        protected readonly ApplicationDbContext context;

        public ShortListController()
        {
            context = new ApplicationDbContext();
        }
        // GET: ShortList
        public ActionResult Index()
        {
            var response = (from Applicant in context.Applicants
                            join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                            where Recruitment.IsActive == true
                            select new ApplicantRecruitment { Recruitment = Recruitment, Applicant = Applicant }).ToList();
            return View(response);
        }
    }
}