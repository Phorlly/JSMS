using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    public class JobApplicantController : BaseController
    {
        // GET: JobApplicant
        public ActionResult Index()
        {
            return View(context.Provinces.ToList());
        }
    }
}