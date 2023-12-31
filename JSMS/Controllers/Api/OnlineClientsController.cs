﻿using JSMS.Models.Admin;
using JSMS.Models.User;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/online-clients")]

    public class OnlineClientsController : ApiBaseController
    {

        [HttpGet]
        [Route("get")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var response = await (from Client in context.OnlineClients
                                      join Province in context.States on Client.Province equals Province.Id
                                      join Country in context.Countries on Client.Country equals Country.Id

                                      where Client.IsActive.Equals(true)
                                      select new { Client, Province, Country })
                                .OrderByDescending(c => c.Client.Id).ToListAsync();

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
                var response = await (from Client in context.OnlineClients
                                      join Country in context.Countries on Client.Country equals Country.Id
                                      join Province in context.States on Client.Province equals Province.Id

                                      where Client.IsActive.Equals(true)
                                      select new { Client, Province, Country })
                                .SingleAsync(c => c.Client.Id.Equals(id));

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
        public async Task<IHttpActionResult> Post(OnlineClient request)
        {
            try
            {
                //var exist = context.OnlineClients.FirstOrDefault(c => c.Name.Equals(request.Name));
                //if (exist != null)
                //{
                //    return BadRequest();
                //}

                //Assign value to OnlineClient
                request.CreatedAt = DateTime.Now;
                request.UpdatedAt = DateTime.Now;
                request.IsActive = true;
                request.Status = 0;

                if (request != null)
                {
                    context.OnlineClients.Add(request);
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
        public async Task<IHttpActionResult> PutById(OnlineClient request, int id)
        {
            try
            {
                var response = context.OnlineClients.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }

                //Assign value
                response.Name = request.Name;
                response.Company = request.Company;
                response.Email = request.Email;
                response.Sex = request.Sex;
                response.Phone1 = request.Phone1;
                response.Phone2 = request.Phone2;
                response.CreatedAt = response.CreatedAt;
                response.UpdatedAt = DateTime.Now;
                response.IsActive = true;
                response.Status = request.Status;
                response.Province = request.Province;
                response.Country = request.Country;
                response.Noted = request.Noted;

                //Update
                if (response != null && request != null)
                {
                    context.Entry(response).State = EntityState.Modified;
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
                var response = context.OnlineClients.Find(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    response.IsActive = false;
                    response.DeletedAt = DateTime.Now;
                    //context.OnlineClients.Remove(response);
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
