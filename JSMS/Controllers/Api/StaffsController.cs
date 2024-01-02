using JSMS.Models.Admin;
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
    public class StaffsController : BaseApiController
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
                var isExist = context.Staffs.FirstOrDefault(c => c.Code.Equals(request.Code));
                if (isExist != null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "លេខកូដនេះកំពុងប្រើហើយ​​" }));
                }

                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.PremierSalary = 15;

                if (request != null)
                {
                    context.Staffs.Add(request);
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
        public async Task<IHttpActionResult> PutById(Staff request, int id)
        {
            try
            {
                var response = await context.Staffs.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                //The same data
                if (response.Code == request.Code)
                {
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
                        context.SaveChanges();
                    }

                    return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ហើយ..!");
                }

                //Difference data
                var exist = context.Staffs.FirstOrDefault(c => c.Code.Equals(request.Code));
                if (exist == null)
                {
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

                    return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ហើយ..!");
                }
                else
                {
                    return ExistData("លេខកូដនេះកំពុងប្រើហើយ​..!​");
                }
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

                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
