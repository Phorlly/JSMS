using ImageResizer.Configuration.Xml;
using ImageResizer.Plugins.Basic;
using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Razor.Text;
using System.Web.UI.WebControls;

namespace JSMS.Controllers.Api 
{
    [RoutePrefix("api/hr/expend")]
    public class ExpendController : ApiController
    {
        protected readonly ApplicationDbContext context;

        public ExpendController()
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
                var response = (from Applicant in context.Applicants
                                join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
                                join Client in context.Clients on Staff.Client equals Client.Id
                                join Transaction in context.Transactions on Staff.Id equals Transaction.Client
                                where Transaction.IsActive == true
                                select new { Transaction, Staff, Applicant, Client })
                                .OrderByDescending(c => c.Transaction.Id).ToList();
                if (response == null)
                {
                    return NotFound();
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("get-by-id/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var response = (from Applicant in context.Applicants
                                join Recruitment in context.Recruitments on Applicant.Id equals Recruitment.Applicant
                                join ShortList in context.ShortLists on Recruitment.Id equals ShortList.Recruitment
                                join Staff in context.Staffs on ShortList.Id equals Staff.ShortList
                                join Client in context.Clients on Staff.Client equals Client.Id
                                join Transaction in context.Transactions on Staff.Id equals Transaction.Client
                                where Transaction.IsActive == true
                                select new { Transaction, Applicant, Client, Staff })
                                .FirstOrDefault(c => c.Transaction.Id.Equals(id));
                if (response == null)
                {
                    return NotFound();
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("post")]
        public IHttpActionResult Post(Transaction request)
        {
            try
            {
                //Asign value to model
                request.Income = 0;
                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.Status = 1;

                if (request != null)
                {
                    context.Transactions.Add(request);
                }

                return Ok(context.SaveChanges());
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public IHttpActionResult PutById(Transaction request, int id)
        {
            try
            {
                var response = context.Transactions.Find(id);
                if (response == null)
                {
                    return NotFound();
                }

                //Asign value to model
                response.CreatedBy = response.CreatedBy;
                response.Currency = request.Currency;
                response.DateInOrEx = request.DateInOrEx;
                response.Total = request.Total;
                response.Amount = request.Amount;
                response.Code = request.Code;
                response.Income = 0;
                response.Payment = request.Payment;
                response.Quantity = request.Quantity;
                response.Type = request.Type;
                response.Exchange = request.Exchange;
                response.IsActive = true;
                response.UpdatedAt = DateTime.Now;
                response.CreatedAt = response.CreatedAt;
                response.Status = 1;
                response.Noted = request.Noted;
                response.Description = request.Description;

                context.Entry(response).State = EntityState.Modified;

                return Ok(context.SaveChanges());
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public IHttpActionResult DeleteById(int id)
        {
            try
            {
                var response = context.Transactions.Find(id);
                if (response == null)
                {
                    return NotFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //context.Transactions.Remove(response);
                }

                return Ok(context.SaveChanges());
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
