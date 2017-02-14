using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(VoluntaryProject.Startup))]
namespace VoluntaryProject
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
