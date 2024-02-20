using JSMS.Models;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using JSMS.Resources;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using JSMS.Models.Admin;

namespace JSMS.Controllers.Api
{
    public class ApiBaseController : ApiController
    {
        //Create connection to databasee
        public readonly ApplicationDbContext context;
        public ApiBaseController()
        {
            //Connect to database
            context = new ApplicationDbContext();
        }

        //Disable connection
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                context.Dispose();
            }
            base.Dispose(disposing);
        }

        //Return more message and status here
        public IHttpActionResult MessageWithCode(int statusCode, string responseMessage)
        {
            switch ((HttpStatusCode)statusCode)
            {
                case HttpStatusCode.OK:
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.OK, new { message = responseMessage }));

                case HttpStatusCode.BadRequest:
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = responseMessage }));

                case HttpStatusCode.Created:
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.Created, new { message = responseMessage }));

                default:
                    // Handle other status codes
                    return ResponseMessage(Request.CreateResponse((HttpStatusCode)statusCode, new { message = responseMessage }));
            }
        }

        //Return save success or status code 200
        public IHttpActionResult Success(string responseMessage)
        {
            return Ok(new { message = responseMessage });
        }

        //Return douplicat data or status code 400
        public IHttpActionResult ExistData(string responseMessage)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = responseMessage }));
        }

        //Return not found or status code 404
        public IHttpActionResult NoDataFound()
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = Language.NotFound }));
        }

        //Return server error or status code 500
        public IHttpActionResult ServerError(Exception ex)
        {
            var message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message }));
        }

        //Request form for post data
        public static string RequestForm(string requestName)
        {
            var response = HttpContext.Current.Request.Form[requestName];
            if (response == null)
            {
                return null;
            }
            return response.ToString();
        }

        //Request single file 
        public static string RequestFile(string requestName, string uploadToPath, string pathShow)
        {
            var file = HttpContext.Current.Request.Files[requestName];
            if (file != null && file.ContentLength > 0)
            {
                // Generate a unique filename
                var originalFileName = SanitizeName(file.FileName);
                var uniqueFileName = UniqueFileName(originalFileName);
                var fileName = $"IMG_{uniqueFileName}";
                var path = Path.Combine(HttpContext.Current.Server.MapPath(uploadToPath), fileName);

                // Save the new file
                file.SaveAs(path);

                return $"{pathShow}/{fileName}";
            }

            return null;
        }

        //Request more files
        public static string RequestFiles(string pathShow, string pathUpload)
        {
            var uploadedFileUrls = new List<string>();
            var files = HttpContext.Current.Request.Files;

            if (files != null && files.Count > 0)
            {
                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];

                    if (file != null && file.ContentLength > 0)
                    {
                        var originalFileName = SanitizeName(file.FileName);
                        var extension = Path.GetExtension(originalFileName).ToLower();

                        // Check if the extension is allowed
                        if (extension.ToString() == ".pdf" || extension.ToString() == ".doc" || extension.ToString() == ".docx")
                        {
                            var uniqueFileName = UniqueFileName(originalFileName);

                            // Generate a unique filename
                            var path = Path.Combine(HttpContext.Current.Server.MapPath(pathUpload), $"DOC_{uniqueFileName}");

                            // Save the file to the server 
                            file.SaveAs(path);

                            uploadedFileUrls.Add($"{pathShow}/{uniqueFileName}");
                        }
                    }
                }

                return string.Join(",", uploadedFileUrls);
            }


            return null;
        }


        //Deletete single file
        public static void DeleteFile(string responseName, string pathFile)
        {
            if (string.IsNullOrEmpty(responseName)) return; // Check if responseName is null or empty

            // Delete Old File
            var oldFile = Path.GetFileName(responseName);
            var oldPath = Path.Combine(HttpContext.Current.Server.MapPath(pathFile), oldFile);

            if (File.Exists(oldPath))
            {
                File.Delete(oldPath);
            }
        }


        public static void DeleteFiles(string filesUrls, string pathFile)
        {
            // Split the files URLs string by comma to get individual file URLs
            string[] fileUrls = filesUrls.Split(',');

            if (fileUrls.Length > 0)
            {
                // Delete files from the file system and corresponding records from the database
                foreach (string fileUrl in fileUrls)
                {
                    // Extract the file name from the URL
                    var fileName = Path.GetFileName(fileUrl);

                    // Construct the file path on the server
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath(pathFile), fileName);

                    // Delete the file from the file system
                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                    }
                }
            }
        }


        //Add symbol underscore if has space
        public static string SanitizeName(string name)
        {
            // Replace spaces with undersore
            return Regex.Replace(name, @"\s", "_");
        }

        //Generate unique file name
        public static string UniqueFileName(string originalFileName)
        {
            var extension = Path.GetExtension(originalFileName);
            return $"{DateTime.Now:yyyy-MM-dd_fff}{extension}";
        }

        //Generate email
        public static string GenerateEmail(string username)
        {
            var random = new Random();
            string[] domains = { "gmail.com", "yahoo.com", "system.com" };
            var domain = domains[random.Next(domains.Length)];

            return $"{username}@{domain}";
        }

        //Add symbol underscore if has space
        public static string SanitizeUsername(string username)
        {
            // Replace spaces with dots
            return Regex.Replace(username, @"\s", ".");
        }

        //Combine first and last name to show full name
        public static string CombineName(string first, string last)
        {
            return first.ToUpper() + " " + last;
        }

        public static string GetAttendanceStatus(Attendance attendance, Staff staff)
        {
            if (attendance.CheckIn.HasValue)
            {
                TimeSpan checkInTime = attendance.CheckIn.Value.TimeOfDay;
                TimeSpan expectedCheckInMorning = new TimeSpan(6, 0, 0);
                TimeSpan expectedCheckInNight = new TimeSpan(18, 0, 0);
                TimeSpan shiftTolerance = new TimeSpan(0, 19, 0); // 19 minutes tolerance

                if (staff.Status == 0) // Morning shift
                {
                    if (checkInTime <= expectedCheckInMorning.Add(shiftTolerance))
                    {
                        return Language.Normal;
                    }
                    else
                    {
                        return Language.Late;
                    }
                }
                else if (staff.Status == 1) // Night shift
                {
                    if (checkInTime <= expectedCheckInNight.Add(shiftTolerance))
                    {
                        return Language.Normal;
                    }
                    else
                    {
                        return Language.Late;
                    }
                }
            }

            // If there is no check-in, consider it Early
            return Language.Normal;
        }
    }
}
