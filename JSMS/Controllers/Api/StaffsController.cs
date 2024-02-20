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
        [Route("reads")]
        public async Task<IHttpActionResult> Reads()
        {
            try
            {
                var response = await (from applicant in context.JobApplicants
                                      join shortList in context.ShortLists on applicant.Id equals shortList.Applicant
                                      join staff in context.Staffs on shortList.Id equals staff.ShortList
                                      join client in context.Clients on staff.Client equals client.Id
                                      where staff.IsActive == true
                                      select new
                                      {
                                          staff,
                                          applicant,
                                          client,
                                          shortList
                                      }).OrderBy(c => c.staff.Code).ToListAsync();

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
                var response = await (from applicant in context.JobApplicants
                                      join shortList in context.ShortLists on applicant.Id equals shortList.Applicant
                                      join staff in context.Staffs on shortList.Id equals staff.ShortList
                                      join client in context.Clients on staff.Client equals client.Id
                                      where staff.IsActive == true
                                      select new
                                      {
                                          staff,
                                          applicant,
                                          client,
                                          shortList
                                      }).FirstAsync(c => c.staff.Id.Equals(id));

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
        public async Task<IHttpActionResult> Create(Staff request)
        {
            try
            {

                var isExist = await context.Staffs.SingleOrDefaultAsync(c => c.Code == request.Code);
                if (isExist != null) return MessageWithCode(400, Language.ExistCode);

                var isPassed = await context.Staffs.FirstOrDefaultAsync(c => c.ShortList == request.ShortList);
                if (isPassed != null) return MessageWithCode(400, Language.PassesAsStaff);

                var setStatus = await context.ShortLists.SingleOrDefaultAsync(c => c.Id == request.ShortList);
                if (setStatus == null) return NoDataFound();
                setStatus.Status = 4;

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
        [Route("update/{id}")]
        public async Task<IHttpActionResult> Update(Staff request, int id)
        {
            try
            {
                var response = await context.Staffs.FindAsync(id);
                if (response == null) return NoDataFound();

                var isExist = await context.Staffs.FirstOrDefaultAsync(c => c.Code.Equals(request.Code) && c.Id != id);
                if (isExist != null) return MessageWithCode(400, Language.ExistCode);

                var isPasses = await context.Staffs.FirstOrDefaultAsync(c => c.ShortList.Equals(request.ShortList) && c.Id != id);
                if (isPasses != null) return MessageWithCode(400, Language.PassesAsStaff);

                var oldStatus = await context.ShortLists.FirstOrDefaultAsync(c => c.Id == response.ShortList);
                if (oldStatus == null) return NoDataFound();
                oldStatus.Status = 3;

                var newStatus = await context.ShortLists.FirstOrDefaultAsync(c => c.Id == request.ShortList);
                if (newStatus == null) return NoDataFound();
                newStatus.Status = 4;

                response.Status = request.Status;
                response.UpdatedAt = DateTime.Now;
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
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                var response = context.Staffs.Find(id);
                if (response == null) return NoDataFound();

                response.IsActive = false;
                response.DeletedAt = DateTime.Now;
                //context.Staffs.Remove(response);
                await context.SaveChangesAsync();

                return Success(Language.DataDeleted);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
