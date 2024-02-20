using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class UserRoleController : BaseController
    {
        // GET: UserRole
        public ActionResult Index()
        {
            return View(context.Roles.OrderBy(c => c.Name).ToList());
        }

        // GET: UserRole
        public ActionResult UserProfile()   
        {
            return View();
        }
    }
}