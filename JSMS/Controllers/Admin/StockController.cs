using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class StockController : Controller
    {
        protected readonly ApplicationDbContext context;

        public StockController()
        {
            context = new ApplicationDbContext();
        }

        // GET: Stock
        public ActionResult Product() 
        {
            return View();
        }

        // GET: Stock
        public ActionResult Index()
        {
            return View(context.Products.Where(c => c.IsActive.Equals(true)).ToList());
        }

        // GET: Stock
        public ActionResult Report() 
        {
            return View(context.Products.Where(c => c.IsActive.Equals(true)).ToList());
        }
    }
}