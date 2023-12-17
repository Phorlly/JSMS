//using JSMS.Helpers;
//using JSMS.Models;
//using JSMS.Models.Admin;
//using System;
//using System.Collections.Generic;
//using System.Data.Entity;
//using System.IO;
//using System.Linq;
//using System.Net;
//using System.Net.Http;
//using System.Threading.Tasks;
//using System.Web;
//using System.Web.Http;

//namespace JSMS.Controllers.Api
//{
//    [RoutePrefix("api/hr/transactions")]
//    public class TransactionsController : ApiController
//    {
//        protected readonly ApplicationDbContext context;
//        protected string staff = FormHelper.Form("Staff");
//        protected string payment = FormHelper.Form("Payment");
//        protected string type = FormHelper.Form("Type");
//        protected string amount = FormHelper.Form("Amount");
//        protected string vat = FormHelper.Form("VAT");
//        protected string quantity = FormHelper.Form("Quantity");
//        protected string dateInOrEx = FormHelper.Form("DateInOrEx");
//        protected string income = FormHelper.Form("Income");
//        protected string exchange = FormHelper.Form("Exchange");
//        protected string total = FormHelper.Form("Total");
//        protected string currency = FormHelper.Form("Currency");
//        protected string unit = FormHelper.Form("Unit");
//        protected string code = FormHelper.Form("Code");
//        protected string createdBy = FormHelper.Form("CreatedBy");
//        protected string noted = FormHelper.Form("Noted");
//        protected string description = FormHelper.Form("Description");

//        public TransactionsController()
//        {
//            context = new ApplicationDbContext();
//        }
//        protected override void Dispose(bool disposing)
//        {
//            if (disposing)
//            {
//                context.Dispose();
//            }
//            base.Dispose(disposing);
//        }

//        [HttpGet]
//        [Route("get")]
//        public IHttpActionResult Get()
//        {
//            try
//            {
//                var response = (from Applicant in context.Applicants
//                                join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
//                                join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
//                                join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
//                                join Client in context.Clients on Staff.Client equals Client.Id
//                                join Transaction in context.Transactions on Staff.Id equals Transaction.Client
//                                where Transaction.IsActive == true
//                                select new { Transaction, Staff, Applicant, Client })
//                                .OrderByDescending(c => c.Transaction.Id).ToList();
//                if (response == null)
//                {
//                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
//                }

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
//            }
//        }

//        [HttpGet]
//        [Route("get-by-id/{id}")]
//        public IHttpActionResult GetById(int id)
//        {
//            try
//            {
//                var response = (from Applicant in context.Applicants
//                                join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
//                                join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
//                                join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
//                                join Client in context.Clients on Staff.Client equals Client.Id
//                                join Transaction in context.Transactions on Staff.Id equals Transaction.Client
//                                where Transaction.IsActive == true
//                                select new { Transaction, Applicant, Client, Staff })
//                                .FirstOrDefault(c => c.Transaction.Id.Equals(id));
//                if (response == null)
//                {
//                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
//                }

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
//            }
//        }

//        [HttpPost]
//        [Route("post")]
//        public async Task<IHttpActionResult> Post()
//        {
//            try
//            {
//                var fileName = FormHelper.SaveFile("Attachment", "Transaction", "~/AppData/Files", "../AppData/Files");
//                var request = new Transaction();
//                var isExist = context.Transactions.FirstOrDefault(c => c.Code.Equals(code));
//                if (isExist != null)
//                {
//                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "លេខកូដនេះកំពុងប្រើហើយ​​ 📛" }));
//                }

//                //Asign value to model
//                request.Attachment = fileName;
//                request.CreatedBy = createdBy;
//                request.Currency = int.Parse(currency);
//                request.DateInOrEx = DateTime.Parse(dateInOrEx);
//                request.Exchange = decimal.Parse(exchange);
//                request.Total = decimal.Parse(total);
//                request.Amount = decimal.Parse(amount);
//                request.Code = code;
//                request.Income = int.Parse(income);
//                request.VAT = decimal.Parse(vat);
//                request.Payment = int.Parse(payment);
//                request.Quantity = int.Parse(quantity);
//                request.Unit = int.Parse(unit);
//                request.Type = int.Parse(type);
//                request.Client = int.Parse(staff);
//                request.Exchange = decimal.Parse(exchange);
//                request.IsActive = true;
//                request.UpdatedAt = DateTime.Now;
//                request.CreatedAt = DateTime.Now;
//                request.Status = 1;
//                request.Noted = noted;
//                request.Description = description;

//                if(request != null)
//                {
//                    context.Transactions.Add(request);
//                    await context.SaveChangesAsync();
//                }

//                return Ok(new { message = "ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ 😍" });
//            }
//            catch (Exception ex)
//            {
//                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
//            }
//        }

//        [HttpPut]
//        [Route("put-by-id/{id}")]
//        public async Task<IHttpActionResult> PutById(int id)
//        {
//            try
//            {
//                var response = context.Transactions.Find(id);
//                if (response == null)
//                {
//                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
//                }

//                var fileName = FormHelper.SaveFile("Attachment", "Transaction", "~/AppData/Files", "../AppData/Files");
//                if (fileName != null)
//                {
//                    FormHelper.DeleteFile(response.Attachment, "~/AppData/Files");
//                    response.Attachment = fileName;
//                }

//                //Asign value to model
//                response.Attachment = response.Attachment;
//                response.CreatedBy = response.CreatedBy;
//                response.Currency = int.Parse(currency);
//                response.DateInOrEx = DateTime.Parse(dateInOrEx);
//                response.Exchange = decimal.Parse(exchange);
//                response.Total = decimal.Parse(total);
//                response.Amount = decimal.Parse(amount);
//                response.Code = code;
//                response.Income = int.Parse(income);
//                response.VAT = decimal.Parse(vat);
//                response.Payment = int.Parse(payment);
//                response.Quantity = int.Parse(quantity);
//                response.Unit = int.Parse(unit);
//                response.Type = int.Parse(type);
//                response.Exchange = decimal.Parse(exchange);
//                response.IsActive = true;
//                response.UpdatedAt = DateTime.Now;
//                response.CreatedAt = response.CreatedAt;
//                response.Status = 1;
//                response.Noted = noted;
//                response.Description = description;

//                if (response != null)
//                {
//                    context.Entry(response).State = EntityState.Modified;
//                    await context.SaveChangesAsync();
//                }

//                return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
//            }
//            catch (Exception ex)
//            {
//                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
//            }
//        }

//        [HttpDelete]
//        [Route("delete-by-id/{id}")]
//        public async Task<IHttpActionResult> DeleteById(int id)
//        {
//            try
//            {
//                var response = context.Transactions.Find(id);
//                if (response == null)
//                {
//                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
//                }
//                else
//                {
//                    response.IsActive = false;
//                    response.DeletedAt = DateTime.Now;

//                    //FormHelper.DeleteFile(response.Attachment, "~/AppData/Files");
//                    //context.Transactions.Remove(response);
//                    await context.SaveChangesAsync();
//                }

//                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
//            }
//            catch (Exception ex)
//            {
//                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
//            }
//        }
//    }
//}
