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
    public class HomeController : Controller
    {
        protected readonly ApplicationDbContext context;

        public HomeController()
        {
            context = new ApplicationDbContext();
        }
        protected override void Dispose(bool disposing)
        {
            context.Dispose();
        }


        public ActionResult Index()
        {
            int applicant, staff, client, user;

            applicant = context.Applicants.Count();
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
        public JsonResult BDistrict(int BProvince)
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Districts.Where(a => a.Province == BProvince).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult BCommune(int BDistrict)
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Communes.Where(a => a.District == BDistrict).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult BVillage(int BCommune)
        {
            context.Configuration.ProxyCreationEnabled = false;

            //var response = context.Villages.ToList().Where(c => c.Commune.Equals(communeId));
            var response = context.Villages.SqlQuery("SELECT * FROM Villages WHERE Commune = @BCommune",
                                          new SqlParameter("@BCommune", BCommune)).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        //Current Address
        [HttpGet]
        public JsonResult CDistrict(int CProvince)
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Districts.Where(a => a.Province == CProvince).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CCommune(int CDistrict)
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Communes.Where(a => a.District == CDistrict).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult CVillage(int CCommune)
        {
            context.Configuration.ProxyCreationEnabled = false;

            //var response = context.Villages.ToList().Where(c => c.Commune.Equals(communeId));
            var response = context.Villages.SqlQuery("SELECT * FROM Villages WHERE Commune = @CCommune",
                                          new SqlParameter("@CCommune", CCommune)).ToList();

            return Json(response, JsonRequestBehavior.AllowGet);
        }

    }
}