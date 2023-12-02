using System;
using System.Globalization;
using System.Threading;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace JSMS
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            var cookie = HttpContext.Current.Request.Cookies["Languages"];
            if (cookie != null && cookie.Value != null)
            {
                System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(cookie.Value);
                System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(cookie.Value);
            }
            else
            {
                HttpCookie cookieLanguage = new HttpCookie("Languages");
                cookieLanguage.Value = "km";
                Response.Cookies.Add(cookieLanguage);
                System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("km");
                System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo("km");
            }
        }

        //protected void Application_BeginRequest(object sender, EventArgs e)
        //{
        //    HttpCookie cookie = HttpContext.Current.Request.Cookies["Language"];
        //    if (cookie != null && cookie.Value != null)
        //    {
        //        System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo(cookie.Value);
        //        System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo(cookie.Value);
        //    }
        //    else
        //    {
        //        HttpCookie cookieLanguage = new HttpCookie("Language");
        //        cookieLanguage.Value = "km";
        //        Response.Cookies.Add(cookieLanguage);
        //        System.Threading.Thread.CurrentThread.CurrentCulture = new System.Globalization.CultureInfo("km");
        //        System.Threading.Thread.CurrentThread.CurrentUICulture = new System.Globalization.CultureInfo("km");
        //    }

        //    HttpCookie cookieFullName = HttpContext.Current.Request.Cookies["Fullname"];
        //    if (cookieFullName == null)
        //    {
        //        HttpCookie fullName = new HttpCookie("Fullname");
        //        fullName.Value = "";
        //        Response.Cookies.Add(fullName);
        //    }
        //}
    }
}
