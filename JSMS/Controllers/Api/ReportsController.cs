using ImageResizer.Plugins.Basic;
using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/reports")]
    public class ReportsController : ApiController
    {
        protected readonly ApplicationDbContext context;

        public ReportsController()
        {
            context = new ApplicationDbContext();
        }

        [HttpGet]
        [Route("get-attendance")]
        public IHttpActionResult GetAttendanceReport(string monthYear, int? staff = null, int? shift = null)
        {
            try
            {
                if (!DateTime.TryParseExact(monthYear, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                {
                    return BadRequest("Invalid date format. Please provide the date in yyyy-MM format.");
                }

                var startOfMonth = new DateTime(date.Year, date.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(0).Date;

                // Generate a list of dates from 1 to the last day of the month
                //var dateRange = Enumerable.Range(1, endOfMonth.Day).Select(day => new DateTime(date.Year, date.Month, day)).ToList(); ;

                var response = (from staffEntity in context.Staffs
                                join shortList in context.ShortLists on staffEntity.ShortList equals shortList.Id
                                join recruitment in context.Recruitments on shortList.Recruitment equals recruitment.Id
                                join applicant in context.Applicants on recruitment.Applicant equals applicant.Id
                                join attendance in context.Attendances on staffEntity.Id equals attendance.Staff

                                where attendance.CheckIn >= startOfMonth && attendance.CheckIn <= endOfMonth
                                select new
                                {
                                    Name = applicant.Name + " " + applicant.NickName,
                                    Code = staffEntity.Code.ToString(),
                                    Shift = staffEntity.Status == 0 ? "ថ្ងៃ" : "យប់",
                                    Location = staffEntity.Noted,
                                    attendance.CheckIn,
                                    attendance.CheckOut,
                                    Total = attendance.CheckIn == null ? 0 : 1,
                                    Staff = staffEntity,
                                    //AttendanceDate = attendance.CheckIn != null ? DbFunctions.TruncateTime(attendance.CheckIn) : (DateTime?)null
                                }).Where(record => (staff == null || record.Staff.Id == staff) &&
                                                   (shift == null || record.Staff.Status == shift)).ToList();

                //dateRange.Contains(record.AttendanceDate.HasValue ? (DateTime)record.AttendanceDate : default(DateTime)))
                //.GroupBy(record => new
                //{
                //    Name = record.Name.ToString(),
                //    Code = record.Code.ToString(),
                //    Shift = record.Shift.ToString(),
                //    Status = record.IOStatus,
                //    Location = record.Location.ToString()
                //})
                //.Select(group => new
                //{
                //    Name = group.Key.Name.ToString(),
                //    Code = group.Key.Code.ToString(),
                //    Shift = group.Key.Shift.ToString(),
                //    Location = group.Key.Location.ToString(),
                //    TotalWorked = group.Sum(record => record.IOStatus),
                //    NetSalary = CalculateNetSalary(group.Key.Code, startOfMonth, endOfMonth)
                //}).ToList();

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message }));
            }
        }


        [HttpGet]
        [Route("get-stock")]
        public IHttpActionResult GetStockReport(string monthYear, int? product = null, int? stock = null)
        {
            try
            {
                if (!DateTime.TryParseExact(monthYear, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                {
                    return BadRequest("Invalid date format. Please provide the date in yyyy-MM format.");
                }

                var startOfMonth = new DateTime(date.Year, date.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(0).Date;

                var response = (from Product in context.Products
                                join Transaction in context.StockTransactions on Product.Id equals Transaction.Product
                                //join Stock in context.Stocks on Product.Id equals Stock.Product

                                where (Product.IsActive.Equals(true) && Transaction.IsActive.Equals(true)) &&
                                      (Transaction.Date >= startOfMonth && Transaction.Date <= endOfMonth)
                                select new
                                {
                                    Product.Name,
                                    Transaction.Status,
                                    Transaction.Quantity, 
                                    Transaction.Date,
                                    Noted = Transaction.Noted == null ? Product.Noted : Transaction.Noted,
                                    Stock = Transaction,
                                }).Where(record => (product == null || record.Stock.Product == product) &&
                                                   (stock == null || record.Stock.Status == stock)).ToList();

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message }));
            }
        }


        //private decimal CalculateNetSalary(string staffCode, DateTime startOfMonth, DateTime endOfMonth)
        //{
        //    var staff = context.Staffs.SingleOrDefault(s => s.Code == staffCode);

        //    if (staff == null)
        //    {
        //        // Handle the case where staff is not found
        //        return 0;
        //    }

        //    var attendance = context.Attendances
        //        .Where(a => a.Staff == staff.Id && a.CheckIn >= startOfMonth && a.CheckIn <= endOfMonth)
        //        .ToList();

        //    // Use the SalaryCalculator to calculate net salary
        //    return (decimal)staff.MainSalary;
        //}

    }
}
