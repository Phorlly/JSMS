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
    public class BehaviorsController : ApiController
    {
        protected readonly ApplicationDbContext context;
        //Behavior
        protected string confirmBy = FormHelper.Form("ConfirmBy");
        protected string applicant = FormHelper.Form("Applicant");
        protected string createdBy = FormHelper.Form("CreatedBy");
        protected string currentDate = FormHelper.Form("CurrentDate");
        protected string noted = FormHelper.Form("Noted");

        public BehaviorsController()
        {
            context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                context.Dispose();
            }
            base.Dispose(disposing);
        }

        [HttpGet]
        [Route("get")]
        public IHttpActionResult Get()
        {
            try
            {
                var response = (from Applicant in context.Applicants
                                join Behavior in context.Behaviors on Applicant.Id equals Behavior.Applicant
                                where Behavior.IsActive == true
                                select new { Behavior, Applicant })
                                .OrderByDescending(c => c.Behavior.Id).ToList();
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpGet]
        [Route("get-by-id/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var response = (from Applicant in context.Applicants
                                join Behavior in context.Behaviors on Applicant.Id equals Behavior.Applicant
                                where Behavior.IsActive == true
                                select new { Behavior, Applicant })
                               .FirstOrDefault(c => c.Behavior.Id.Equals(id));
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPost]
        [Route("post")]
        public async Task<IHttpActionResult> Post()
        {
            try
            {
                var fileName = FormHelper.SaveFile("Attachment", "Behavior", "~/AppData/Files", "../AppData/Files");
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

                return Ok(new {  message = "ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(int id)
        {
            try
            {
                var response =await context.Behaviors.FindAsync(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                var fileName = FormHelper.SaveFile("Attachment", "Behavior", "~/AppData/Files", "../AppData/Files");
                if (fileName != null)
                {
                    FormHelper.DeleteFile(response.Attachment, "~/AppData/Files");
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

                return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
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
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //FormHelper.DeleteFile(response.Attachment, "~/AppData/Files");
                    //context.Behaviors.Remove(response);
                    await context.SaveChangesAsync();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }
    }
}
