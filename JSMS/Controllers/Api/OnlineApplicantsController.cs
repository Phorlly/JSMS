using JSMS.Models.Admin;
using JSMS.Models.User;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/online-applicants")]
    public class OnlineApplicantsController : ApiBaseController
    {
        protected string name = RequestForm("Name");
        protected string nickName = RequestForm("NickName");
        protected string national = RequestForm("National");
        protected string nationality = RequestForm("Nationality");
        protected string sex = RequestForm("Sex");
        protected string dob = RequestForm("DOB");
        protected string education = RequestForm("Education");
        protected string phone1 = RequestForm("Phone1");
        protected string phone2 = RequestForm("Phone2");
        protected string position = RequestForm("Position");
        protected string pob = RequestForm("POB");
        protected string noted = RequestForm("Noted");
        protected string address = RequestForm("Address");
        protected string status = RequestForm("Status");

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.OnlineApplicants
                                      join Province in context.Provinces on Applicant.POB equals Province.Id
                                      join Address in context.Provinces on Applicant.Address equals Address.Id

                                      where Applicant.IsActive.Equals(true)
                                      select new { Applicant, Province, Address })
                                      .OrderByDescending(c => c.Applicant.Id).ToListAsync();

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
                var response = await (from Applicant in context.OnlineApplicants
                                      join Province in context.Provinces on Applicant.POB equals Province.Id
                                      join Address in context.Provinces on Applicant.Address equals Address.Id

                                      where Applicant.IsActive.Equals(true)
                                      select new { Applicant, Province, Address })
                                      .SingleAsync(c => c.Applicant.Id.Equals(id));

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
                var fileName = RequestFile("Attachment", "Applicant", "~/AppData/Files", "../AppData/Files");
                //Assign value to OnlineApplicant
                var request = new OnlineApplicant()
                {
                    Name = name,
                    NickName = nickName,
                    National = national,
                    Nationality = nationality,
                    Sex = int.Parse(sex),
                    Phone1 = phone1,
                    Phone2 = phone2,
                    Education = int.Parse(education),
                    Attachment = fileName,
                    DOB = DateTime.Parse(dob),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    IsActive = true,
                    Status = 0,
                    POB = int.Parse(pob),
                    Address = int.Parse(address),
                    Noted = noted,
                    Position = int.Parse(position)
                };

                if (request != null)
                {
                    context.OnlineApplicants.Add(request);
                    await context.SaveChangesAsync();
                }

                return MessageWithCode(201, Language.DataCreated);
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
                var response = context.OnlineApplicants.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                var fileName = RequestFile("Attachment", "Applicant", "~/AppData/Files", "../AppData/Files");
                if (fileName != null)
                {
                    DeleteFile(response.Attachment, "~/AppData/Images");
                    response.Attachment = fileName;
                }

                //Assign value
                response.Attachment = response.Attachment;
                response.Name = name;
                response.NickName = nickName;
                response.Nationality = nationality;
                response.National = national;
                response.Sex = int.Parse(sex);
                response.Phone1 = phone1;
                response.Phone2 = phone2;
                response.Education = int.Parse(education);
                response.DOB = DateTime.Parse(dob);
                response.CreatedAt = response.CreatedAt;
                response.UpdatedAt = DateTime.Now;
                response.IsActive = true;
                response.Status = int.Parse(status);
                response.Position = int.Parse(position);
                response.POB = int.Parse(pob);
                response.Address = int.Parse(address);
                response.Noted = noted;

                //Update
                if (response != null)
                {
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                return MessageWithCode(200, Language.DataUpdated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-status-by-id/{id}")]
        public async Task<IHttpActionResult> PutStatusById(int id, OnlineApplicant req)
        {
            try
            {
                var response = context.OnlineApplicants.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                response.Status = req.Status;

                //Update
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
                var response = context.OnlineApplicants.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //DeleteFile(response.Attachment, "~/AppData/Images");
                    //context.OnlineApplicants.Remove(response);
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
