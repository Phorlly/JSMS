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
        //protected string vattin = RequestForm("VATTIN");
        //protected string gender = RequestForm("Gender");
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
        [Route("reads")]
        public async Task<IHttpActionResult> Reads()
        {
            try
            {
                var response = await (from client in context.Clients
                                      join province in context.Provinces on client.Province equals province.Id
                                      join district in context.Districts on client.District equals district.Id
                                      join commune in context.Communes on client.Commune equals commune.Id
                                      join village in context.Villages on client.Village equals village.Id
                                      where client.IsActive == true && client.IsClient == true
                                      select new
                                      {
                                          client, 
                                          province,
                                          district,
                                          commune,
                                          village,
                                          Staff = context.Staffs.Count(c => c.Client == client.Id)
                                      }).OrderByDescending(c => c.client.Id).ToListAsync();

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
                var response = await (from client in context.Clients
                                      join province in context.Provinces on client.Province equals province.Id
                                      join district in context.Districts on client.District equals district.Id
                                      join commune in context.Communes on client.Commune equals commune.Id
                                      join village in context.Villages on client.Village equals village.Id
                                      where client.IsActive == true && client.IsClient == true
                                      select new
                                      {
                                          client,
                                          province,
                                          district,
                                          commune,
                                          village
                                      }).FirstAsync(c => c.client.Id.Equals(id));

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
                //Assign value
                var request = new Client()
                {
                    Name = ownerName,
                    Company = company,
                    //VATTIN = int.Parse(vattin),
                    CreatedBy = createdBy,
                    //Gender = bool.Parse(gender),
                    Status = 0,
                    Phone1 = phone1,
                    Phone2 = phone2,
                    Position = int.Parse(position),
                    Image = RequestFile("Image", "~/AppData/Images", "../AppData/Images"),
                    DOB = DateTime.Parse(dob),
                    Province = int.Parse(province),
                    District = int.Parse(district),
                    Commune = int.Parse(commune),
                    Village = int.Parse(village),
                    Noted = noted == "" ? Language.RequestGuard : noted
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
        [Route("update/{id}")]
        public async Task<IHttpActionResult> Update(int id)
        {
            try
            {
                var response = await context.Clients.FindAsync(id);
                if (response == null) return NoDataFound();

                var fileName = RequestFile("Image", "~/AppData/Images", "../AppData/Images");
                if ((fileName != null && fileName.Length > 0) || !string.IsNullOrEmpty(response.Image))
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                //Assign value
                response.Name = ownerName;
                response.Company = company;
                //response.VATTIN = int.Parse(vattin);
                response.CreatedBy = response.CreatedBy;
                //response.Gender = bool.Parse(gender);
                response.Phone1 = phone1;
                response.Phone2 = phone2;
                response.Position = int.Parse(position);
                response.DOB = DateTime.Parse(dob);
                response.UpdatedAt = DateTime.Now;
                response.Province = int.Parse(province);
                response.District = int.Parse(district);
                response.Commune = int.Parse(commune);
                response.Village = int.Parse(village);
                response.Noted = noted == "" ? Language.RequestGuard : noted;

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
                var response = await context.Clients.FindAsync(id);
                if (response == null) return NoDataFound();

                response.IsActive = false;
                response.DeletedAt = DateTime.Now;

                // Check if response.Image is not null before calling DeleteFile
                if (!string.IsNullOrEmpty(response.Image))
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                }

                context.Clients.Remove(response);
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
