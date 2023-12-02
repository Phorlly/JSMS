using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace JSMS
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //routes.LowercaseUrls = true;

            //add custom route for Addmin onl
            routes.MapRoute(
              name: "Log In",
              url: "admin/log-in",
              defaults: new { controller = "Account", action = "Login" });
            routes.MapRoute(
              name: "Log Up",
              url: "admin/log-up",
              defaults: new { controller = "Account", action = "Register" });
            routes.MapRoute(
              name: "Dashboard",
              url: "admin/dashboard",
              defaults: new { controller = "Home", action = "Index" });
            routes.MapRoute(
              name: "About Us",
              url: "admin/about-us",
              defaults: new { controller = "Home", action = "About" });
            routes.MapRoute(
              name: "Contact Us",
              url: "admin/contact-us",
              defaults: new { controller = "Home", action = "Contact" });
            routes.MapRoute(
              name: "User's Role",
              url: "admin/user-role",
              defaults: new { controller = "UserRole", action = "Index" });
            routes.MapRoute(
              name: "Client Management",
              url: "admin/client-info",
              defaults: new { controller = "Client", action = "Index" });
            routes.MapRoute(
              name: "Applicant Management",
              url: "admin/applicant-info",
              defaults: new { controller = "Applicant", action = "Index" });
            routes.MapRoute(
              name: "Gaurantor Management",
              url: "admin/guarantor-info",
              defaults: new { controller = "Gaurantor", action = "Index" });
            routes.MapRoute(
              name: "Behavior Management",
              url: "admin/behavior-info",
              defaults: new { controller = "Behavior", action = "Index" });
            routes.MapRoute(
              name: "ShortList Management",
              url: "admin/short-list-info",
              defaults: new { controller = "ShortList", action = "Index" });
            routes.MapRoute(
              name: "Staff Management",
              url: "admin/staff-info",
              defaults: new { controller = "Staff", action = "Index" });
            routes.MapRoute(
              name: "Recruitment Management",
              url: "admin/recruitment-info",
              defaults: new { controller = "Recruitment", action = "Index" });
            routes.MapRoute(
              name: "Attendance Management",
              url: "admin/attendance-info",
              defaults: new { controller = "Attendance", action = "Index" });
            routes.MapRoute(
              name: "Transaction Management",
              url: "admin/transaction-info",
              defaults: new { controller = "Transaction", action = "Index" });

            //default route
            //routes.MapRoute(
            //  name: "Default",
            //  url: "{controller}/{action}/{id}",
            //  defaults: new { controller = "Account", action = "Login", id = UrlParameter.Optional });

            //add custom route for User only
            routes.MapRoute(
                name: "Check In",
                url: "user/check-in",
                defaults: new { controller = "AttendanceBlog", action = "CheckIn" });
            routes.MapRoute(
                name: "Check Out",
                url: "user/check-out",
                defaults: new { controller = "AttendanceBlog", action = "CheckOut" });

            routes.MapRoute(
              name: "Default",
              url: "{controller}/{action}/{id}",
              defaults: new { controller = "Blog", action = "Index", id = UrlParameter.Optional });
        }
    }
}
