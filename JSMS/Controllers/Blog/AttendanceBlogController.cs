using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Blog
{
    public class AttendanceBlogController : Controller
    {
        protected readonly ApplicationDbContext context;

        public AttendanceBlogController()
        {
            context = new ApplicationDbContext();
        }

        // GET: AttendanceBlog
        public ActionResult Index()
        {
            return View();
        }

        // GET: AttendanceBlog
        public ActionResult CheckIn() 
        {
            return View(context.Staffs.OrderBy(c => c.Code).ToList());
        }
        // GET: AttendanceBlog
        public ActionResult CheckOut() 
        {
            return View(context.Staffs.OrderBy(c => c.Code).ToList());
        }
    }
}