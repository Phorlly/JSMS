using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class AttendanceController : BaseController
    {
        // GET: Attendance
        public ActionResult Index()
        {
            return View(context.Staffs.Where(c => c.IsActive.Equals(true)).OrderBy(x => x.Code).ToList());
        }

        // GET: Attendance
        public ActionResult Report() 
        {
            return View(context.Staffs.Where(c => c.IsActive.Equals(true)).OrderBy(x => x.Code).ToList());
        }

    }
}