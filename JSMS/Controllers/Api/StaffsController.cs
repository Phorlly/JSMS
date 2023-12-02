using JSMS.Models.Admin;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/staffs")]
    public class StaffsController : ApiController
    {
        protected readonly ApplicationDbContext context;
        public StaffsController()
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
                                join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
                                join Client in context.Clients on Staff.Client equals Client.Id
                                where Staff.IsActive == true
                                select new { Staff, Applicant, Client, ShortList })
                                //.OrderByDescending(c => c.Staff.Id).ToList();
                                .OrderBy(c => c.Staff.Code).ToList();
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
                                join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
                                join Client in context.Clients on Staff.Client equals Client.Id
                                where Staff.IsActive == true
                                select new { Staff, Applicant, Client, ShortList })
                                .FirstOrDefault(c => c.Staff.Id.Equals(id));
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
        public IHttpActionResult Post(Staff request)
        {
            try
            {
                var isExist = context.Staffs.FirstOrDefault(c => c.Code.Equals(request.Code));
                if (isExist != null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "លេខកូដនេះកំពុងប្រើហើយ​​ 📛" }));
                }

                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.PremierSalary = 15;

                if (request != null)
                {
                    context.Staffs.Add(request);
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public IHttpActionResult PutById(Staff request, int id)
        {
            try
            {
                var response = context.Staffs.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
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

                    return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
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
                        context.SaveChanges();
                    }

                    return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
                }
                else
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "លេខកូដនេះកំពុងប្រើហើយ​​ 📛" }));
                }
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }

        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public IHttpActionResult DeleteById(int id)
        {
            try
            {
                var response = context.Staffs.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //context.Staffs.Remove(response);
                    context.SaveChanges();
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
