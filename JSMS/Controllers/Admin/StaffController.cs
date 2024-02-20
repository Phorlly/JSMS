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
    public class StaffController : BaseController
    {
        // GET: Staff
        public ActionResult Index()
        {
            var shortList = (from applicant in context.JobApplicants  
                             join shortLists in context.ShortLists on applicant.Id equals shortLists.Applicant
                             where shortLists.IsActive.Equals(true)
                             select new ShortListApplicant
                             {
                                 Applicant = applicant,
                                 ShortList = shortLists
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