using System;
using System.IO;
using System.Net;
using System.Web;
using JSMS.Models;
using System.Net.Http;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    public class BaseApiController : ApiController
    {
        public readonly ApplicationDbContext context;
        public BaseApiController()
        {
            context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                context.Dispose();
            }
            base.Dispose(disposing);
        }

        public IHttpActionResult Success(string responseMessage)
        {
            return Ok(new { message = responseMessage });
        }

        public IHttpActionResult ExistData(string responseMessage)
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = responseMessage }));
        }

        public IHttpActionResult NoDataFound()
        {
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទិន្នន័យទេ​..!" }));
        }

        public IHttpActionResult ServerError(Exception ex)
        {
            var message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
            return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message }));
        }

        //Put data 
        public static string RequestForm(string requestName)
        {
            var response = HttpContext.Current.Request.Form[requestName];
            if (response == null)
            {
                return null;
            }
            return response.ToString();
        }

        //Save file 
        public static string RequestFile(string requestName, string formatName, string uploadToPath, string showByPath)
        {
            var fileBase = HttpContext.Current.Request.Files[requestName];
            if (fileBase != null && fileBase.ContentLength > 0)
            {
                // Generate a unique filename
                var extension = Path.GetExtension(fileBase.FileName);
                var format = formatName.ToUpper() + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + extension;
                var path = Path.Combine(HttpContext.Current.Server.MapPath(uploadToPath), format);

                // Save the new file
                fileBase.SaveAs(path);

                return $"{showByPath}/{format}";
            }

            return null;
        }

        //Deletet file
        public static void DeleteFile(string responseName, string filePath)
        {
            if (responseName == null) { return; }
            //Delete Old File 
            var oldFile = Path.GetFileName(responseName);
            var oldPath = Path.Combine(HttpContext.Current.Server.MapPath(filePath), oldFile);
            if (File.Exists(oldPath))
            {
                File.Delete(oldPath);
            }
        }
    }
}
