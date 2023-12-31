﻿using JSMS.Helpers;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class RecruitmentController : Controller
    {
        protected readonly ApplicationDbContext context;

        public RecruitmentController()
        {
            context = new ApplicationDbContext();
        }

        // GET: Recuitment
        public ActionResult Index()
        {
            var response = new DataMappers()
            {
                Applicants = context.Applicants.ToList(),
                Gaurantors = context.Gaurantors.ToList(),
            };

            return View(response);
        }
    }
}