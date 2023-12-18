using JSMS.Helpers;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    public class OtherGLController : Controller
    {
        protected readonly ApplicationDbContext context;
        public OtherGLController()
        {
            context = new ApplicationDbContext();
        }

        // GET: OtherGL
        public ActionResult Index()
        {
            return View(context.OtherExpenses.ToList());
        }
    }
}