﻿using JSMS.Helpers;
using JSMS.Models;
using JSMS.Models.Admin;
using JSMS.Resources;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

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
        [Route("reads")]
        public IHttpActionResult Reads()
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
        public IHttpActionResult Read(string id)
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
        [Route("create")]
        public async Task<IHttpActionResult> Create(RegisterViewModel request) 
        {
            try
            {
                var user = new ApplicationUser()
                {
                    UserName = SanitizeUsername(request.UserName.ToLower()),
                    PhoneNumber = request.Phone,
                    Email = GenerateEmail(request.UserName.ToLower())
                };

                var exist = await userManager.FindByNameAsync(request.UserName.ToLower());
                if (exist != null) return MessageWithCode(400, Language.ExistUsername);

                if (request.Password != request.ConfirmPassword) return MessageWithCode(400, Language.PasswordNotMatch);

                var result = await userManager.CreateAsync(user, request.Password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user.Id, request.Role);
                    await context.SaveChangesAsync();
                }

                return MessageWithCode(201, Language.DataCreated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpPut]
        [Route("update/{id}")]
        public async Task<IHttpActionResult> Update(RegisterViewModel request, string id) 
        {
            try
            {
                var response = await userManager.FindByIdAsync(id);
                var oldrole = await roleManager.FindByIdAsync(response.Roles.FirstOrDefault().RoleId);
                var role = await roleManager.FindByNameAsync(request.Role);

                if (response == null) return NoDataFound();

                var isExist = await context.Users.SingleOrDefaultAsync(u => u.UserName.ToLower() == request.UserName.ToLower() && u.Id != id);
                if (isExist != null) return MessageWithCode(400, Language.ExistUsername);

                response.UserName = SanitizeUsername(request.UserName.ToLower());
                response.PhoneNumber = request.Phone;
                response.Email = GenerateEmail(request.UserName.ToLower());

                if (!string.IsNullOrEmpty(request.OldPassword))
                {
                    if (request.NewPassword != request.ConfirmPassword) return MessageWithCode(400, Language.PasswordNotMatch);

                    // Check if the old password is correct
                    var isOldPasswordCorrect = await userManager.CheckPasswordAsync(response, request.OldPassword);
                    if (!isOldPasswordCorrect) return MessageWithCode(400, Language.OldPasswordInvalid);

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

                return MessageWithCode(200, Language.DataUpdated);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }

        [HttpDelete]
        [Route("delete=/{id}")]
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

                return MessageWithCode(200, Language.DataDeleted);
            }
            catch (Exception ex)
            {
                return ServerError(ex);
            }
        }
    }
}
