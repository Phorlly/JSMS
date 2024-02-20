using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml.Linq;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/job-applicants")]
    public class JobJobApplicantsController : ApiBaseController
    {
        protected string firstName = RequestForm("FirstName");
        protected string lastName = RequestForm("LastName");
        protected string sex = RequestForm("Sex");
        protected string dob = RequestForm("DOB");
        protected string village = RequestForm("Village");
        protected string commune = RequestForm("Commune");
        protected string district = RequestForm("District");
        protected string province = RequestForm("Province");
        protected string phone = RequestForm("Phone");
        protected string phone2 = RequestForm("Phone2");
        protected string createdBy = RequestForm("CreatedBy");
        //protected string status = RequestForm("Status");
        protected string noted = RequestForm("Noted");


        [HttpGet]
        [Route("reads")]
        public async Task<IHttpActionResult> Reads()
        {
            try
            {
                var response = await (from applicant in context.JobApplicants
                                      join province in context.Provinces on applicant.Province equals province.Id
                                      join district in context.Districts on applicant.District equals district.Id
                                      join commune in context.Communes on applicant.Commune equals commune.Id
                                      join village in context.Villages on applicant.Village equals village.Id

                                      where applicant.IsActive.Equals(true)
                                      select new
                                      {
                                          applicant,
                                          province,
                                          district,
                                          commune,
                                          village,
                                      }).OrderByDescending(c => c.applicant.Id).ToListAsync();


                if (response == null || !response.Any()) return NoDataFound();

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
                var response = await (from applicant in context.JobApplicants
                                      join province in context.Provinces on applicant.Province equals province.Id
                                      join district in context.Districts on applicant.District equals district.Id
                                      join commune in context.Communes on applicant.Commune equals commune.Id
                                      join village in context.Villages on applicant.Village equals village.Id

                                      where applicant.IsActive.Equals(true)
                                      select new
                                      {
                                          applicant,
                                          province,
                                          district,
                                          commune,
                                          village,
                                      }).SingleOrDefaultAsync(c => c.applicant.Id.Equals(id));

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
                //Assign value to JobApplicant
                var request = new JobApplicant()
                {
                    FirstName = firstName,
                    LastName = lastName,
                    FullName = CombineName(firstName, lastName),
                    CreatedBy = createdBy,
                    Sex = bool.Parse(sex),
                    Phone = phone,
                    Phone2 = phone2,
                    Image = RequestFile("Image", "~/AppData/Images", "../AppData/Images"),
                    Attachments = RequestFiles("../AppData/Files", "~/AppData/Files"),
                    DOB = DateTime.Parse(dob),
                    Province = int.Parse(province),
                    District = int.Parse(district),
                    Commune = int.Parse(commune),
                    Village = int.Parse(village),
                    //Status = int.Parse(status),
                    Noted = noted == "" ? Language.Applicant : noted,
                };

                if (request != null)
                {
                    context.JobApplicants.Add(request);
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
                var response = await context.JobApplicants.FindAsync(id);
                if (response == null) return NoDataFound();

                var image = RequestFile("Image", "~/AppData/Images", "../AppData/Images");
                if ((image != null && image.Length > 0) || !string.IsNullOrEmpty(response.Image))
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = image;
                }
             
                var files = RequestFiles("../AppData/Files", "~/AppData/Files");
                if((files != null && files.Length > 0) || !string.IsNullOrEmpty(response.Attachments))
                {
                    DeleteFiles(response.Attachments, "~/AppData/Files");
                    response.Attachments = files;
                }

                //Assign value
                response.FirstName = firstName;
                response.LastName = lastName;
                response.FullName = CombineName(firstName, lastName);
                response.Sex = bool.Parse(sex);
                response.Phone = phone;
                response.Phone2 = phone2;
                response.DOB = DateTime.Parse(dob);
                response.UpdatedAt = DateTime.Now;
                response.Province = int.Parse(province);
                response.District = int.Parse(district);
                response.Commune = int.Parse(commune);
                response.Village = int.Parse(village);
                //response.Status = int.Parse(status);
                response.Noted = noted == "" ? Language.Applicant : noted;

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
                var response = await context.JobApplicants.FindAsync(id);
                if (response == null) return NoDataFound();

                // Update the properties of the response object
                response.IsActive = false;
                response.DeletedAt = DateTime.Now;

                // Check if response.Image is not null before calling DeleteFile
                if (!string.IsNullOrEmpty(response.Image))
                {
                    DeleteFile(response.Image, "~/AppData/Images");
                }

                // Check if response.Attachments is not null before calling DeleteFiles
                if (!string.IsNullOrEmpty(response.Attachments))
                {
                    DeleteFiles(response.Attachments, "~/AppData/Files");
                }

                context.JobApplicants.Remove(response);
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
