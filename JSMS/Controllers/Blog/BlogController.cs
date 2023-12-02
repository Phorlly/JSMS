using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Blog
{
    public class BlogController : Controller
    {
        protected readonly ApplicationDbContext context;

        public BlogController()
        {
            context = new ApplicationDbContext();
        }

        // GET: Blog
        public ActionResult Index()
        {
            return View(context.Countries.ToList());
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult Contact()
        {
            return View();
        }
        public ActionResult Service()
        {
            return View();
        }
        public ActionResult Career()
        {
            return View(context.Provinces.ToList());
        }

        [HttpGet]
        public JsonResult State(int Country) 
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.States.Where(a => a.Country == Country).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult City(int State)
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Cities.Where(a => a.State == State).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}