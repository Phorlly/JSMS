using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/staffs")]
    public class StaffsController : ApiBaseController
    {

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.Applicants
                                      join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                      join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                      join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
                                      join Client in context.Clients on Staff.Client equals Client.Id
                                      where Staff.IsActive == true
                                      select new { Staff, Applicant, Client, ShortList })
                                    //.OrderByDescending(c => c.Staff.Id).ToList();
                                    .OrderBy(c => c.Staff.Code).ToListAsync();
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
                var response = await (from Applicant in context.Applicants
                                      join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                      join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                      join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
                                      join Client in context.Clients on Staff.Client equals Client.Id
                                      where Staff.IsActive == true
                                      select new { Staff, Applicant, Client, ShortList })
                                .FirstAsync(c => c.Staff.Id.Equals(id));
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

        [HttpPost]
        [Route("post")]
        public async Task<IHttpActionResult> Post(Staff request)
        {
            try
            {
                var isExist = await context.Staffs.FirstOrDefaultAsync(c => c.Code.Equals(request.Code));
                if (isExist != null)
                {
                    return MessageWithCode(400, Language.ExistCode);
                }

                var isPasses = await context.Staffs.FirstOrDefaultAsync(c => c.ShortList.Equals(request.ShortList));
                if (isPasses != null)
                {
                    return MessageWithCode(400, Language.PassesAsStaff);
                }

                if (request != null)
                {
                    context.Staffs.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success(Language.DataCreated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(Staff request, int id)
        {
            try
            {
                var response = await context.Staffs.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                var isExist = await context.Staffs.FirstOrDefaultAsync(c => c.Code.Equals(request.Code) && c.Id != id);
                if (isExist != null)
                {
                    return MessageWithCode(400, Language.ExistCode);
                }

                var isPasses = await context.Staffs.FirstOrDefaultAsync(c => c.ShortList.Equals(request.ShortList) && c.Id != id);
                if (isPasses != null)
                {
                    return MessageWithCode(400, Language.PassesAsStaff);
                }

                response.Status = request.Status;
                response.UpdatedAt = DateTime.Now;
                response.CreatedAt = response.CreatedAt;
                response.IsActive = true;
                response.ShortList = request.ShortList;
                response.Position = request.Position;
                response.Client = request.Client;
                response.MainSalary = request.MainSalary;
                response.Code = request.Code;
                response.Noted = request.Noted;
                response.CreatedBy = response.CreatedBy;
                response.CurrentDate = request.CurrentDate;

                if (request != null && response != null)
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

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public async Task<IHttpActionResult> DeleteById(int id)
        {
            try
            {
                var response = context.Staffs.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //context.Staffs.Remove(response);
                    await context.SaveChangesAsync();
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
