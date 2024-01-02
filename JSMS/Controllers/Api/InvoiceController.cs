using Antlr.Runtime.Tree;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Services.Description;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/invoice")]
    public class InvoiceController : ApiController
    {
        protected readonly ApplicationDbContext context;

        public InvoiceController()
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
                try {
                    var response = (from Client in context.Clients
                                    join Invoice in context.Invoices on Client.Id equals Invoice.ClientId

                                    select new { Invoice, Client }).OrderByDescending(c => c.Invoice.Id).ToList();
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("get/{id}")]
        public IHttpActionResult  GetById(int id)
        {
            try {
                var response = (from Client in context.Clients
                                join Invoice in context.Invoices on Client.Id equals Invoice.ClientId

                                select new { Invoice, Client }).SingleOrDefault(c => c.Invoice.Id.Equals(id));

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ" }));
                } return Ok(response);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPost]
        [Route("post")]
        public IHttpActionResult Post( Invoice post)
        {
            try
            {
                if(context.Invoices.Any(e => e.InvoiceNumber == post.InvoiceNumber)) {

                    return BadRequest("Invoice Number already exists.");
                }
                

                // Calculate Amount
                post.Amount = post.Qty * post.UnitPrice;

                //set tax == 0 
                if (post.Tax == null)
                {
                    post.Tax = 0;
                }
                else
                {
                    post.Tax = post.Amount * post.Tax;
                }

                // Calculate Total
                post.Total = post.Amount + post.Tax;

                // Save to the database
                context.Invoices.Add(post);
                context.SaveChanges();

                return Ok(post);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPut]
        [Route("put/{id}")]
        public IHttpActionResult Update(int Id, Invoice update)
        {
            try
            {
                var existing = context.Invoices.Find(Id);

                var sameInvoice = context.Invoices
                    .FirstOrDefault(c => c.InvoiceNumber == update.InvoiceNumber & c.Id != Id);

                if (sameInvoice != null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invoice Number already exists." }));

                }
                existing.StartDate = update.StartDate;
                existing.EndDate = update.EndDate;
                existing.InvoiceNumber = update.InvoiceNumber;
                existing.ClientId = update.ClientId;
                existing.Description = update.Description;
                existing.Qty = update.Qty;
                existing.Total = update.Total;
                existing.UnitPrice = update.UnitPrice;
                existing.Tax = update.Tax;
                existing.Note = update.Note;

                // Calculate Amount
                existing.Amount = existing.Qty * existing.UnitPrice;

                // Set tax default to 0%
                existing.Tax = update.Tax ?? 0;

                // Calculate Total
                existing.Total = existing.Amount + existing.Tax;

                context.SaveChanges();
                return Ok(existing);

            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var InDb = context.Invoices.SingleOrDefault(c => c.Id == id);

                if (InDb != null)
                {
                    context.Invoices.Remove(InDb);
                    context.SaveChanges();

                    return Ok("Record deleted successfully");
                }

                // If InDb is null, it means the record was not found, but it's not treated as an error.

                return BadRequest("Record not found");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
