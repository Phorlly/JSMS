using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace JSMS.Helpers
{
    public class FormHelper 
    {
        public static string Form(string request)
        {
            var response = HttpContext.Current.Request.Form[request];
            if (response == null)
            {
                return null;
            }
            return response.ToString();
        }

        public static string SaveFile(string newFile, string fileName, string pathUpload, string pathSave)
        {
            var fileBase = HttpContext.Current.Request.Files[newFile];
            if (fileBase != null && fileBase.ContentLength > 0)
            {
                // Generate a unique filename
                var extension = Path.GetExtension(fileBase.FileName);
                var format = fileName.ToUpper() + "-" + DateTime.Now.ToString("yyyyMMddHHmmss") + extension;
                var path = Path.Combine(HttpContext.Current.Server.MapPath(pathUpload), format);

                // Save the new file
                fileBase.SaveAs(path);

                return $"{pathSave}/{format}";
            }

            return null;
        }

        public static void DeleteFile(string fileName, string filePath)
        {
            if (fileName == null) { return; }
            //Delete Old File 
            var oldFile = Path.GetFileName(fileName);
            var oldPath = Path.Combine(HttpContext.Current.Server.MapPath(filePath), oldFile);
            if (File.Exists(oldPath))
            {
                File.Delete(oldPath);
            }
        }
    }
}