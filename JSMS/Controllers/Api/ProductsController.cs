using JSMS.Helpers;
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
    [RoutePrefix("api/hr/products")]
    public class ProductsController : ApiController
    {
        protected readonly ApplicationDbContext context;
        protected string name = FormHelper.Form("Name");
        protected string createdBy = FormHelper.Form("CreatedBy");
        protected string noted = FormHelper.Form("Noted");

        public ProductsController()
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
                var response = context.Products.OrderByDescending(c => c.Id).ToList();
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
                var response = context.Products.FirstOrDefault(c => c.Id.Equals(id));
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
        public IHttpActionResult Post()
        {
            try
            {
                var fileName = FormHelper.SaveFile("Image", "Product", "~/AppData/Images", "../AppData/Images");
                var request = new Product()
                {
                    Name = name,
                    Image = fileName,
                    Noted = noted == "" ? "New product add to stock" : noted,
                    CreatedBy = createdBy,
                    IsActive = true,
                    Updated = DateTime.Now,
                    Created = DateTime.Now,
                };

                if (request != null)
                {
                    context.Products.Add(request);
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
        public IHttpActionResult PutById(int id)
        {
            try
            {
                var response = context.Products.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                var fileName = FormHelper.SaveFile("Image", "Product", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    FormHelper.DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                response.Updated = DateTime.Now;
                response.Created = response.Created;
                response.IsActive = true;
                response.Name = name;
                response.Noted = noted;
                response.CreatedBy = response.CreatedBy;
                response.Image = response.Image;

                if (response != null)
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
                var response = context.Products.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.Deleted = DateTime.Now;
                    //FormHelper.DeleteFile(response.Image, "~/AppData/Images");
                    //context.Products.Remove(response);
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
