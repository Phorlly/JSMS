using JSMS.Helpers;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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