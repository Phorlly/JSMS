using JSMS.Models.Admin;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

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
                                      join Stock in context.StockTransactions on Product.Id equals Stock.Product

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
                                      join Stock in context.StockTransactions on Product.Id equals Stock.Product
                                      join Quantity in context.Stocks on Product.Id equals Quantity.Product

                                      where Product.IsActive.Equals(true) && Stock.IsActive.Equals(true)
                                      select new { Product, Stock, Quantity }).SingleOrDefaultAsync(c => c.Stock.Id.Equals(id));

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
        public async Task<IHttpActionResult> StockInOrOut(StockTransaction request)
        {
            try
            {
                var stock = new Stock();
                request.Created = DateTime.Now;
                request.Updated = DateTime.Now;
                request.IsActive = true;
                request.Noted = request.Noted == "" ? "ដាក់ចូល ឬដកចេញ" : request.Noted;
                request.CreatedBy = request.CreatedBy == "" ? "admin@system.com" : request.CreatedBy.ToString();
                var stockExist = context.Stocks.SingleOrDefault(c => c.Product == request.Product);
                //Stock-in
                if (request.Status == 1)
                {
                    if (stockExist == null)
                    {
                        stock.Product = request.Product;
                        stock.Total = request.Quantity;

                        context.Stocks.Add(stock);
                        context.StockTransactions.Add(request);
                    }
                    else
                    {
                        stockExist.Total += request.Quantity;
                        context.Entry(stockExist).State = EntityState.Modified;
                        context.StockTransactions.Add(request);
                    }

                    await context.SaveChangesAsync();
                }

                //Stock-out
                if (request.Status == 2)
                {
                    if (stockExist == null)
                    {
                        return NoDataFound();
                    }

                    //Ajust stock
                    if (stockExist != null && stockExist.Total < request.Quantity)
                    {
                        return ExistData("ចំនួនទំនិញដែលនៅក្នុងស្តុកគឺមិនគ្រប់គ្រាន់ទេ..!");
                    }
                    else
                    {
                        stockExist.Total -= request.Quantity;
                        context.Entry(stockExist).State = EntityState.Modified;
                        context.StockTransactions.Add(request);
                    }

                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> PutById(StockTransaction request, int id)
        {
            try
            {
                var response = context.StockTransactions.Find(id);
                var stockExist = context.Stocks.SingleOrDefault(c => c.Product == request.Product);
                response.Status = request.Status;
                response.Updated = DateTime.Now;
                response.CreatedBy = response.CreatedBy;
                response.Created = response.Created;
                response.Product = request.Product;
                response.Quantity = request.Quantity;
                response.Noted = request.Noted == "" ? "ដាក់ចូល ឬដកចេញ" : request.Noted;
                response.Date = request.Date;
                response.IsActive = true;

                //Stock-in
                if (request.Status == 1)
                {
                    if (response == null || stockExist == null)
                    {
                        return NoDataFound();
                    }

                    stockExist.Total += request.Quantity;

                    context.Entry(stockExist).State = EntityState.Modified;
                    context.Entry(response).State = EntityState.Modified;
                    await context.SaveChangesAsync();
                }

                //Stock-out
                if (request.Status == 2)
                {
                    if (response == null || stockExist == null)
                    {
                        return NoDataFound();
                    }

                    //Ajust stock
                    if (stockExist != null && stockExist.Total < request.Quantity)
                    {
                        return ExistData("ចំនួនទំនិញដែលនៅក្នុងស្តុកគឺមិនគ្រប់គ្រាន់ទេ..!"); ;
                    }
                    else
                    {
                        stockExist.Total -= request.Quantity;
                        context.Entry(stockExist).State = EntityState.Modified;
                        context.Entry(response).State = EntityState.Modified;
                    }

                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ហើយ..!");
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
                var response = context.StockTransactions.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.Deleted = DateTime.Now;
                    context.StockTransactions.Remove(response);
                    await context.SaveChangesAsync();
                }

                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ហើយ..!");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

    }
}
