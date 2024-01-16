using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/clients")]
    public class ClientsController : ApiBaseController
    {
        protected string ownerName = RequestForm("Name");
        protected string company = RequestForm("Company");
        protected string vattin = RequestForm("VATTIN");
        protected string gender = RequestForm("Gender");
        protected string dob = RequestForm("DOB");
        protected string position = RequestForm("Position");
        protected string phone1 = RequestForm("Phone1");
        protected string phone2 = RequestForm("Phone2");
        protected string province = RequestForm("Province");
        protected string district = RequestForm("District");
        protected string commune = RequestForm("Commune");
        protected string village = RequestForm("Village");
        protected string createdBy = RequestForm("CreatedBy");
        protected string noted = RequestForm("Noted");

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
                var fileName = RequestFile("Image", "Client", "~/AppData/Images", "../AppData/Images");
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
                    Province = int.Parse(province),
                    District = int.Parse(district),
                    Commune = int.Parse(commune),
                    Village = int.Parse(village),
                    Noted = noted == "" ? Language.Created: noted
                };

                if (request != null)
                {
                    context.Clients.Add(request);
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
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(int id)
        {
            try
            {
                var response = await context.Clients.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                var fileName = RequestFile("Image", "Client", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    DeleteFile(response.Image, "~/AppData/Images");
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
                response.UpdatedAt = DateTime.Now;
                response.Noted = noted == "" ? Language.Updated : noted;
                response.Province = int.Parse(province);
                response.District = int.Parse(district);
                response.Commune = int.Parse(commune);
                response.Village = int.Parse(village);

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
        [Route("delete-by-id/{id}")]
        public async Task<IHttpActionResult> DeleteById(int id)
        {
            try
            {
                var response = await context.Clients.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //DeleteFile(response.Image, "~/AppData/Images");
                    //context.Clients.Remove(response);
                    await context.SaveChangesAsync();
                }

                return Success(Language.DataDeleted);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
