using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    public class AccountingController : Controller
    {
        protected readonly ApplicationDbContext context;
        public AccountingController()
        {
            context = new ApplicationDbContext();
        }

        // GET: Accounting
        public ActionResult Index()
        {
            return View(context.Staffs.Where(c => c.IsActive.Equals(true)).OrderBy(x => x.Code).ToList());
        }
    }
}