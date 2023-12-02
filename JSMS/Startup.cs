using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(JSMS.Startup))]
namespace JSMS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
