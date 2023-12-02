using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    public class AttendanceTestViewController : Controller
    {
        protected readonly ApplicationDbContext context;

        public AttendanceTestViewController()
        {
            context = new ApplicationDbContext();
        }


        // GET: Attendance
        public ActionResult Index()
        {
            return View(context.Staffs.ToList());
        }
    }
}