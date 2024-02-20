using JSMS.Models.Admin;
using JSMS.Resources;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/behaviors")]
    public class BehaviorsController : ApiBaseController
    {
        //Behavior
        protected string confirmBy = RequestForm("ConfirmBy");
        protected string applicant = RequestForm("Applicant");
        protected string createdBy = RequestForm("CreatedBy");
        protected string currentDate = RequestForm("CurrentDate");
        protected string noted = RequestForm("Noted");

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Applicant in context.Applicants
                                      join Behavior in context.Behaviors on Applicant.Id equals Behavior.Applicant
                                      where Behavior.IsActive == true
                                      select new { Behavior, Applicant })
                                      .OrderByDescending(c => c.Behavior.Id).ToListAsync();
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
                var response = await (from Applicant in context.Applicants
                                      join Behavior in context.Behaviors on Applicant.Id equals Behavior.Applicant
                                      where Behavior.IsActive == true
                                      select new { Behavior, Applicant })
                                     .FirstAsync(c => c.Behavior.Id.Equals(id));
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
                var isExist = await context.Behaviors.FirstOrDefaultAsync(c => c.Applicant.ToString() == applicant);
                if (isExist != null)
                {
                    return ExistData(Language.ExistApplicant);
                }

                var fileName = RequestFile("Attachment", "~/AppData/Files", "../AppData/Files");
                var request = new Behavior()
                {
                    Applicant = int.Parse(applicant),
                    ConfirmBy = confirmBy,
                    CreatedBy = createdBy,
                    Attachment = fileName,
                    CurrentDate = DateTime.Parse(currentDate),
                    Noted = noted == "" ? Language.Confirmed : noted,
                };

                if (request != null)
                {
                    context.Behaviors.Add(request);
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
                var response = await context.Behaviors.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                // Check if there is another record with the same Applicant
                var isSameApplicant = await context.Behaviors
                    .FirstOrDefaultAsync(c => c.Applicant.ToString() == applicant.ToString() && c.Id != id);

                if (isSameApplicant != null)
                {
                    return ExistData(Language.ExistApplicant);
                }

                var fileName = RequestFile("Attachment", "~/AppData/Files", "../AppData/Files");
                if (fileName != null)
                {
                    DeleteFile(response.Attachment, "~/AppData/Files");
                    response.Attachment = fileName;
                }

                response.UpdatedAt = DateTime.Now;
                response.ConfirmBy = confirmBy;
                response.Applicant = int.Parse(applicant);
                response.Noted = noted == "" ? Language.Confirmed : noted;
                response.CreatedBy = response.CreatedBy;
                response.CurrentDate = DateTime.Parse(currentDate);
                response.Attachment = response.Attachment;

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
                var response = await context.Behaviors.FindAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //DeleteFile(response.Attachment, "~/AppData/Files");
                    //context.Behaviors.Remove(response);
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
