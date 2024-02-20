using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/short-lists")]
    public class ShortListsController : ApiBaseController
    {

        [HttpGet]
        [Route("reads")]
        public async Task<IHttpActionResult> Reads()
        {
            try
            {
                var response = await (from applicant in context.JobApplicants
                                      join shortList in context.ShortLists on applicant.Id equals shortList.Applicant
                                      where shortList.IsActive == true
                                      select new
                                      {
                                          shortList,
                                          applicant
                                      }).OrderByDescending(c => c.shortList.Id).ToListAsync();

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
                                      where shortList.IsActive == true
                                      select new
                                      {
                                          shortList,
                                          applicant
                                      }).FirstAsync(c => c.shortList.Id.Equals(id));

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
        public async Task<IHttpActionResult> Create(ShortList request)
        {
            try
            {
                var isExist = await context.ShortLists.FirstOrDefaultAsync(c => c.Applicant == request.Applicant);
                if (isExist != null) return MessageWithCode(400, Language.ExistShorList);

                var setStatus = await context.JobApplicants.FindAsync(request.Applicant);
                if (setStatus == null) return NoDataFound();

                setStatus.Status = 2;
                request.Noted = request.Noted == "" ? Language.Selecting : request.Noted;

                if (request != null)
                {
                    context.ShortLists.Add(request);
                    context.Entry(setStatus).State = EntityState.Modified;
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
        public async Task<IHttpActionResult> Update(ShortList request, int id)
        {
            try
            {
                var response = context.ShortLists.Find(id);
                if (response == null) return NoDataFound();

                var isExist = await context.ShortLists.FirstOrDefaultAsync(c => c.Applicant == request.Applicant && c.Id != id);
                if (isExist != null) return MessageWithCode(400, Language.ExistShorList);

                var oldStatus = await context.JobApplicants.FirstOrDefaultAsync(c => c.Id == response.Applicant);
                if (oldStatus == null) return NoDataFound();
                oldStatus.Status = 1;

                var newStatus = await context.JobApplicants.FirstOrDefaultAsync(c => c.Id == request.Applicant);
                if (oldStatus == null) return NoDataFound();
                newStatus.Status = 2;

                response.UpdatedAt = DateTime.Now;
                response.Applicant = request.Applicant;
                response.Rating = request.Rating;
                response.InterviewNo = request.InterviewNo;
                response.Noted = request.Noted == "" ? Language.Selecting : request.Noted;
                response.CreatedBy = response.CreatedBy;
                response.CurrentDate = request.CurrentDate;

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

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                var response = context.ShortLists.Find(id);
                if (response == null) return NoDataFound();

                response.IsActive = false;
                response.DeletedAt = DateTime.Now;
                //context.ShortLists.Remove(response);
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
