using JSMS.Models;
using JSMS.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace JSMS.Controllers.Api
{
    [RoutePrefix("api/hr/test")]
    public class TestAttController : ApiController
    {
        protected readonly ApplicationDbContext _context;

        public TestAttController()
        {
            _context = new ApplicationDbContext();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context.Dispose();
            }
            base.Dispose(disposing);
        }

        [HttpGet]
        [Route("get")]
        public IHttpActionResult Get()
        {
            try
            {
                var response = (from TestAtt in _context.TestAtts
                                join Staff in _context.Staffs on TestAtt.StaffId equals Staff.Id
                                select new { TestAtt, Staff }).OrderByDescending(c => c.TestAtt.Id).ToList();
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

            //return Ok(_context.TestAtts.ToList());  
        }

        //Where to get TestAtendent

        [HttpGet]
        [Route("get/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                var response = (from TestAtt in _context.TestAtts
                                join Staff in _context.Staffs on TestAtt.StaffId equals Staff.Id
                                where TestAtt.Id == id
                                select new { TestAtt, Staff }).FirstOrDefault();

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
        [Route("post-CheckIn")]
        public IHttpActionResult PostCheckIn(TestAtt request)
        {
            try
            {
                // Check if there's an existing check-in for the same staff member
                var existingCheckIn = _context.TestAtts
                    .Where(t => t.StaffId == request.StaffId && t.CheckOut == null)
                    .FirstOrDefault(); 

                if (existingCheckIn != null)
                {
                    // There's already an active check-in, handle accordingly
                    return BadRequest("A check-in has already been recorded for this staff member.");
                }

                request.CheckIn = DateTime.Now;
                request.CheckOut = null; // Initialize to null as check-out has not happened yet

                _context.TestAtts.Add(request);
                
                return Ok(_context.SaveChanges());
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpPost]
        [Route("post-checkout/{id}")]
        public IHttpActionResult PostCheckOut(int id)
        {
            try
            {
                var existingRecord = _context.TestAtts.Where(c => c.StaffId == id && c.CheckOut == null).FirstOrDefault();
                if (existingRecord == null)
                {
                    //404 Bad Request
                    //Jol Condition nis hz merl tv
                    //bakcend ot jol ah ng tae tae front jol 404 get data ban tae 
                    return NotFound();
                }

                if (existingRecord.CheckIn == null)
                {

                    //400 Bad-Request: No check-in recorded, can't perform check-out
                    return BadRequest("Check-in must be performed before check-out.");
                }

                if (existingRecord.CheckOut != null)
                {
                    // 400 Bad-Request
                    // Check-out has already been performed
                    return BadRequest("Check-out has already been performed, Please CheckIn again.");
                }

                existingRecord.CheckOut = DateTime.Now;

                _context.Entry(existingRecord).State = EntityState.Modified;
                _context.SaveChanges();
                 
                //200
                return Ok(existingRecord);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

    }
}
