using System.Linq;
using System.Web.Mvc;

namespace JSMS.Controllers.Admin
{
    [Authorize]
    public class ShortListController : BaseController
    {
        // GET: ShortList
        public ActionResult Index()
        {
            return View(context.JobApplicants
                .Where(a => a.IsActive == true && (a.District != -1 || a.Commune != -1 || a.Village != -1))
                .OrderByDescending(c => c.Id).ToList());
        }
    }
}