using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Services.Description;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/otherexpense")]
    public class OtherExpensesController : ApiController
    {
        protected readonly ApplicationDbContext _context;

        public OtherExpensesController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        [HttpGet]
        [Route("get")]
        public IHttpActionResult GetAll()
        {
            var res = _context.OtherExpenses.ToList();

            if (res == null)
            {
                return BadRequest("Dont have data yet");
            }
            else
            {

                return Ok(res);
            }

        }

        //GET api/ProductType/{id}
        [HttpGet]
        [Route("get/{id}")]
        public IHttpActionResult Get(int Id)
        {
            var res = _context.OtherExpenses.SingleAsync(c => c.Id == Id);

            if (res == null)
            {
                return BadRequest("No Data");
            }
            else
            {
                return Ok(res);
            }

        }

        [Route("getTotal")]
        [HttpGet]
        public IHttpActionResult Get()
        {

            try
            {
                // Get the sum of the Cost field from the OtherExpenses table
                var totalCost = _context.OtherExpenses.Sum(t => t.Cost);
                return Ok(totalCost);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [Route("post")]
        public IHttpActionResult Post(OtherExpense post)
        {
            try
            {
                // Check if InvoiceID already exists
                if (_context.OtherExpenses.Any(e => e.InvoiceID == post.InvoiceID))
                {
                    return BadRequest("InvoiceID already exists.");
                }

                if (post.Cost <= 0)
                {
                    return BadRequest("Cost must be greater than 0");
                }

                if (post.Status == 1) // Income
                {
                    // Add income transaction
                    var incomeTransaction = new OtherExpense
                    {
                        InvoiceID = post.InvoiceID,
                        Date = post.Date,
                        Cost = post.Cost,
                        ExpenseType = post.ExpenseType,
                        Note = post.Note,
                        Status = post.Status,
                        PaymentType = post.PaymentType
                    };

                    _context.OtherExpenses.Add(incomeTransaction);
                }
                else if (post.Status == 2) // Expense
                {
                    // Get the current total cost
                    var currentTotalCost = _context.OtherExpenses.Sum(t => t.Cost);

                    // Check if the expense exceeds the total income
                    if (currentTotalCost > post.Cost)
                    {
                        return BadRequest("Expense cannot exceed total income.");
                    }

                    // Add expense transaction
                    var expenseTransaction = new OtherExpense
                    {
                        InvoiceID = post.InvoiceID,
                        Date = DateTime.Now,
                        Cost = -post.Cost, // Negative for expenses
                        ExpenseType = post.ExpenseType,
                        Note = post.Note,
                        Status = post.Status,
                        PaymentType = post.PaymentType
                    };

                    _context.OtherExpenses.Add(expenseTransaction);
                }
                else
                {
                    return BadRequest("Invalid status value. Status must be 1 for income or 2 for expense.");
                }

                // Update the Total field in the Transaction table
                var total = _context.OtherExpenses.Sum(t => t.Cost);
                post.Total = (double)total;

                // Save changes to the database
                _context.SaveChanges();

                return Ok("Transaction added successfully!");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPut]
        [Route("put/{id}")]
        public IHttpActionResult Update(int Id, OtherExpense update)
        {
            try
            {
                var existingExpense = _context.OtherExpenses.Find(Id);

                //greater than 0
                if (update.Cost <= 0)
                {
                    return BadRequest("Cost must be greater than 0");
                }

                // Check if the InvoiceID already exists for a different expense
                var existingWithSameInvoice = _context.OtherExpenses
                    .FirstOrDefault(e => e.InvoiceID == update.InvoiceID && e.Id != Id);

                if (existingWithSameInvoice != null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "InvoiceID already exists." }));
                }

                // Update existing record
                existingExpense.Date = update.Date;
                existingExpense.InvoiceID = update.InvoiceID;
                existingExpense.Cost = update.Cost;
                existingExpense.ExpenseType = update.ExpenseType;
                existingExpense.Note = update.Note;
                existingExpense.Status = update.Status;
                existingExpense.PaymentType = update.PaymentType;

                if (update.Status == 1)
                {
                    // Update existing record
                    existingExpense.Date = update.Date;
                    existingExpense.InvoiceID = update.InvoiceID;
                    existingExpense.Cost = update.Cost; // Positive for income
                    existingExpense.ExpenseType = update.ExpenseType;
                    existingExpense.Note = update.Note;
                    existingExpense.Status = update.Status;
                    existingExpense.PaymentType = update.PaymentType;
                }
                else if (update.Status == 2)
                {
                    var currentTotalCost = _context.OtherExpenses.Sum(t => t.Cost);

                    // Check if the expense exceeds the total income
                    if (update.Cost > currentTotalCost)
                    {
                        return BadRequest("Expense cannot exceed total income.");
                    }

                    // Update existing record
                    existingExpense.Date = update.Date;
                    existingExpense.InvoiceID = update.InvoiceID;
                    existingExpense.Cost = -update.Cost; // Positive for income
                    existingExpense.ExpenseType = update.ExpenseType;
                    existingExpense.Note = update.Note;
                    existingExpense.Status = update.Status;
                    existingExpense.PaymentType = update.PaymentType;
                }
                else
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Invalid status value. Status must be 1 for income or 2 for expense." }));
                }

                // Save changes to the database
                _context.Entry(existingExpense).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(existingExpense);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }


        [HttpDelete]
        [Route("delete/{id}")]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                var InDb = _context.OtherExpenses.SingleOrDefault(c => c.Id == id);

                if (InDb != null)
                {
                    _context.OtherExpenses.Remove(InDb);
                    _context.SaveChanges();

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
