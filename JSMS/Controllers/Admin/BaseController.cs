using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    public class BaseController : Controller
    {
        //Create connection to databasee
        public readonly ApplicationDbContext context;
        public BaseController()
        {
            //Connect to database
            context = new ApplicationDbContext();
        }

        //Disable connection
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                context.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}