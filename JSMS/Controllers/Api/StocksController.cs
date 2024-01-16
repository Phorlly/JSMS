using System;
using System.Linq;
using System.Web.Http;
using JSMS.Models.Admin;
using System.Data.Entity;
using System.Threading.Tasks;
using JSMS.Resources;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/stocks")]
    public class StocksController : ApiBaseController
    {

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Product in context.Products
                                      join Stock in context.Stocks on Product.Id equals Stock.Product

                                      where Product.IsActive.Equals(true) && Stock.IsActive.Equals(true)
                                      select new { Product, Stock }).OrderByDescending(c => c.Stock.Id).ToListAsync();

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
                var response = await (from Product in context.Products
                                      join Stock in context.Stocks on Product.Id equals Stock.Product

                                      where Product.IsActive.Equals(true) && Stock.IsActive.Equals(true)
                                      select new { Product, Stock }).SingleOrDefaultAsync(c => c.Stock.Id.Equals(id));

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
        public async Task<IHttpActionResult> StockInOrOut(Stock request)
        {
            try
            {
                request.Noted = request.Noted == "" ? Language.InOrOut : request.Noted;
                request.CreatedBy = request.CreatedBy == "" ? "admin@system.com" : request.CreatedBy.ToString();

                var product = await context.Products.FindAsync(request.Product);
                if (product == null)
                {
                    return NoDataFound();
                }

                //Stock-in
                if (request.Status == 1)
                {
                    if (product.Total <= 0)
                    {
                        product.Total = request.Quantity;
                        context.Entry(product).State = EntityState.Modified;
                        context.Stocks.Add(request);
                    }
                    else
                    {
                        product.Total += request.Quantity;
                        context.Entry(product).State = EntityState.Modified;
                        context.Stocks.Add(request);
                    }

                    await context.SaveChangesAsync();
                }

                //Stock-out
                if (request.Status == 2)
                {
                    //Ajust stock
                    if (product.Total < request.Quantity)
                    {
                        return ExistData(Language.NotEnough);
                    }
                    else
                    {
                        product.Total -= request.Quantity;
                        context.Entry(product).State = EntityState.Modified;
                        context.Stocks.Add(request);
                    }

                    await context.SaveChangesAsync();
                }

                return Success(Language.DataCreated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(Stock request, int id)
        {
            try
            {
                var response = await context.Stocks.FindAsync(id);
                var product = await context.Products.FindAsync(request.Product);
                response.Status = request.Status;
                response.Updated = DateTime.Now;
                response.Product = request.Product;
                response.Quantity = request.Quantity;
                response.Noted = request.Noted == "" ? Language.InOrOut : request.Noted;
                response.Date = request.Date;

                if (response == null || product == null)
                {
                    return NoDataFound();
                }

                //Stock-in
                if (request.Status == 1)
                {
                    product.Total += request.Quantity;

                    context.Entry(product).State = EntityState.Modified;
                    context.Stocks.Add(response);
                    //context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                //Stock-out
                if (request.Status == 2)
                {
                    //Ajust stock
                    if (response != null && product.Total < request.Quantity)
                    {
                        return ExistData(Language.NotEnough);
                    }
                    else
                    {
                        product.Total -= request.Quantity;
                        context.Entry(product).State = EntityState.Modified;
                        context.Stocks.Add(response);
                        //context.Entry(response).State = EntityState.Modified;
                    }

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
                var response = await context.Stocks.FindAsync(id);
                var product = await context.Products.FindAsync(response.Product);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.Deleted = DateTime.Now;
                    //product.Total -= response.Quantity;
                    //context.Stocks.Remove(response);
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
