using JSMS.Helpers;
using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/reports")]
    public class ReportsController : ApiBaseController
    {
        private readonly GetAttendanceReport getAttendance;

        public ReportsController()
        {
            getAttendance = new GetAttendanceReport();
        }

        [HttpGet]
        [Route("get-attendance")]
        public async Task<IHttpActionResult> GetAttendanceReport(string monthYear, int? staff = null, int? shift = null)
        {
            try
            {
                if (!DateTime.TryParseExact(monthYear, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                {
                    return BadRequest("Invalid date format. Please provide the date in yyyy-MM format.");
                }

                var startOfMonth = new DateTime(date.Year, date.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1);

                var response = await (from staffEntity in context.Staffs
                                      join shortList in context.ShortLists on staffEntity.ShortList equals shortList.Id
                                      join recruitment in context.Recruitments on shortList.Recruitment equals recruitment.Id
                                      join applicant in context.Applicants on recruitment.Applicant equals applicant.Id
                                      join attendance in context.Attendances on staffEntity.Id equals attendance.Staff

                                      where (attendance.CheckIn.HasValue && attendance.CheckIn >= startOfMonth && attendance.CheckIn <= endOfMonth)
                                      //(attendance.CheckOut.HasValue && attendance.CheckOut >= startOfMonth && attendance.CheckOut <= endOfMonth)
                                      select new
                                      {
                                          Name = applicant.Name + " " + applicant.NickName,
                                          Code = staffEntity.Code.ToString(),
                                          Shift = staffEntity.Status == 0 ? Language.Morning : Language.Night,
                                          Location = staffEntity.Noted,
                                          attendance.CheckIn,
                                          attendance.CheckOut,
                                          Total = attendance.CheckIn == null ? 0 : 1,
                                          Staff = staffEntity,

                                      }).Where(record => (staff == null || record.Staff.Id == staff) &&
                                                         (shift == null || record.Staff.Status == shift))
                                  .ToListAsync();
                if (response == null)
                {
                    return NoDataFound();
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpGet]
        [Route("get-salary")]
        public IHttpActionResult GetSalaryByAttendance(DateTime start, DateTime end, int? staff = null, int? shift = null)
        {
            try
            {
                var record = getAttendance.GetAttendanceData(start, end, staff);
                int totalWorkedDays = getAttendance.CountPresentDays(start, end, staff);
                int totalAbsentDays = getAttendance.CountAbsentDays(start, end, staff);
                decimal salary = getAttendance.GetSalaryPayment(context.Staffs.ToList(), totalAbsentDays, staff);
                var response = GetSalaryQuery(start, end, staff, shift, totalWorkedDays, totalAbsentDays, salary);

                if (totalWorkedDays == 0 || staff == null)
                {
                    return NoDataFound();
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpGet]
        [Route("get-stock")]
        public async Task<IHttpActionResult> GetStockReport(string monthYear, int? product = null, int? stock = null)
        {
            try
            {
                if (!DateTime.TryParseExact(monthYear, "yyyy-MM", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime date))
                {
                    return BadRequest("Invalid date format. Please provide the date in yyyy-MM format.");
                }

                var startOfMonth = new DateTime(date.Year, date.Month, 1);
                var endOfMonth = startOfMonth.AddMonths(1).AddDays(-1);

                var response = await (from Product in context.Products
                                      join Stock in context.Stocks on Product.Id equals Stock.Product

                                      where (Product.IsActive.Equals(true) && Stock.IsActive.Equals(true)) &&
                                            (Stock.Date >= startOfMonth && Stock.Date <= endOfMonth)
                                      select new
                                      {
                                          Product.Name,
                                          Stock.Status,
                                          Stock.Quantity,
                                          Stock.Date,
                                          Noted = Stock.Noted ?? Stock.Noted,
                                          Stock,
                                      }).Where(record => (product == null || record.Stock.Product == product) &&
                                                         (stock == null || record.Stock.Status == stock)).ToListAsync();

                if (response == null)
                {
                    return NoDataFound();
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }


        //Get all record by attendance
        private List<object> GetSalaryQuery(DateTime start, DateTime end, int? staff, int? shift, int totalWorkedDays, int totalAbsentDays, decimal salary)
        {
            var query = (from staffEntity in context.Staffs
                         join shortList in context.ShortLists on staffEntity.ShortList equals shortList.Id
                         join recruitment in context.Recruitments on shortList.Recruitment equals recruitment.Id
                         join applicant in context.Applicants on recruitment.Applicant equals applicant.Id
                         join attendance in context.Attendances on staffEntity.Id equals attendance.Staff

                         where staffEntity.IsActive.Equals(true) &&
                              (attendance.CheckIn.HasValue && attendance.CheckIn >= start && attendance.CheckIn <= end)
                         select new
                         {
                             staffEntity.Id,
                             Name = applicant.Name + " " + applicant.NickName,
                             Code = staffEntity.Code.ToString(),
                             Shift = staffEntity.Status == 0 ? Language.Morning : Language.Night,
                             Location = staffEntity.Noted,
                             TotalWorkedDays = totalWorkedDays,
                             TotalAbsentDays = totalAbsentDays,
                             SalaryPayment = salary,
                             Staff = staffEntity
                         });

            var filteredQuery = query
                .Where(record => (staff == null || record.Staff.Id == staff) &&
                                 (shift == null || record.Staff.Status == shift))
                .ToList();

            var groupedQuery = filteredQuery
                .GroupBy(record => new
                {
                    record.Id,
                    Name = record.Name.ToString(),
                    Code = record.Code.ToString(),
                    Shift = record.Shift.ToString(),
                    Location = record.Location.ToString(),
                    record.TotalWorkedDays,
                    record.TotalAbsentDays,
                    record.SalaryPayment,
                })
               .Select(group => new
               {
                   group.Key.Id,
                   FullName = group.Key.Name.ToString(),
                   Code = group.Key.Code.ToString(),
                   Shift = group.Key.Shift.ToString(),
                   Location = group.Key.Location.ToString(),
                   TotalWorked = group.Key.TotalWorkedDays,
                   TotalAbsent = group.Key.TotalAbsentDays,
                   TotalPayment = group.Key.SalaryPayment,
               }).ToList();


            // Convert the result to List<object>
            return groupedQuery.Cast<object>().ToList();
        }

    }
}
