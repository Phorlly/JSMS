using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using JSMS.Models.User;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/online-applicants")]
    public class OnlineApplicantsController : ApiController
    {
        protected readonly ApplicationDbContext context;
        protected string name = FormHelper.Form("Name");
        protected string nickName = FormHelper.Form("NickName");
        protected string national = FormHelper.Form("National");
        protected string nationality = FormHelper.Form("Nationality");
        protected string sex = FormHelper.Form("Sex");
        protected string dob = FormHelper.Form("DOB");
        protected string education = FormHelper.Form("Education");
        protected string phone1 = FormHelper.Form("Phone1");
        protected string phone2 = FormHelper.Form("Phone2");
        protected string position = FormHelper.Form("Position");
        protected string pob = FormHelper.Form("POB");
        protected string noted = FormHelper.Form("Noted");
        protected string address = FormHelper.Form("Address");
        protected string status = FormHelper.Form("Status");

        public OnlineApplicantsController()
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
        public IHttpActionResult Get()
        {
            try
            { 
                var response = (from Applicant in context.OnlineApplicants
                                join Province in context.Provinces on Applicant.POB equals Province.Id
                                join Address in context.Provinces on Applicant.Address equals Address.Id

                                where Applicant.IsActive.Equals(true)
                                select new { Applicant, Province, Address }).OrderByDescending(c => c.Applicant.Id).ToList();

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
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
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var response = (from Applicant in context.OnlineApplicants
                                join Province in context.Provinces on Applicant.POB equals Province.Id
                                join Address in context.Provinces on Applicant.Address equals Address.Id

                                where Applicant.IsActive.Equals(true)
                                select new { Applicant, Province, Address }).SingleOrDefault(c => c.Applicant.Id.Equals(id));

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" })); 
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
        public IHttpActionResult Post()
        {
            try
            {
                var fileName = FormHelper.SaveFile("Attachment", "Applicant", "~/AppData/Files", "../AppData/Files");
                //var exist = context.OnlineApplicants.FirstOrDefault(c => c.Name.Equals(name));
                //if (exist != null)
                //{
                //    return BadRequest();
                //}

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
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public IHttpActionResult PutById(int id)
        {
            try
            {
                var response = context.OnlineApplicants.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                var fileName = FormHelper.SaveFile("Attachment", "Applicant", "~/AppData/Files", "../AppData/Files");
                if (fileName != null)
                {
                    FormHelper.DeleteFile(response.Attachment, "~/AppData/Images");
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
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public IHttpActionResult DeleteById(int id)
        {
            try
            {
                var response = context.OnlineApplicants.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //FormHelper.DeleteFile(response.Attachment, "~/AppData/Images");
                    //context.OnlineApplicants.Remove(response);
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }


        //private string ApplicantCode(string keyWord) 
        //{
        //    var existCode = context.OnlineApplicants.Max(c => c.Code);
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
