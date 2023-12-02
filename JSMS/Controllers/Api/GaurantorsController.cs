using JSMS.Models.Admin;
using JSMS.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using JSMS.Helpers;
using System.Data.Entity;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/gaurantors")]
    public class GaurantorsController : ApiController
    {
        protected readonly ApplicationDbContext context;
        protected string name = FormHelper.Form("Name");
        protected string nickName = FormHelper.Form("NickName");
        protected string national = FormHelper.Form("National");
        protected string nationality = FormHelper.Form("Nationality");
        protected string gender = FormHelper.Form("Gender");
        protected string dob = FormHelper.Form("DOB");
        protected string education = FormHelper.Form("Education");
        protected string phone1 = FormHelper.Form("Phone1");
        protected string phone2 = FormHelper.Form("Phone2");
        protected string province = FormHelper.Form("Province");
        protected string district = FormHelper.Form("District");
        protected string commune = FormHelper.Form("Commune");
        protected string village = FormHelper.Form("Village");
        protected string createdBy = FormHelper.Form("CreatedBy");
        protected string bProvince = FormHelper.Form("BProvince");
        protected string bDistrict = FormHelper.Form("BDistrict");
        protected string bCommune = FormHelper.Form("BCommune");
        protected string bVillage = FormHelper.Form("BVillage");
        protected string noted = FormHelper.Form("Noted");

        public GaurantorsController()
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
                var response = (from CProvince in context.Provinces
                                join Gaurantor in context.Gaurantors on CProvince.Id equals Gaurantor.CProvince
                                join CDistrict in context.Districts on Gaurantor.CDistrict equals CDistrict.Id
                                join CCommune in context.Communes on Gaurantor.CCommune equals CCommune.Id
                                join CVillage in context.Villages on Gaurantor.CVillage equals CVillage.Id

                                join BProvince in context.Provinces on Gaurantor.BProvince equals BProvince.Id
                                join BDistrict in context.Districts on Gaurantor.BDistrict equals BDistrict.Id
                                join BCommune in context.Communes on Gaurantor.BCommune equals BCommune.Id
                                join BVillage in context.Villages on Gaurantor.BVillage equals BVillage.Id
                                where Gaurantor.IsActive == true
                                select new { Gaurantor, CProvince, CDistrict, CCommune, CVillage, BProvince, BDistrict, BCommune, BVillage })
                                .OrderByDescending(c => c.Gaurantor.Id).ToList();
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
                var response = (from CProvince in context.Provinces
                                join Gaurantor in context.Gaurantors on CProvince.Id equals Gaurantor.CProvince
                                join CDistrict in context.Districts on Gaurantor.CDistrict equals CDistrict.Id
                                join CCommune in context.Communes on Gaurantor.CCommune equals CCommune.Id
                                join CVillage in context.Villages on Gaurantor.CVillage equals CVillage.Id

                                join BProvince in context.Provinces on Gaurantor.BProvince equals BProvince.Id
                                join BDistrict in context.Districts on Gaurantor.BDistrict equals BDistrict.Id
                                join BCommune in context.Communes on Gaurantor.BCommune equals BCommune.Id
                                join BVillage in context.Villages on Gaurantor.BVillage equals BVillage.Id
                                where Gaurantor.IsActive == true
                                select new { Gaurantor, CProvince, CDistrict, CCommune, CVillage, BProvince, BDistrict, BCommune, BVillage })
                                .SingleOrDefault(c => c.Gaurantor.Id.Equals(id));
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
                var fileName = FormHelper.SaveFile("Image", "Gaurantor", "~/AppData/Images", "../AppData/Images");
                //var exist = context.Gaurantors.FirstOrDefault(c => c.Name.Equals(name));
                //if (exist != null)
                //{
                //    return BadRequest();
                //}

                //Assign value
                var request = new Gaurantor()
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
                    context.Gaurantors.Add(request);
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
                var response = context.Gaurantors.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                var fileName = FormHelper.SaveFile("Image", "Gaurantor", "~/AppData/Images", "../AppData/Images");
                if (fileName != null)
                {
                    FormHelper.DeleteFile(response.Image, "~/AppData/Images");
                    response.Image = fileName;
                }

                //Assign value
                response.Name = name;
                response.NickName = nickName;
                response.Nationality = nationality;
                response.National = national;
                response.CreatedBy = createdBy;
                response.Gender = bool.Parse(gender);
                response.Phone1 = phone1;
                response.Phone2 = phone2;
                response.Education = int.Parse(education);
                response.Image = response.Image;
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
                response.CVillage = int.Parse(bVillage);

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
                var response = context.Gaurantors.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //FormHelper.DeleteFile(response.Image, "~/AppData/Images");
                    //context.Gaurantors.Remove(response);
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        //private string GuarantorCode(string keyWord)
        //{
        //    var existCode = context.Gaurantors.Max(c => c.Code);
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
