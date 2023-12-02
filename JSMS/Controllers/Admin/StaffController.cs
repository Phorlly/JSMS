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
    public class StaffController : Controller
    {
        protected readonly ApplicationDbContext context;

        public StaffController()
        {
            context = new ApplicationDbContext();
        }

        // GET: Staff
        public ActionResult Index()
        {
            var shortList = (from Applicant in context.Applicants
                             join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                             join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                             where ShortList.IsActive.Equals(true)
                             select new ShortListApplicant
                             {
                                 Applicant = Applicant,
                                 ShortList = ShortList
                             }).ToList();
            var client = context.Clients.Where(x => x.IsClient.Equals(true)).ToList();
            var response = new ShortListClientMapper()
            {
                Clients = client,
                ShortLists = shortList
            };

            return View(response);
        }
    }
}