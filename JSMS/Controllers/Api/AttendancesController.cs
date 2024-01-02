using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Services.Description;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/attendances")]
    public class AttendancesController : BaseApiController
    {
        [HttpGet]
        [Route("get")]
        public IHttpActionResult GetAttendance()
        {
            try
            {
                var response = (from Attendance in context.Attendances
                                join Staff in context.Staffs on Attendance.Staff equals Staff.Id
                                join ShortList in context.ShortLists on Staff.ShortList equals ShortList.Id
                                join Recruitment in context.Recruitments on ShortList.Recruitment equals Recruitment.Id
                                join Applicant in context.Applicants on Recruitment.Applicant equals Applicant.Id
                                where Attendance.IsActive.Equals(true)
                                select new { Attendance, Staff, Applicant }).OrderByDescending(c => c.Attendance.Id).ToList()  // Materialize the data
                               .Select(c => new { c.Attendance, c.Staff, Status = GetAttendanceStatus(c.Attendance, c.Staff), c.Applicant }).ToList();

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
        [Route("get-by-id/{id}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            try
            {
                var response = await (from Attendance in context.Attendances
                                      join Staff in context.Staffs on Attendance.Staff equals Staff.Id
                                      where Attendance.IsActive.Equals(true)
                                      select new { Attendance, Staff })
                                      .FirstAsync(c => c.Attendance.Id == id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else { return Ok(response); }
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPost]
        [Route("post")]
        [Obsolete]
        public async Task<IHttpActionResult> Post(Attendance request)
        {
            try
            {
                var isExist = await context.Attendances.FirstOrDefaultAsync(a => a.Staff == request.Staff &&
                                                                      a.CheckIn != null &&
                              DbFunctions.TruncateTime(a.CheckIn) == DbFunctions.TruncateTime(request.CheckIn));
                if (isExist != null)
                {
                    return ExistData("បុគ្គលិកមួយនេះបានកត់ត្រាចូលរួចហើយ សម្រាប់នៅថ្ងៃនេះ​​..!");
                }

                //Insert default data
                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.Status = 1;
                request.Noted = request.Noted == "" ? "Thank you for checking attendance!" : request.Noted;

                if (request != null)
                {
                    context.Attendances.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPost]
        [Route("post-check-in")]
        public async Task<IHttpActionResult> PostCheckIn(Attendance request)
        {
            try
            {
                // Get the current date without the time component
                var currentDate = DateTime.Now.Date;

                // Check if there's an existing check-in for the same staff member on the current date
                var isExist = await context.Attendances.FirstOrDefaultAsync(m => m.Staff == request.Staff &&
                              m.CheckIn.HasValue && DbFunctions.TruncateTime(m.CheckIn) == currentDate);
                if (isExist != null)
                {
                    return ExistData("បុគ្គលិកមួយនេះបានកត់ត្រាចូលរួចហើយ សម្រាប់នៅថ្ងៃនេះ​​..!");
                }

                //Insert default data
                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.Status = 1;
                request.Noted = "Thank you for checking attendance!";
                request.Location = request.Location.ToString() == "" ? "Tramkak, Takeo" : request.Location;
                request.CreatedBy = "admin@system.com";
                request.CheckIn = DateTime.Now;
                request.CheckOut = null;

                if (request != null)
                {
                    context.Attendances.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success("សូមអរគុណ សម្រាប់ការកត់ត្រាចូល..!");

            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(Attendance request, int id)
        {
            try
            {
                var response = await context.Attendances.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                response.Status = 1;
                response.UpdatedAt = DateTime.Now;
                response.CreatedAt = response.CreatedAt;
                response.IsActive = true;
                response.Staff = request.Staff;
                response.CheckIn = request.CheckIn;
                response.CheckOut = request.CheckOut;
                response.Noted = request.Noted == "" ? "Thank you for checking attendance!" : request.Noted;
                response.CreatedBy = response.CreatedBy;

                if (response != null && request != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-ckeck-out")]
        public async Task<IHttpActionResult> PutCkeckOutById(Attendance request)
        {
            try
            {
                // Get the current date without the time component
                var currentDate = DateTime.Now.Date;

                // Check if there's an existing check-in for the same staff member on the current date
                var isExist = await context.Attendances
                      .FirstOrDefaultAsync(m => m.Staff == request.Staff &&
                                           m.CheckIn.HasValue && DbFunctions.TruncateTime(m.CheckIn) == currentDate);

                if (isExist != null)
                {
                    // Check if there's already a check-out for the existing check-in
                    if (isExist.CheckOut.HasValue)
                    {
                        return ExistData("បុគ្គលិកមួយនេះបានកត់ត្រាចេញរួចហើយ សម្រាប់នៅថ្ងៃនេះ​​..!");
                    }

                    // Update the existing check-in record with the check-out time
                    isExist.Status = 2;
                    isExist.UpdatedAt = DateTime.Now;
                    isExist.CreatedAt = isExist.CreatedAt;
                    isExist.IsActive = true;
                    isExist.Staff = request.Staff;
                    isExist.CheckIn = isExist.CheckIn;
                    isExist.CheckOut = DateTime.Now;
                    isExist.Noted = isExist.Noted;
                    isExist.Location = isExist.Location;
                    isExist.CreatedBy = isExist.CreatedBy;

                    if (request != null)
                    {
                        context.Entry(isExist).State = EntityState.Modified;
                        await context.SaveChangesAsync();
                    }
                }
                else
                {
                    // No existing check-in found for the day
                    return ExistData("បុគ្គលិកមួយនេះមិនទាន់បានកត់ត្រាចូលនៅឡើយទេ? សម្រាប់នៅថ្ងៃនេះ​​");
                }

                return Success("សូមអរគុណ សម្រាប់ការកត់ត្រាចេញ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]

        public async Task<IHttpActionResult> DeleteById(int id)
        {
            try
            {
                var response = await context.Attendances.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;  //reponse.IsActive = false => Deleted   
                    response.DeletedAt = DateTime.Now;
                    context.Attendances.Remove(response); //==> Delete From database
                    context.SaveChanges();
                }
                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        public string GetAttendanceStatus(Attendance attendance, Staff staff)
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
                        return "ធម្មតា";
                    }
                    else
                    {
                        return "យឺត";
                    }
                }
                else if (staff.Status == 1) // Night shift
                {
                    if (checkInTime <= expectedCheckInNight.Add(shiftTolerance))
                    {
                        return "ធម្មតា";
                    }
                    else
                    {
                        return "យឺត";
                    }
                }
            }

            // If there is no check-in, consider it Early
            return "ធម្មតា";
        }
    }
}
