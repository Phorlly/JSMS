using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class UserRoleController : Controller
    {
        protected readonly ApplicationDbContext context;

        public UserRoleController() 
        {
            context = new ApplicationDbContext();
        }
        protected override void Dispose(bool disposing)
        {
            context.Dispose();
        }

        // GET: UserRole
        public ActionResult Index()
        {
            return View(context.Roles.ToList());
        }
    }
}