using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/clients")]
    public class ClientsController : ApiController
    {
        protected readonly ApplicationDbContext context;
        protected string ownerName = FormHelper.Form("Name");
        protected string company = FormHelper.Form("Company");
        protected string vattin = FormHelper.Form("VATTIN");
        protected string gender = FormHelper.Form("Gender");
        protected string dob = FormHelper.Form("DOB");
        protected string position = FormHelper.Form("Position");
        protected string phone1 = FormHelper.Form("Phone1");
        protected string phone2 = FormHelper.Form("Phone2");
        protected string province = FormHelper.Form("Province");
        protected string district = FormHelper.Form("District");
        protected string commune = FormHelper.Form("Commune");
        protected string village = FormHelper.Form("Village");
        protected string createdBy = FormHelper.Form("CreatedBy");
        protected string noted = FormHelper.Form("Noted");

        public ClientsController()
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
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Province in context.Provinces
                                      join Client in context.Clients on Province.Id equals Client.Province
                                      join District in context.Districts on Client.District equals District.Id
                                      join Commune in context.Communes on Client.Commune equals Commune.Id
                                      join Village in context.Villages on Client.Village equals Village.Id
                                      where Client.IsActive == true && Client.IsClient == true
                                      select new { Client, Province, District, Commune, Village })
                                .OrderByDescending(c => c.Client.Id).ToListAsync();
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ" }));
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
        public async Task<IHttpActionResult> GetById(int id)
        {
            try
            {
                var response = await (from Province in context.Provinces
                                      join Client in context.Clients on Province.Id equals Client.Province
                                      join District in context.Districts on Client.District equals District.Id
                                      join Commune in context.Communes on Client.Commune equals Commune.Id
                                      join Village in context.Villages on Client.Village equals Village.Id
                                      where Client.IsActive == true && Client.IsClient == true
                                      select new { Client, Province, District, Commune, Village })
                                      .FirstAsync(c => c.Client.Id.Equals(id));
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ" }));
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
                var fileName = FormHelper.SaveFile("Image", "Client", "~/AppData/Images", "../AppData/Images");
                //var exist = context.Clients.FirstOrDefault(c => c.Company.Equals(company) ||
                //                                                c.GDTREG.Equals(gdtreg) ||
                //                                                c.VATTIN.Equals(vattin));
                //if (exist != null)
                //{
                //    return BadRequest();
                //}

                //Assign value
                var request = new Client()
                {
                    Name = ownerName,
                    Company = company,
                    VATTIN = int.Parse(vattin),
                    CreatedBy = createdBy,
                    Gender = bool.Parse(gender),
                    Phone1 = phone1,
                    Phone2 = phone2,
                    Position = int.Parse(position),
                    Image = fileName,
                    DOB = DateTime.Parse(dob),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsActive = true,
                    IsClient = true,
                    Status = 1,
                    Province = int.Parse(province),
                    District = int.Parse(district),
                    Commune = int.Parse(commune),
                    Village = int.Parse(village),
                    Noted = noted
                };

                if (request != null)
                {
                    context.Clients.Add(request);
                    await context.SaveChangesAsync();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ" });
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
                var response = await context.Clients.FindAsync(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ" }));
                }

                var fileName = FormHelper.SaveFile("Image", "Client", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    FormHelper.DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                //Assign value
                response.Name = ownerName;
                response.Company = company;
                response.VATTIN = int.Parse(vattin);
                response.CreatedBy = response.CreatedBy;
                response.Gender = bool.Parse(gender);
                response.Phone1 = phone1;
                response.Phone2 = phone2;
                response.Position = int.Parse(position);
                response.Image = response.Image;
                response.DOB = DateTime.Parse(dob);
                response.CreatedAt = response.CreatedAt;
                response.UpdatedAt = DateTime.Now;
                response.IsActive = true;
                response.IsClient = true;
                response.Status = 1;
                response.Noted = noted;
                response.Province = int.Parse(province);
                response.District = int.Parse(district);
                response.Commune = int.Parse(commune);
                response.Village = int.Parse(village);

                if (response != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់" });
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
                var response = await context.Clients.FindAsync(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ" }));
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //FormHelper.DeleteFile(response.Image, "~/AppData/Images");
                    //context.Clients.Remove(response);
                    await context.SaveChangesAsync();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }
    }
}
