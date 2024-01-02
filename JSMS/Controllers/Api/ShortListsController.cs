using JSMS.Models.Admin;
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
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.Applicants
                                      join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                      join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                      where ShortList.IsActive == true
                                      select new { ShortList, Applicant })
                                      .OrderByDescending(c => c.ShortList.Id).ToListAsync();
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
                                      where ShortList.IsActive == true
                                      select new { ShortList, Applicant })
                                .FirstAsync(c => c.ShortList.Id.Equals(id));
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
        public async Task<IHttpActionResult> Post(ShortList request)
        {
            try
            {
                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.Status = 1;

                if (request != null)
                {
                    context.ShortLists.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(ShortList request, int id)
        {
            try
            {
                var response = context.ShortLists.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                response.Status = 1;
                response.UpdatedAt = DateTime.Now;
                response.CreatedAt = response.CreatedAt;
                response.IsActive = true;
                response.Recruitment = request.Recruitment;
                response.Rating = request.Rating;
                response.InterviewNo = request.InterviewNo;
                response.Noted = request.Noted;
                response.CreatedBy = response.CreatedBy;
                response.CurrentDate = request.CurrentDate;

                if (response != null && request != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ហើយ..!");
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
                var response = context.ShortLists.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //context.ShortLists.Remove(response);
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់ហើយ..!​");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
