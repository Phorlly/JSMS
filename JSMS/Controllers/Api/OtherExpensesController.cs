
using JSMS.Models.Admin;
using JSMS.Resources;
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
            try
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
            catch (Exception err)
            {
                return ServerError(err);
            }
        }

        //GET api/ProductType/{id}
        [HttpGet]
        [Route("get/{id}")]
        public async Task<IHttpActionResult> Get(int Id)
        {
            try
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
            catch (Exception err)
            {
                return ServerError(err);
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
                return ServerError(ex);
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
                    return MessageWithCode(400, Language.ExistInvioce);
                }

                if (post.Cost <= 0)
                {
                    return MessageWithCode(400, Language.CostGreater);
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

                if (post.Status == 2) // Expense
                {
                    // Get the current total cost
                    var currentTotalCost = await context.OtherExpenses.SumAsync(t => t.Cost);

                    // Check if the expense exceeds the total income
                    if (post.Cost > currentTotalCost)
                    {
                        return MessageWithCode(400, Language.ExpenseCannot);
                    }
                    else if (currentTotalCost == null)
                    {
                        currentTotalCost = 0;
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
  
                // Update the Total field in the Transaction table
                var total = await context.OtherExpenses.SumAsync(t => t.Cost);
                post.Total = (decimal)total;

                // Save changes to the database
                await context.SaveChangesAsync();

                return Success(Language.DataCreated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
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
                    return MessageWithCode(400, Language.CostGreater);
                }

                // Check if the InvoiceID already exists for a different expense
                var existingWithSameInvoice = context.OtherExpenses
                    .FirstOrDefault(e => e.InvoiceID == update.InvoiceID && e.Id != Id);

                if (existingWithSameInvoice != null)
                {
                    return MessageWithCode(400, Language.ExistInvioce);
                }

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

                if (update.Status == 2)
                {
                    var currentTotalCost = context.OtherExpenses.Sum(t => t.Cost);

                    // Check if the expense exceeds the total income
                    if (update.Cost > currentTotalCost)
                    {
                        return MessageWithCode(400, Language.ExpenseCannot);
                    }

                    // Update existing record
                    existingExpense.Date = update.Date;
                    existingExpense.InvoiceID = update.InvoiceID;
                    existingExpense.Cost = -update.Cost; // Negative for expense
                    existingExpense.ExpenseType = update.ExpenseType;
                    existingExpense.Note = update.Note;
                    existingExpense.Status = update.Status;
                    existingExpense.PaymentType = update.PaymentType;
                }

                // Save changes to the database
                context.Entry(existingExpense).State = EntityState.Modified;
                context.SaveChanges();

                return Success(Language.DataUpdated);
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
                var InDb = context.OtherExpenses.SingleOrDefault(c => c.Id == id);

                if (InDb != null)
                {
                    context.OtherExpenses.Remove(InDb);
                    context.SaveChanges();

                    return Success(Language.DataDeleted);
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
