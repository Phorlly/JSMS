using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/attTest")]
    public class AttendanceTestController : ApiController
    {
        protected readonly ApplicationDbContext context;

        public AttendanceTestController()
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

            try
            {
                var response = (from AttendanceTest in context.AttendanceTests
                                join Staff in context.Staffs on AttendanceTest.StaffId equals Staff.Id // Staff is a FK in Attendance
                                join Client in context.Clients on Staff.Client equals Client.Id //Clients is a FK in Staff
                                join ShortList in context.ShortLists on Staff.ShortList equals ShortList.Id
                                join Recruitment in context.Recruitments on ShortList.Recruitment equals Recruitment.Id
                                where AttendanceTest.IsActive == true //IsActive = false == Delete
                                select new { AttendanceTest, Staff, Client }).OrderByDescending(c => c.AttendanceTest.Id).ToList();
                // select new { Attendance, Staff, Client }) == display data
                //OrderBYDescending == sort from Z-A
                //(c => c.Attendance.Id).ToList(); ==> want to sort from Id not name 
                if (response == null)
                {
                    return NotFound();
                }
                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("post")]
        public IHttpActionResult Post(AttendanceTest request)
        {

            try
            {
                request.IsActive = true;
                request.UpdatedAt = DateTime.Now;
                request.CreatedAt = DateTime.Now;
                request.Status = 1;


                context.AttendanceTests.Add(request);
                context.SaveChanges();


                return Ok(request);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }


        }
    }
}
