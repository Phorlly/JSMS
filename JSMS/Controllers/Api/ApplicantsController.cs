using System;
using System.Linq;
using System.Web.Http;
using JSMS.Models.Admin;
using System.Data.Entity;
using System.Threading.Tasks;
using JSMS.Resources;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/applicants")]
    public class ApplicantsController : ApiBaseController
    {
        protected string name = RequestForm("Name");
        protected string nickName = RequestForm("NickName");
        protected string national = RequestForm("National");
        protected string nationality = RequestForm("Nationality");
        protected string gender = RequestForm("Gender");
        protected string dob = RequestForm("DOB");
        protected string education = RequestForm("Education");
        protected string phone1 = RequestForm("Phone1");
        protected string phone2 = RequestForm("Phone2");
        protected string province = RequestForm("Province");
        protected string district = RequestForm("District");
        protected string commune = RequestForm("Commune");
        protected string village = RequestForm("Village");
        protected string createdBy = RequestForm("CreatedBy");
        protected string bProvince = RequestForm("BProvince");
        protected string bDistrict = RequestForm("BDistrict");
        protected string bCommune = RequestForm("BCommune");
        protected string bVillage = RequestForm("BVillage");
        protected string noted = RequestForm("Noted");

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.Applicants
                                      join CProvince in context.Provinces on Applicant.CProvince equals CProvince.Id
                                      join CDistrict in context.Districts on Applicant.CDistrict equals CDistrict.Id
                                      join CCommune in context.Communes on Applicant.CCommune equals CCommune.Id
                                      join CVillage in context.Villages on Applicant.CVillage equals CVillage.Id
                                      join BProvince in context.Provinces on Applicant.BProvince equals BProvince.Id
                                      join BDistrict in context.Districts on Applicant.BDistrict equals BDistrict.Id
                                      join BCommune in context.Communes on Applicant.BCommune equals BCommune.Id
                                      join BVillage in context.Villages on Applicant.BVillage equals BVillage.Id

                                      where Applicant.IsActive.Equals(true) && Applicant.Status == 1
                                      select new
                                      {
                                          Applicant,
                                          CProvince,
                                          CDistrict,
                                          CCommune,
                                          CVillage,
                                          BProvince,
                                          BDistrict,
                                          BCommune,
                                          BVillage,
                                      }).OrderByDescending(c => c.Applicant.Id).ToListAsync();

                if (response == null || !response.Any())
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
                                      join CProvince in context.Provinces on Applicant.CProvince equals CProvince.Id
                                      join CDistrict in context.Districts on Applicant.CDistrict equals CDistrict.Id
                                      join CCommune in context.Communes on Applicant.CCommune equals CCommune.Id
                                      join CVillage in context.Villages on Applicant.CVillage equals CVillage.Id
                                      join BProvince in context.Provinces on Applicant.BProvince equals BProvince.Id
                                      join BDistrict in context.Districts on Applicant.BDistrict equals BDistrict.Id
                                      join BCommune in context.Communes on Applicant.BCommune equals BCommune.Id
                                      join BVillage in context.Villages on Applicant.BVillage equals BVillage.Id

                                      where Applicant.IsActive.Equals(true) && Applicant.Status == 1
                                      select new
                                      {
                                          Applicant,
                                          CProvince,
                                          CDistrict,
                                          CCommune,
                                          CVillage,
                                          BProvince,
                                          BDistrict,
                                          BCommune,
                                          BVillage,
                                      }).SingleAsync(c => c.Applicant.Id.Equals(id));

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
                var fileName = RequestFile("Image", "~/AppData/Images", "../AppData/Images");

                //Assign value to Applicant
                var request = new Applicant()
                {
                    Name = name,
                    NickName = nickName,
                    National = national,
                    Nationality = nationality,
                    CreatedBy = createdBy,
                    Gender = bool.Parse(gender),
                    Phone1 = phone1,
                    Phone2 = phone2,
                    Education = int.Parse(education),
                    Image = fileName,
                    DOB = DateTime.Parse(dob),
                    CProvince = int.Parse(province),
                    CDistrict = int.Parse(district),
                    CCommune = int.Parse(commune),
                    CVillage = int.Parse(village),
                    Noted = noted == "" ? Language.NewApplicant : noted,
                    BProvince = int.Parse(bProvince),
                    BDistrict = int.Parse(bDistrict),
                    BCommune = int.Parse(bCommune),
                    BVillage = int.Parse(bVillage),
                };

                if (request != null)
                {
                    context.Applicants.Add(request);
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
                var response = await context.Applicants.FindAsync(id);
                if (response == null) return NoDataFound();

                var fileName = RequestFile("Image", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                //Assign value
                response.Image = response.Image;
                response.Name = name;
                response.NickName = nickName;
                response.Nationality = nationality;
                response.National = national;
                response.CreatedBy = createdBy;
                response.Gender = bool.Parse(gender);
                response.Phone1 = phone1;
                response.Phone2 = phone2;
                response.Education = int.Parse(education);
                response.DOB = DateTime.Parse(dob);
                response.UpdatedAt = DateTime.Now;
                response.CProvince = int.Parse(province);
                response.CDistrict = int.Parse(district);
                response.CCommune = int.Parse(commune);
                response.CVillage = int.Parse(village);
                response.Noted = noted == "" ? Language.NewApplicant : noted;
                response.BProvince = int.Parse(bProvince);
                response.BDistrict = int.Parse(bDistrict);
                response.BCommune = int.Parse(bCommune);
                response.BVillage = int.Parse(bVillage.Split(',')[0]);
                context.Entry(response).State = EntityState.Modified;

                var req = new JobApplicant()
                {
                    FirstName = name,
                    LastName = nickName,
                    FullName = CombineName(name, nickName),
                    CreatedBy = createdBy,
                    Sex = bool.Parse(gender),
                    Phone = phone1,
                    Phone2 = phone2,
                    Image = response.Image,
                    DOB = DateTime.Parse(dob),
                    Village = int.Parse(village),
                    Commune = int.Parse(commune),
                    District = int.Parse(district),
                    Province = int.Parse(province),
                    Noted = noted == "" ? Language.Applicant : noted,
                };

                context.JobApplicants.Add(req);
               

                await context.SaveChangesAsync();
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
                var response = await context.Applicants.FindAsync(id);
                if (response == null) return NoDataFound();

                response.IsActive = false;
                response.DeletedAt = DateTime.Now;
                //DeleteFile(response.Image, "~/AppData/Images");
                //context.Applicants.Remove(response);
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
