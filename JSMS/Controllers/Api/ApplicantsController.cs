using System;
using System.Linq;
using System.Web.Http;
using JSMS.Models.Admin;
using System.Data.Entity;
using System.Threading.Tasks;

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

                                      where Applicant.IsActive.Equals(true)
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

                                      where Applicant.IsActive.Equals(true)
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
                var fileName = RequestFile("Image", "Applicant", "~/AppData/Images", "../AppData/Images");
                //var exist = context.Applicants.FirstOrDefault(c => c.Name.Equals(name));
                //if (exist != null)
                //{
                //    return BadRequest();
                //}

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
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsActive = true,
                    Status = 1,
                    CProvince = int.Parse(province),
                    CDistrict = int.Parse(district),
                    CCommune = int.Parse(commune),
                    CVillage = int.Parse(village),
                    Noted = noted,
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
                var response = await context.Applicants.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                var fileName = RequestFile("Image", "Applicant", "~/AppData/Images", "../AppData/Images");
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
                response.CreatedAt = response.CreatedAt;
                response.UpdatedAt = DateTime.Now;
                response.IsActive = true;
                response.Status = 1;
                response.CProvince = int.Parse(province);
                response.CDistrict = int.Parse(district);
                response.CCommune = int.Parse(commune);
                response.CVillage = int.Parse(village);
                response.Noted = noted;
                response.BProvince = int.Parse(bProvince);
                response.BDistrict = int.Parse(bDistrict);
                response.BCommune = int.Parse(bCommune);
                response.BVillage = int.Parse(bVillage.Split(',')[0]);

                //Update
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
                var response = await context.Applicants.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //DeleteFile(response.Image, "~/AppData/Images");
                    //context.Applicants.Remove(response);
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់ហើយ..!​");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        //private string ApplicantCode(string keyWord)
        //{
        //    var existCode = context.Applicants.Max(c => c.Code);
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
