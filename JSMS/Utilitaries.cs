using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSMS
{
    public static class Utilitaries
    {
        public static string IsLinkActive(this UrlHelper url, string action, string controller)
        {
            if (url.RequestContext.RouteData.Values["controller"].ToString() == controller &&
                url.RequestContext.RouteData.Values["action"].ToString() == action)
            {
                return "active";
            }

            return "";
        }
    }
}