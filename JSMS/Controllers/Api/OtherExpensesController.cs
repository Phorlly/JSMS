
using JSMS.Models.Admin;
using System;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/otherexpense")]
    public class OtherExpensesController : ApiBaseController
    {

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> GetAll()
        {
            var res = await context.OtherExpenses.ToListAsync();

            if (res == null)
            {
                return NoDataFound();
            }
            else
            {

                return Ok(res);
            }

        }

        //GET api/ProductType/{id}
        [HttpGet]
        [Route("get/{id}")]
        public async Task<IHttpActionResult> Get(int Id)
        {
            var res = await context.OtherExpenses.SingleAsync(c => c.Id == Id);

            if (res == null)
            {
                return NoDataFound();
            }
            else
            {
                return Ok(res);
            }

        }

        [Route("getTotal")]
        [HttpGet]
        public async Task<IHttpActionResult> Get()
        {

            try
            {
                // Get the sum of the Cost field from the OtherExpenses table
                var totalCost = await context.OtherExpenses.SumAsync(t => t.Cost);
                return Ok(totalCost);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [HttpPost]
        [Route("post")]
        public async Task<IHttpActionResult> Post(OtherExpense post)
        {
            try
            {
                // Check if InvoiceID already exists
                if (context.OtherExpenses.Any(e => e.InvoiceID == post.InvoiceID))
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

                    context.OtherExpenses.Add(incomeTransaction);
                }
                else if (post.Status == 2) // Expense
                {
                    // Get the current total cost
                    var currentTotalCost = await context.OtherExpenses.SumAsync(t => t.Cost);

                    // Check if the expense exceeds the total income
                    if (currentTotalCost  > post.Cost)
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

                    context.OtherExpenses.Add(expenseTransaction);
                }
                else
                {
                    return BadRequest("Invalid status value. Status must be 1 for income or 2 for expense.");
                }

                // Update the Total field in the Transaction table
                var total = await context.OtherExpenses.SumAsync(t => t.Cost);
                post.Total = (decimal)total;

                // Save changes to the database
               await context.SaveChangesAsync();

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
                var existingExpense = context.OtherExpenses.Find(Id);

                //greater than 0
                if (update.Cost <= 0)
                {
                    return BadRequest("Cost must be greater than 0");
                }

                // Check if the InvoiceID already exists for a different expense
                var existingWithSameInvoice = context.OtherExpenses
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
                    var currentTotalCost = context.OtherExpenses.Sum(t => t.Cost);

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
                context.Entry(existingExpense).State = EntityState.Modified;
                context.SaveChanges();

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
                var InDb = context.OtherExpenses.SingleOrDefault(c => c.Id == id);

                if (InDb != null)
                {
                    context.OtherExpenses.Remove(InDb);
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
