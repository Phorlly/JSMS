using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/attendances")]
    public class AttendancesController : ApiBaseController
    {
        [HttpGet]
        [Route("reads")]
        public IHttpActionResult Reads()
        {
            try
            {
                var response = (from attendance in context.Attendances
                                join staff in context.Staffs on attendance.Staff equals staff.Id
                                join shortList in context.ShortLists on staff.ShortList equals shortList.Id
                                join applicant in context.JobApplicants on shortList.Applicant equals applicant.Id
                                where attendance.IsActive.Equals(true)
                                select new
                                {
                                    attendance,
                                    staff,
                                    applicant
                                }).OrderByDescending(c => c.attendance.Id).ToList()  // Materialize the data
                               .Select(c => new
                               {
                                   c.attendance,
                                   c.staff,
                                   Status = GetAttendanceStatus(c.attendance, c.staff),
                                   location = context.Clients.SingleOrDefault(a => a.Id == c.staff.Client),
                                   c.applicant
                               }).ToList();

                if (response == null) return NoDataFound();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpGet]
        [Route("read/{id}")]
        public async Task<IHttpActionResult> Read(int id)
        {
            try
            {
                var response = await (from attendance in context.Attendances
                                      join staff in context.Staffs on attendance.Staff equals staff.Id
                                      where attendance.IsActive.Equals(true)
                                      select new
                                      {
                                          attendance,
                                          staff
                                      }).FirstAsync(c => c.attendance.Id == id);

                if (response == null) return NoDataFound();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPost]
        [Route("create")]
        public async Task<IHttpActionResult> Create(Attendance request) 
        {
            try
            {
                var isExist = await context.Attendances.FirstOrDefaultAsync(a => a.Staff == request.Staff && a.CheckIn != null &&
                                            DbFunctions.TruncateTime(a.CheckIn) == DbFunctions.TruncateTime(request.CheckIn));
                if (isExist != null) return ExistData(Language.AlreadyCheckIn);

                //Insert default data
                request.Noted = request.Noted == "" ? Language.ThankYou : request.Noted;

                if (request != null)
                {
                    context.Attendances.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success(Language.DataCreated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPost]
        [Route("check-in")]
        public async Task<IHttpActionResult> CheckIn(Attendance request) 
        {
            try
            {
                // Get the current date without the time component
                var currentDate = DateTime.Now.Date;

                // Check if there's an existing check-in for the same staff member on the current date
                var isExist = await context.Attendances.FirstOrDefaultAsync(m => m.Staff == request.Staff &&
                                                                                 m.CheckIn.HasValue && DbFunctions.TruncateTime(m.CheckIn) == currentDate);
                if (isExist != null) return ExistData(Language.AlreadyCheckIn);

                //Insert default data
                request.Noted = request.Noted == "" ? Language.ThankYou : request.Noted;
                request.Location = request.Location.ToString() == "" ? "Tramkak, Takeo" : request.Location;
                request.CreatedBy = "admin@system.com";
                request.CheckIn = DateTime.Now;
                request.CheckOut = null;

                if (request != null)
                {
                    context.Attendances.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success(Language.ThankYouIn);

            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IHttpActionResult> Update(Attendance request, int id) 
        {
            try
            {
                var response = await context.Attendances.FindAsync(id);
                if (response == null) return NoDataFound();

                response.UpdatedAt = DateTime.Now;
                response.Staff = request.Staff;
                response.CheckIn = request.CheckIn;
                response.CheckOut = request.CheckOut;
                response.Noted = request.Noted == "" ? Language.ThankYou : request.Noted;
                response.CreatedBy = response.CreatedBy;

                if (response != null && request != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                return Success(Language.DataUpdated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("check-out")]
        public async Task<IHttpActionResult> CkeckOut(Attendance request)  
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
                        return ExistData(Language.AlreadyCheckIn);
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
                    return ExistData(Language.NotYetIn);
                }

                return Success(Language.ThankYouOut);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]

        public async Task<IHttpActionResult> Delete(int id)
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
                return Success(Language.DataDeleted);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
