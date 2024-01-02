using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;


namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/behaviors")]
    public class BehaviorsController : ApiBaseController
    {
        //Behavior
        protected string confirmBy = RequestForm("ConfirmBy");
        protected string applicant = RequestForm("Applicant");
        protected string createdBy = RequestForm("CreatedBy");
        protected string currentDate = RequestForm("CurrentDate");
        protected string noted = RequestForm("Noted");

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.Applicants
                                      join Behavior in context.Behaviors on Applicant.Id equals Behavior.Applicant
                                      where Behavior.IsActive == true
                                      select new { Behavior, Applicant })
                                      .OrderByDescending(c => c.Behavior.Id).ToListAsync();
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
                                      join Behavior in context.Behaviors on Applicant.Id equals Behavior.Applicant
                                      where Behavior.IsActive == true
                                      select new { Behavior, Applicant })
                                     .FirstAsync(c => c.Behavior.Id.Equals(id));
                if (response == null)
                {
                    return NoDataFound() ;
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
        public async Task<IHttpActionResult> Post()
        {
            try
            {
                var fileName = RequestFile("Attachment", "Behavior", "~/AppData/Files", "../AppData/Files");
                var request = new Behavior()
                {
                    Applicant = int.Parse(applicant),
                    ConfirmBy = confirmBy,
                    CreatedBy = createdBy,
                    Attachment = fileName,
                    CurrentDate = DateTime.Parse(currentDate),
                    Noted = noted,
                    IsActive = true,
                    UpdatedAt = DateTime.Now,
                    CreatedAt = DateTime.Now,
                    Status = 1,
                };

                if (request != null)
                {
                    context.Behaviors.Add(request);
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់​ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(int id)
        {
            try
            {
                var response = await context.Behaviors.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound() ;
                }

                var fileName = RequestFile("Attachment", "Behavior", "~/AppData/Files", "../AppData/Files");
                if (fileName != null)
                {
                    DeleteFile(response.Attachment, "~/AppData/Files");
                    response.Attachment = fileName;
                }

                response.Status = 1;
                response.UpdatedAt = DateTime.Now;
                response.CreatedAt = response.CreatedAt;
                response.IsActive = true;
                response.ConfirmBy = confirmBy;
                response.Applicant = int.Parse(applicant);
                response.Noted = noted;
                response.CreatedBy = response.CreatedBy;
                response.CurrentDate = DateTime.Parse(currentDate);
                response.Attachment = response.Attachment;

                if (response != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់​ហើយ..!");
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
                var response = await context.Behaviors.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound() ;
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //DeleteFile(response.Attachment, "~/AppData/Files");
                    //context.Behaviors.Remove(response);
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
