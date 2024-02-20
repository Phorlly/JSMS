using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class TransactionController : BaseController
    {
        // GET: Transaction
        public ActionResult Index()
        {
            var response = new StaffClient()
            {
                Staffs = context.Staffs.ToList(),
                Clients = context.Clients.ToList()
            };

            return View(response);
        }


        [HttpGet]
        public JsonResult CountStaff(int staff)
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Staffs.Count(c => c.Client == staff); // Replace clientId with the ID of the client you're interested in

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Code(int staff)  
        {
            context.Configuration.ProxyCreationEnabled = false;

            var response = context.Staffs.Single(c => c.Id == staff);

            return Json(response, JsonRequestBehavior.AllowGet);
        }
    }
}