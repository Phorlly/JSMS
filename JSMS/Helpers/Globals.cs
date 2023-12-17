using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;

namespace JSMS.Helpers
{
    public enum Roles
    {
        AdminOrHR,
        Accounting,
        SupperAdmin,
        Customer,
        User
    }

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
    public class Global
    {
        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public int Status { get; set; }
        public bool IsActive { get; set; }
        public string Noted { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }


    public class EmailGenerator
    {
        private static readonly Random random = new Random();
        private static readonly string[] domains = { "gmail.com", "yahoo.com", "hotmail.com", "example.com" };


        public static string GenerateEmail()
        {
            string randomName = GenerateRandomString(8).ToLower(); // Generate a lowercase 8-character random string
            string randomDomain = GenerateRandomString(5).ToLower(); // Generate a lowercase 5-character random string as the domain
            string domain = domains[random.Next(domains.Length)]; // You can replace this with your preferred domain

            return $"{randomName}@{randomDomain}.{domain}";
        }

        private static string GenerateRandomString(int length)
        {
            const string characters = "abcdefghijklmnopqrstuvwxyz";
            char[] result = new char[length];

            for (int i = 0; i < length; i++)
            {
                result[i] = characters[random.Next(characters.Length)];
            }

            return new string(result);
        }
    }

    public static class CodeGenerator
    {
        //private static readonly ApplicationDbContext context = new ApplicationDbContext();

        //public static string GenerateCode(string keyWord, string tableName)
        //{
        //    var dbSet = context.GetType().GetProperty(tableName);
        //    if (dbSet == null)
        //    {
        //        return "Table not found in Context";
        //    }

        //    var table = (IQueryable<object>)dbSet.GetValue(context);
        //    var existCode = table.Max(c => c.GetType().GetProperty("Code").GetValue(c).ToString());
        //    if (existCode != null)
        //    {
        //        int number = int.Parse(existCode.Split('-')[1]) + 1;
        //        string newCode = $"{keyWord.ToUpper()}-{number.ToString("D5")}";

        //        return newCode;
        //    }
        //    else
        //    {
        //        return $"{keyWord.ToUpper()}-00001";
        //    }
        //}

        public class CombinedData
        {
            public Applicant Applicant { get; set; }
            public Gaurantor Gaurantor { get; set; }
            public Province CProvince { get; set; }
            public District CDistrict { get; set; }
            public Commune CCommune { get; set; }
            public Village CVillage { get; set; }
            public Province BProvince { get; set; }
            public District BDistrict { get; set; }
            public Commune BCommune { get; set; }
            public Village BVillage { get; set; }
        }

    }
}