using Microsoft.Owin;
using JSMS.Models.User;
using JSMS.Models.Admin;
using System.Data.Entity;
using JSMS.Controllers.Api;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;

namespace JSMS.Models
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit https://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);
            // Add custom user claims here
            return userIdentity;
        }
    }


    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        //Add table here
        public DbSet<Province> Provinces { get; set; }
        public DbSet<District> Districts { get; set; }
        public DbSet<Commune> Communes { get; set; }
        public DbSet<Village> Villages { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<State> States { get; set; } 
        public DbSet<Country> Countries { get; set; }
        public DbSet<Applicant> Applicants { get; set; }
        public DbSet<Behavior> Behaviors { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Gaurantor> Gaurantors { get; set; }  
        public DbSet<LogAction> LogActions { get; set; }
        public DbSet<Recruitment> Recruitments { get; set; }
        public DbSet<ShortList> ShortLists { get; set; }
        public DbSet<Staff> Staffs { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Leave> Leaves { get; set; }
        public DbSet<Transaction> Transactions { get; set; }  
        public DbSet<AttendanceTest> AttendanceTests { get; set; }
        public DbSet<TestAtt> TestAtts { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<OtherExpense> OtherExpenses { get; set; }

        public  DbSet<Invoice> Invoices { get; set; }


        //User blog
        public DbSet<OnlineApplicant> OnlineApplicants { get; set; }
        public DbSet<OnlineClient> OnlineClients { get; set; }  

        public ApplicationDbContext(): base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    } 
}