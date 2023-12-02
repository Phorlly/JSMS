using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using JSMS.Models.User;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/online-clients")]

    public class OnlineClientsController : ApiController
    {
        protected readonly ApplicationDbContext context;

        public OnlineClientsController()
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
                var response = (from Client in context.OnlineClients
                                join Province in context.States on Client.Province equals Province.Id
                                join Country in context.Countries on Client.Country equals Country.Id

                                where Client.IsActive.Equals(true)
                                select new { Client, Province, Country }).OrderByDescending(c => c.Client.Id).ToList();

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
                var response = (from Client in context.OnlineClients
                                join Country in context.Countries on Client.Country equals Country.Id
                                join Province in context.States on Client.Province equals Province.Id

                                where Client.IsActive.Equals(true)
                                select new { Client, Province, Country }).SingleOrDefault(c => c.Client.Id.Equals(id));

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
        public IHttpActionResult Post(OnlineClient request)
        {
            try
            {
                //var exist = context.OnlineClients.FirstOrDefault(c => c.Name.Equals(request.Name));
                //if (exist != null)
                //{
                //    return BadRequest();
                //}

                //Assign value to OnlineClient
                request.CreatedAt = DateTime.Now;
                request.UpdatedAt = DateTime.Now;
                request.IsActive = true;
                request.Status = 0;

                if (request != null)
                {
                    context.OnlineClients.Add(request);
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
        public IHttpActionResult PutById(OnlineClient request, int id)
        {
            try
            {
                var response = context.OnlineClients.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                //Assign value
                response.Name = request.Name;
                response.Company = request.Company;
                response.Email = request.Email;
                response.Sex = request.Sex;
                response.Phone1 = request.Phone1;
                response.Phone2 = request.Phone2;
                response.CreatedAt = response.CreatedAt;
                response.UpdatedAt = DateTime.Now;
                response.IsActive = true;
                response.Status = request.Status;
                response.Province = request.Province;
                response.Country = request.Country;
                response.Noted = request.Noted;

                //Update
                if (response != null && request != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    context.SaveChanges();
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
        public IHttpActionResult DeleteById(int id)
        {
            try
            {
                var response = context.OnlineClients.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //context.OnlineClients.Remove(response);
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }


        //private string ClientCode(string keyWord)
        //{
        //    var existCode = context.OnlineClients.Max(c => c.Code);
        //    if (existCode != null)
        //    {
        //        int number = int.Parse(existCode.Split('-')[1]) + 1;
        //        string newCode = $"{keyWord.ToUpper()}-{number.ToString("D5")}";

        //        return newCode;
        //    }
        //    else
        //    {
        //        return $"{keyWord.ToUpper()}-00001";
        //    }
        //}
    }
}
