using System;
using System.Net;
using JSMS.Models;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using JSMS.Models.Admin;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/invoice")]
    public class InvoiceController : ApiBaseController
    {
        [HttpGet]
        [Route("get")]
        public IHttpActionResult Get()
        {
            try
            {
                var response = (from Client in context.Clients
                                join Invoice in context.Invoices on Client.Id equals Invoice.ClientId

                                select new { Invoice, Client }).OrderByDescending(c => c.Invoice.Id).ToList();
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
        [Route("get/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var response = (from Client in context.Clients
                                join Invoice in context.Invoices on Client.Id equals Invoice.ClientId

                                select new { Invoice, Client }).SingleOrDefault(c => c.Invoice.Id.Equals(id));

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
        public IHttpActionResult Post(Invoice post)
        {
            try
            {
                if (context.Invoices.Any(e => e.InvoiceNumber == post.InvoiceNumber))
                {

                    return ExistData("លេខវិក័យប័ត្រមានរួចហើយ..!");
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

               return Success("ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
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
                    return ExistData("លេខវិក័យប័ត្រមានរួចហើយ..!");
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

                return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ហើយ..!");

            }
            catch (Exception ex)
            {
                return ServerError(ex);
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

                    return Success("បានលុបកំណត់ត្រាដោយជោគជ័យ..!");
                }

                // If InDb is null, it means the record was not found, but it's not treated as an error.

                return NoDataFound();
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
