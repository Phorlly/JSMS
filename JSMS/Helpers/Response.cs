using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;

namespace JSMS.Helpers
{
    public static class Response
    {
        public static int Status { get; set; }
        public static string Message { get; set; }
    }

    public class UploadFile 
    {
        public string SaveFiles(HttpPostedFileBase nameFile)
        {
            // Save the uploaded image
            if (imageFile != null && imageFile.ContentLength > 0)
            {
                //Save new file
                var fileName = Path.GetFileName(nameFile.FileName);
                var format = fileName + DateTime.Now.ToString("-yyyy-MM-dd-HH-mm-ss");
                var extension = Path.GetExtension(nameFile.FileName);
                var path = Path.Combine(HttpContext.Current.Server.MapPath("~/Images/"), format);
                name = "~/Images/" + format;
                imageFile.SaveAs(path);

                //Delete Old file
                var oldFilePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), name);
                if (File.Exists(oldFilePath))
                {
                    File.Delete(oldFilePath);
                }
            }
        }
    }
}