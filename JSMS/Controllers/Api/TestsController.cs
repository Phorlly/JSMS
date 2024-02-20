//using JSMS.Helpers;
//using System;
//using System.Data.Entity;
//using System.Linq;
//using System.Threading.Tasks;
//using System.Web.Http;

//namespace JSMS.Controllers.Api
//{
//    [RoutePrefix("api/hr/tests")]
//    public class TestsController : ApiBaseController
//    {
//        protected string firstName = RequestForm("FirstName");
//        protected string lastName = RequestForm("LastName");
//        protected string description = RequestForm("Description");

//        [HttpGet]
//        [Route("reads")]
//        public async Task<IHttpActionResult> Reads()
//        {
//            try
//            {
//                var response = await context.Tests.OrderByDescending(c => c.Id).ToListAsync();
//                if (response == null) return NoDataFound();

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                return ServerError(ex);
//            }
//        }

//        [HttpGet]
//        [Route("read/{id}")]
//        public async Task<IHttpActionResult> Read(int id)
//        {
//            try
//            {
//                var response = await context.Tests.FindAsync(id);
//                if (response == null) return NoDataFound();

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                return ServerError(ex);
//            }
//        }

//        [HttpPost]
//        [Route("create")]
//        public async Task<IHttpActionResult> Create()
//        {
//            try
//            {
//                var request = new Test()
//                {
//                    Files = RequestFiles("../AppData/Uploads", "~/AppData/Uploads"),
//                    FirstName = firstName.ToUpper(),
//                    LastName = lastName
//                };

//                if (request != null)
//                {
//                    context.Tests.Add(request);
//                    await context.SaveChangesAsync();
//                }

//                return Ok(new { message = "Successfully" });
//            }
//            catch (Exception ex)
//            {
//                return ServerError(ex);
//            }
//        }

//        [HttpPut]
//        [Route("update/{id}")]
//        public async Task<IHttpActionResult> Update(int id)
//        {
//            try
//            {
//                var response = await context.Tests.FindAsync(id);
//                if (response == null) return NoDataFound();

//                var fileName = RequestFiles("../AppData/Uploads", "~/AppData/Uploads");
//                if (fileName != null)
//                {
//                    DeleteFiles(response.Files, "~/AppData/Uploads");
//                    response.Files = fileName;
//                }

//                response.FirstName = firstName;
//                response.LastName = lastName;

//                context.Entry(response).State = EntityState.Modified;
//                await context.SaveChangesAsync();

//                return Ok(new { message = "Successfully" });
//            }
//            catch (Exception ex)
//            {
//                return ServerError(ex);
//            }
//        }
//    }
//}
