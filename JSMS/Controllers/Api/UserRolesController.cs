 using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using System.Web.Security;


namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/users")]
    public class UserRolesController : ApiController
    {
        protected readonly ApplicationDbContext context;
        //protected readonly UserManager<ApplicationUser> userManager;

        //public UserRolesController(UserManager<ApplicationUser> _userManager)
        //{
        //    userManager = _userManager;
        //}

        public UserRolesController()
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
            var response = (from user in context.Users
                            select new
                            {
                                UserId = user.Id,
                                Password = user.PasswordHash,
                                Username = user.UserName,
                                Email = user.Email.ToString(),
                                Phone = user.PhoneNumber,
                                RoleNames = (from userRole in user.Roles
                                             join role in context.Roles on userRole.RoleId equals role.Id
                                             select role.Name).ToList()
                            }).ToList().Select(p => new UserRole()
                            {
                                UserId = p.UserId,
                                Username = p.Username,
                                Email = p.Email,
                                Phone = p.Phone,
                                Password = p.Password,
                                Role = string.Join(",", p.RoleNames)
                            });
            if (response == null)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("get-by-id/{id}")]
        public IHttpActionResult GetById(string id)
        {
            var response = (from user in context.Users
                            select new
                            {
                                UserId = user.Id,
                                Username = user.UserName,
                                Email = user.Email.ToString(),
                                Password = user.PasswordHash,
                                Phone = user.PhoneNumber,
                                RoleNames = (from userRole in user.Roles
                                             join role in context.Roles on userRole.RoleId equals role.Id
                                             select role.Name).ToList()
                            }).ToList().Select(p => new UserRole()
                            {
                                UserId = p.UserId,
                                Username = p.Username,
                                Email = p.Email,
                                Phone = p.Phone,
                                Password = p.Password,
                                Role = string.Join(",", p.RoleNames)
                            }).SingleOrDefault(c => c.UserId == id);
            if (response == null)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("post")]
        public IHttpActionResult Post(RegisterViewModel request)
        {
            try
            {
                var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
                var user = new ApplicationUser
                {
                    UserName = request.UserName,
                    PhoneNumber = request.Phone,
                    Email = EmailGenerator.GenerateEmail()
                };

                var exist = userManager.FindByName(request.UserName);
                if (exist != null)
                {
                    return BadRequest();
                }

                var result = userManager.Create(user, request.Password);
                if (result.Succeeded)
                {
                    userManager.AddToRole(user.Id, request.Role);
                }

                return Ok(new { message = "ទិន្នន័យត្រូវបានលុបចេញរួចរាល់​ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> Put(RegisterViewModel request, string id)
        {
            try
            {
                var userManager = new UserManager<ApplicationUser, string>(new UserStore<ApplicationUser>(context));
                var roleManager = new RoleManager<IdentityRole, string>(new RoleStore<IdentityRole>(context));

                var response = await userManager.FindByIdAsync(id);
                var oldrole = await roleManager.FindByIdAsync(response.Roles.FirstOrDefault().RoleId);
                var role = await roleManager.FindByNameAsync(request.Role);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }

                response.UserName = request.UserName;
                response.PhoneNumber = request.Phone;

                if (!string.IsNullOrEmpty(request.Password))
                {
                    await userManager.ChangePasswordAsync(response.Id, response.PasswordHash, request.Password);
                    await userManager.AddPasswordAsync(response.Id, request.Password);
                }

                //The same data
                if (response.UserName != request.UserName)
                {
                    await userManager.UpdateAsync(response);
                    await userManager.RemoveFromRoleAsync(response.Id, oldrole.Name);
                    await userManager.AddToRoleAsync(response.Id, role.Name);
                }

                //Other data
                var exist = userManager.FindByName(request.UserName);
                if (exist != null)
                {
                    await userManager.UpdateAsync(response);
                    await userManager.RemoveFromRoleAsync(response.Id, oldrole.Name);
                    await userManager.AddToRoleAsync(response.Id, role.Name);
                }
                //else
                //{
                //    return BadRequest();
                //}

                return Ok(new { message = "ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ 😍" });
            }
            catch (Exception ex)
            {
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.InternalServerError, new { message = ex.Message }));
            }
        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            try
            {
                var userManager = new UserManager<ApplicationUser, string>(new UserStore<ApplicationUser>(context));
                //var roleManager = new RoleManager<IdentityRole, string>(new RoleStore<IdentityRole>(context));

                var response = await userManager.FindByIdAsync(id);
                if (response == null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.NotFound, new { message = "រកមិនឃើញទន្នន័យទេ 😯" }));
                }
                else
                {
                    await userManager.DeleteAsync(response);
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
