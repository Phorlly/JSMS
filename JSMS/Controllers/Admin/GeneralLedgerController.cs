﻿using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    public class GeneralLedgerController : Controller
    {

        protected readonly ApplicationDbContext context;
        public GeneralLedgerController()
        {
            context = new ApplicationDbContext();
        }

        // GET: GeneralLedger
        public ActionResult Index()
        {
            return View(context.OtherExpenses.ToList());

        }
    }
}