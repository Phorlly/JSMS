using JSMS.Models.Admin;
using System;
using System.Text.RegularExpressions;

namespace JSMS.Helpers
{
    public enum Roles
    {
        AdminOrHR,
        Accounting,
        Staff,
        Customer,
        User
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

        public Global()
        {
            CreatedAt = DateTime.Now;
            UpdatedAt = DateTime.Now;
            Status = 1;
            IsActive = true;
        }
    }

    public enum HttpStatusCode
    {
        Continue = 100,
        SwitchingProtocols = 101,
        OK = 200,
        Created = 201,
        Accepted = 202,
        NonAuthoritativeInformation = 203,
        NoContent = 204,
        ResetContent = 205,
        PartialContent = 206,
        MultipleChoices = 300,
        Ambiguous = 300,
        MovedPermanently = 301,
        Moved = 301,
        Found = 302,
        Redirect = 302,
        SeeOther = 303,
        RedirectMethod = 303,
        NotModified = 304,
        UseProxy = 305,
        Unused = 306,
        RedirectKeepVerb = 307,
        TemporaryRedirect = 307,
        PermanentRedirect = 308,
        BadRequest = 400,
        Unauthorized = 401,
        PaymentRequired = 402,
        Forbidden = 403,
        NotFound = 404,
        MethodNotAllowed = 405,
        NotAcceptable = 406,
        ProxyAuthenticationRequired = 407,
        RequestTimeout = 408,
        Conflict = 409,
        Gone = 410,
        LengthRequired = 411,
        PreconditionFailed = 412,
        RequestEntityTooLarge = 413,
        RequestUriTooLong = 414,
        UnsupportedMediaType = 415,
        RequestedRangeNotSatisfiable = 416,
        ExpectationFailed = 417,
        UpgradeRequired = 426,
        InternalServerError = 500,
        NotImplemented = 501,
        BadGateway = 502,
        ServiceUnavailable = 503,
        GatewayTimeout = 504,
        HttpVersionNotSupported = 505,
    }

    public class EmailGenerator
    {
        private static readonly Random random = new Random();
        private static readonly string[] domains = { "gmail.com", "yahoo.com", "system.com" };


        public static string GenerateEmail(string username)
        {
            //string randomName = GenerateRandomString(8).ToLower(); // Generate a lowercase 8-character random string
            //string randomDomain = GenerateRandomString(5).ToLower(); // Generate a lowercase 5-character random string as the domain
            string domain = domains[random.Next(domains.Length)]; // You can replace this with your preferred domain

            return $"{username}@{domain}";
        }

        public static string SanitizeUsername(string username)
        {
            // Replace spaces with dots
            return Regex.Replace(username, @"\s", ".");
        }

        //private static string GenerateRandomString(int length)
        //{
        //    const string characters = "abcdefghijklmnopqrstuvwxyz";
        //    char[] result = new char[length];

        //    for (int i = 0; i < length; i++)
        //    {
        //        result[i] = characters[random.Next(characters.Length)];
        //    }

        //    return new string(result);
        //}
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