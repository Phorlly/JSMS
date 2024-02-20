using System;
using System.Web;
using JSMS.Models;
using System.Linq;
using JSMS.Helpers;
using System.Web.Mvc;
using System.Collections.Generic;

namespace JSMS.Controllers.Admin
{
    public class AccountingController : BaseController
    {
        // GET: Accounting
        public ActionResult Index()
        {
            return View(context.Staffs.Where(c => c.IsActive.Equals(true)).OrderBy(x => x.Code).ToList());
        }
    }
}