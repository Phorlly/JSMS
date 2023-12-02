using JSMS.Helpers;
using JSMS.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;

[assembly: OwinStartupAttribute(typeof(JSMS.Startup))]
namespace JSMS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            //CreateRolesAndUsers();
        }

        // In this method we will create default User roles and Admin user for login  
        //private void CreateRolesAndUsers()
        //{
        //    ApplicationDbContext context = new ApplicationDbContext();

        //    var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
        //    var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));


        //    // In Startup iam creating first Admin Role and creating a default Admin User     
        //    if (!roleManager.RoleExists(Roles.AdminOrHR.ToString()))
        //    {

        //        //first we create Admin root   
        //        var roleAdminOrHR = new IdentityRole() { Name = Roles.AdminOrHR.ToString() };
        //        roleManager.Create(roleAdminOrHR);

        //        //Here we create a Admin super user who will maintain the website                   
        //        var user = new ApplicationUser()
        //        {
        //            UserName = "admin@system.com",
        //            Email = "admin@system.com"
        //        };

        //        var password = "Admin@123"; 

        //        var chkUser = userManager.Create(user, password);

        //        //Add default User to Role Admin    
        //        if (chkUser.Succeeded)
        //        {
        //            userManager.AddToRole(user.Id, Roles.AdminOrHR.ToString());
        //        }
        //    }

        //    // Creating Creating Accounting role     
        //    if (!roleManager.RoleExists(Roles.Accounting.ToString()))
        //    {
        //        //Accounting
        //        var roleAccounting = new IdentityRole() { Name = Roles.Accounting.ToString() };
        //        roleManager.Create(roleAccounting);
        //    }

        //    // Creating Creating Customer role     
        //    if (!roleManager.RoleExists(Roles.Customer.ToString()))
        //    {
        //        //Customer
        //        var roleCustomer = new IdentityRole() { Name = Roles.Customer.ToString() };
        //        roleManager.Create(roleCustomer);
        //    }
        //}
    }

}
