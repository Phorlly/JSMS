using JSMS.Models.Admin;
using JSMS.Resources;
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
        [Route("reads")]
        public async Task<IHttpActionResult> Reads()
        {
            try
            {
                var response = await context.Products.OrderByDescending(c => c.Id).ToListAsync();
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
                var response = await context.Products.FindAsync(id);
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
        public async Task<IHttpActionResult> Create()
        {
            try
            {
                var fileName = RequestFile("Image", "~/AppData/Images", "../AppData/Images");
                var request = new Product()
                {
                    Name = name,
                    Image = fileName,
                    Noted = noted == "" ? Language.Created : noted,
                    CreatedBy = createdBy,
                };

                if (request != null)
                {
                    context.Products.Add(request);
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
        public async Task<IHttpActionResult> Update(int id) 
        {
            try
            {
                var response = await context.Products.FindAsync(id);
                if (response == null) return NoDataFound();

                var fileName = RequestFile("Image", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                response.Updated = DateTime.Now;
                response.Name = name;
                response.Noted = noted == "" ? Language.Updated : noted;
                response.CreatedBy = response.CreatedBy;
                response.Image = response.Image;

                if (response != null)
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
                var response = await context.Products.FindAsync(id);
                if (response == null) return NoDataFound();

                response.IsActive = false;
                response.Deleted = DateTime.Now;
                //DeleteFile(response.Image, "~/AppData/Images");
                //context.Products.Remove(response);
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
