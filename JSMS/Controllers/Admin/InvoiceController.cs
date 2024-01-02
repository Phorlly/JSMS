using System;
using System.Web;
using JSMS.Models;
using System.Linq;
using JSMS.Helpers;
using System.Web.Mvc;
using System.Collections.Generic;

namespace JSMS.Controllers.Admin
{
    public class InvoiceController : Controller
    {
        protected readonly ApplicationDbContext context;

        public InvoiceController()
        {
            context = new ApplicationDbContext();
        }
        // GET: Invoice
        public ActionResult Index()
        {
            var response = new InvoiceClient
            {
                Clients = context.Clients.ToList(),
                Invoices = context.Invoices.ToList(),
            };
            return View(response);
        }
    }
}