using JSMS.Models;
using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Threading.Tasks;


namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class HomeController : BaseController
    {
        public HomeController()
        {

        }

        public ActionResult Index()
        {
            int applicant, staff, client, user;

            applicant = context.JobApplicants.Count();
            staff = context.Staffs.Count();
            client = context.Clients.Count();
            user = context.Users.Count();

            ViewBag.Applicant = applicant;
            ViewBag.Staff = staff;
            ViewBag.Client = client;
            ViewBag.User = user;

            return View();
        }

        //[Authorize(Roles = "Admin")]
        public ActionResult About()
        {
            //var data = new AddressHelper()
            //{
            //    Provinces = context.Provinces.ToList(),
            //    Districts = context.Districts.ToList(),
            //    Communes = context.Communes.ToList(),
            //    Villages = context.Villages.ToList()
            //};

            return View(context.Provinces.ToList());

        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        //Place of Birth
        [HttpGet]
        public JsonResult District(int province) 
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Districts.Where(a => a.Province == province).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Commune(int district) 
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Communes.Where(a => a.District == district).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Village(int commune) 
        {
            context.Configuration.ProxyCreationEnabled = false;

            //var response = context.Villages.ToList().Where(c => c.Commune.Equals(commune));
            var response = context.Villages.SqlQuery("SELECT * FROM Villages WHERE Commune = @commune",
                                          new SqlParameter("@commune", commune)).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}