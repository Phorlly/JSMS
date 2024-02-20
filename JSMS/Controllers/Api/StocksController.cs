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
        [Route("reads")]
        public async Task<IHttpActionResult> Reads()
        {
            try
            {
                var response = await (from product in context.Products
                                      join stock in context.Stocks on product.Id equals stock.Product

                                      where product.IsActive.Equals(true) && stock.IsActive.Equals(true)
                                      select new { product, stock }).OrderByDescending(c => c.stock.Id).ToListAsync();

                if (response == null) return NoDataFound();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpGet]
        [Route("read/{id}")]
        public async Task<IHttpActionResult> Read(int id)
        {
            try
            {
                var response = await (from product in context.Products
                                      join stock in context.Stocks on product.Id equals stock.Product

                                      where product.IsActive.Equals(true) && stock.IsActive.Equals(true)
                                      select new { product, stock }).SingleOrDefaultAsync(c => c.stock.Id.Equals(id));

                if (response == null) return NoDataFound();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPost]
        [Route("create")]
        public async Task<IHttpActionResult> Create(Stock request)
        {
            try
            {
                request.Noted = request.Noted == "" ? Language.InOrOut : request.Noted;
                var product = await context.Products.FindAsync(request.Product);
                if (product == null) return NoDataFound();

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
        [Route("redo/{id}")]
        public async Task<IHttpActionResult> Redo(Stock request, int id) 
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

                if (response == null || product == null) return NoDataFound();

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

                return Success(Language.DataRedo);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete/{id}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                var response = await context.Stocks.FindAsync(id);
                var product = await context.Products.FindAsync(response.Product);
                if (response == null) return NoDataFound();

                response.IsActive = false;
                response.Deleted = DateTime.Now;
                //context.Stocks.Remove(response);
                await context.SaveChangesAsync();

                return Success(Language.DataDeleted);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

    }
}
