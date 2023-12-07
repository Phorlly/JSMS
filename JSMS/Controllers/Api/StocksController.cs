using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/stocks")]
    public class StocksController : ApiController
    {
        protected readonly ApplicationDbContext context;

        public StocksController()
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
                var response = (from Product in context.Products
                                join Stock in context.StockTransactions on Product.Id equals Stock.Product
                                join Quantity in context.Stocks on Product.Id equals Quantity.Product

                                where Product.IsActive.Equals(true) && Stock.IsActive.Equals(true)
                                select new { Product, Stock, Quantity }).OrderByDescending(c => c.Stock.Id).ToList();

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpGet]
        [Route("get-by-id/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var response = (from Product in context.Products
                                join Stock in context.StockTransactions on Product.Id equals Stock.Product
                                join Quantity in context.Stocks on Product.Id equals Quantity.Product

                                where Product.IsActive.Equals(true) && Stock.IsActive.Equals(true)
                                select new { Product, Stock, Quantity }).SingleOrDefault(c => c.Stock.Id.Equals(id));

                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPost]
        [Route("post")]
        public IHttpActionResult StockInOrOut(StockTransaction request)
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

                    context.SaveChanges();
                }

                //Stock-out
                if (request.Status == 2)
                {
                    if (stockExist == null)
                    {
                        return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "Not Found Product 😯" }));
                    }

                    //Ajust stock
                    if (stockExist != null && stockExist.Total < request.Quantity)
                    {
                        return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "Stock lower than request 😯" }));
                    }
                    else
                    {
                        stockExist.Total -= request.Quantity;
                        context.Entry(stockExist).State = EntityState.Modified;
                        context.StockTransactions.Add(request);
                    }

                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានរក្សាទុករួចរាល់ហើយ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public IHttpActionResult PutById(StockTransaction request, int id)
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
                        return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                    }

                    stockExist.Total += request.Quantity;

                    context.Entry(stockExist).State = EntityState.Modified;
                    context.Entry(response).State = EntityState.Modified;
                    context.SaveChanges();
                }

                //Stock-out
                if (request.Status == 2)
                {
                    if (response == null || stockExist == null)
                    {
                        return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                    }

                    //Ajust stock
                    if (stockExist != null && stockExist.Total < request.Quantity)
                    {
                        return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "ចំនួនទំនិញដែលនៅក្នុងស្តុកគឺមិនគ្រប់គ្រាន់ទេ 😯" }));
                    }
                    else
                    {
                        stockExist.Total -= request.Quantity;

                        context.Entry(stockExist).State = EntityState.Modified;
                        context.Entry(response).State = EntityState.Modified;
                    }

                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }

        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public IHttpActionResult DeleteById(int id)
        {
            try
            {
                var response = context.StockTransactions.Find(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    response.IsActive = false;
                    response.Deleted = DateTime.Now;
                    //context.StockTransactions.Remove(response);
                    context.SaveChanges();
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

    }
}
