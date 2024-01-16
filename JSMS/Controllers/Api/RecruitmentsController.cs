using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/recruitments")]
    public class RecruitmentsController : ApiBaseController
    {

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.Applicants
                                      join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                      join Gaurantor in context.Gaurantors on Recruitment.Gaurantor equals Gaurantor.Id
                                      where Gaurantor.IsActive == true
                                      select new { Recruitment, Gaurantor, Applicant })
                                     .OrderByDescending(c => c.Recruitment.Id).ToListAsync();
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
                                      join Gaurantor in context.Gaurantors on Recruitment.Gaurantor equals Gaurantor.Id
                                      where Recruitment.IsActive == true
                                      select new { Recruitment, Gaurantor, Applicant })
                                      .FirstAsync(c => c.Recruitment.Id.Equals(id));
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
        public async Task<IHttpActionResult> Post(Recruitment request)
        {
            try
            {
                var isExist = await context.Recruitments.FirstOrDefaultAsync(c => c.Applicant == request.Applicant);
                if (isExist != null)
                {
                    return MessageWithCode(400, Language.ExistRecruitment);
                }

                if (request != null)
                {
                    context.Recruitments.Add(request);
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
        public async Task<IHttpActionResult> PutById(Recruitment request, int id)
        {
            try
            {
                var response = await context.Recruitments.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                var isExist = await context.Recruitments.FirstOrDefaultAsync(c => c.Applicant == request.Applicant && c.Id != id);
                if (isExist != null)
                {
                    return MessageWithCode(400, Language.ExistRecruitment);
                }

                response.UpdatedAt = DateTime.Now;
                response.Gaurantor = request.Gaurantor;
                response.Applicant = request.Applicant;
                response.Noted = request.Noted;
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
        [Route("delete-by-id/{id}")]
        public async Task<IHttpActionResult> DeleteById(int id)
        {
            try
            {
                var response = await context.Recruitments.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    //response.DeletedAt = DateTime.Now;
                    //context.Recruitments.Remove(response);
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
