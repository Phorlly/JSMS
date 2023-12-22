using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace JSMS.Controllers
{
    [Authorize]
    public class LanguageController : Controller
    {
        // GET: Language
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Change(String translator)
        {
            if (!String.IsNullOrEmpty(translator))
            {
                Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(translator);
                Thread.CurrentThread.CurrentUICulture = new CultureInfo(translator);
            }
            var cookie = new HttpCookie("Languages") { Value = translator };
            Response.Cookies.Add(cookie);

            return Redirect(Request.UrlReferrer.PathAndQuery);
        }
    }
}