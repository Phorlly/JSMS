using JSMS.Models.Admin;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/products")]
    public class ProductsController : ApiBaseController
    {
        protected string name = RequestForm("Name");
        protected string createdBy = RequestForm("CreatedBy");
        protected string noted = RequestForm("Noted");

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await context.Products.OrderByDescending(c => c.Id).ToListAsync();
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
                var response = await context.Products.FirstAsync(c => c.Id.Equals(id));
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
        public async Task<IHttpActionResult> Post()
        {
            try
            {
                var fileName = RequestFile("Image", "Product", "~/AppData/Images", "../AppData/Images");
                var request = new Product()
                {
                    Name = name,
                    Image = fileName,
                    Noted = noted == "" ? "សម្រាប់ឲ្យទៅបុគ្គលិក" : noted,
                    CreatedBy = createdBy,
                    IsActive = true,
                    Updated = DateTime.Now,
                    Created = DateTime.Now,
                };

                if (request != null)
                {
                    context.Products.Add(request);
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
        public async Task<IHttpActionResult> PutById(int id)
        {
            try
            {
                var response = await context.Products.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                var fileName = RequestFile("Image", "Product", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                response.Updated = DateTime.Now;
                response.Created = response.Created;
                response.IsActive = true;
                response.Name = name;
                response.Noted = noted == "" ? "សម្រាប់ឲ្យទៅបុគ្គលិក" : noted;
                response.CreatedBy = response.CreatedBy;
                response.Image = response.Image;

                if (response != null)
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
                var response = await context.Products.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.Deleted = DateTime.Now;
                    //DeleteFile(response.Image, "~/AppData/Images");
                    //context.Products.Remove(response);
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
