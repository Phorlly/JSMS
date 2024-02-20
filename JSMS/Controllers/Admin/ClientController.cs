using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class ClientController : BaseController
    {
        // GET: Client
        public ActionResult Index()
        {
            return View(context.Provinces.ToList());
        }
    }
}