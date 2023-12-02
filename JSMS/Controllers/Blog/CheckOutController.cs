﻿using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Blog
{
    public class CheckOutController : Controller
    {
        protected readonly ApplicationDbContext _context;

        public CheckOutController()
        {
            _context = new ApplicationDbContext();
        }

        // GET: TestAtt
        public ActionResult Index()
        {
            return View(_context.Staffs.ToList());
        }
    }
}