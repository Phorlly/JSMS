using System;
using System.Net;
using JSMS.Models;
using System.Linq;
using JSMS.Helpers;
using System.Net.Http;
using System.Web.Http;
using JSMS.Models.Admin;
using System.Data.Entity;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/users")]
    public class UserRolesController : ApiBaseController
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public UserRolesController()
        {
            userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
        }

        [HttpGet]
        [Route("get")]
        public IHttpActionResult Get()
        {
            try
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
                                    Username = p.Username.ToLower(),
                                    Email = p.Email,
                                    Phone = p.Phone,
                                    Password = p.Password,
                                    Role = string.Join(",", p.RoleNames)
                                });
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
        public IHttpActionResult GetById(string id)
        {
            try
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
        public async Task<IHttpActionResult> Post(RegisterViewModel request)
        {
            try
            {
                var user = new ApplicationUser()
                {
                    UserName = request.UserName,
                    PhoneNumber = request.Phone,
                    Email = EmailGenerator.GenerateEmail()
                };

                var exist = await userManager.FindByNameAsync(request.UserName);
                if (exist != null)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "ឈ្មោះអ្នកប្រាស់បានចុះឈ្មោះរួចហើយ​" }));
                }

                if (request.Password != request.ConfirmPassword)
                {
                    return ResponseMessage(Request.CreateResponse(HttpStatusCode.BadRequest, new { message = "ពាក្យសម្ងាត់ដូចគ្នាទេ" }));
                }
                else
                {
                    var result = await userManager.CreateAsync(user, request.Password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user.Id, request.Role);
                        await context.SaveChangesAsync();
                    }
                }

                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់ហើយ..!​​");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("put-by-id/{id}")]
        public async Task<IHttpActionResult> Put(RegisterViewModel request, string id)
        {
            try
            {
                var response = await userManager.FindByIdAsync(id);
                var oldrole = await roleManager.FindByIdAsync(response.Roles.FirstOrDefault().RoleId);
                var role = await roleManager.FindByNameAsync(request.Role);

                if (response == null)
                {
                    return NoDataFound();
                }

                response.UserName = request.UserName;
                response.PhoneNumber = request.Phone;
                response.Email = response.Email;

                if (!string.IsNullOrEmpty(request.OldPassword))
                {
                    if (request.NewPassword != request.ConfirmPassword)
                    {
                        return ExistData("ពាក្យសម្ងាត់ដូចគ្នាទេ..!");
                    }

                    // Check if the old password is correct
                    var isOldPasswordCorrect = await userManager.CheckPasswordAsync(response, request.OldPassword);

                    if (!isOldPasswordCorrect)
                    {
                        return ExistData("ពាក្យសម្ងាត់ចាស់មិនត្រឹមត្រូវទេ..!");
                    }

                    var result = await userManager.ChangePasswordAsync(response.Id, request.OldPassword, request.NewPassword);
                    if (result.Succeeded)
                    {
                        await context.SaveChangesAsync();
                    }

                }

                await userManager.UpdateAsync(response);
                await userManager.RemoveFromRoleAsync(response.Id, oldrole.Name);
                await userManager.AddToRoleAsync(response.Id, role.Name);

                context.Entry(response).State = EntityState.Modified;
                await context.SaveChangesAsync();

                return Success("ទិន្នន័យត្រូវបានកែប្រែរួចរាល់ហើយ..!​");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete-by-id/{id}")]
        public async Task<IHttpActionResult> Delete(string id)
        {
            try
            {
                var response = await userManager.FindByIdAsync(id);
                if (response == null)
                {
                    return NoDataFound();
                }
                else
                {
                    await userManager.DeleteAsync(response);
                }

                return Success("ទិន្នន័យត្រូវបានលុបចេញរួចរាល់ហើយ..!​");
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
