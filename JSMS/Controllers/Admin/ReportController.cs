using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class ReportController : Controller
    {
        // GET: Report
        public ActionResult Attendance() 
        {
            return View();
        }

        // GET: Report
        public ActionResult IncomeExpense() 
        {
            return View();
        }

        // GET: Report
        public ActionResult Tax() 
        {
            return View();
        }
    }
}