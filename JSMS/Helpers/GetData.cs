using ImageResizer.Collections;
using JSMS.Models;
using JSMS.Models.Admin;
using Microsoft.Ajax.Utilities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics.PerformanceData;
using System.Globalization;
using System.Linq;
using System.Web;

namespace JSMS.Helpers
{
    public class GetAttendanceReport
    {
        protected readonly ApplicationDbContext context;
        public GetAttendanceReport()
        {
            context = new ApplicationDbContext();
        }

        //Get attendance
        public List<Attendance> GetAttendanceData(DateTime start, DateTime end, int? staff)
        {
            end = end.AddDays(1);
            IQueryable<Attendance> query = context.Attendances;

            // Filter by date range
            query = query.Where(a => a.CheckIn.HasValue &&
                                     a.CheckIn.Value >= start &&
                                     a.CheckIn.Value <= end);

            // Filter by staff if provided
            if (staff.HasValue)
            {
                query = query.Where(a => a.Staff == staff.Value);
            }

            // Execute the query and return the results as a list
            return query.ToList();
        }

        // Count present days 
        public int CountPresentDays(DateTime start, DateTime end, int? staff = null)
        {
            // Execute the counter
            return GetAttendanceData(start, end, staff).Count();
        }

        // Count absent days
        public int CountAbsentDays(DateTime start, DateTime end, int? staff = null)
        {
            end = end.AddDays(1);
            int totalDaysInMonth = (int)(end - start).TotalDays;
            var attendanceData = GetAttendanceData(start, end, staff).Count();

            // Count the number of absent days where CheckIn is null
            int absentCount = totalDaysInMonth - attendanceData;

            return absentCount;
        }

        //Calculate salary 
        public decimal GetSalaryPayment(IEnumerable<Staff> staffList, int absentDays, int? staff = null, int totalWorkingDays = 0)
        {
            decimal totalSalaries = 0;

            foreach (var allStaff in staffList)
            {
                if (staff.HasValue && allStaff.Id != staff)
                {
                    continue;
                }

                decimal totalSalary = CalculateTotalSalary(allStaff) / (absentDays + totalWorkingDays);

                totalSalaries += totalWorkingDays * totalSalary;

                if (staff.HasValue)
                {
                    break; // If a specific staff is specified, calculate only for that staff and exit the loop
                }
            }

            return totalSalaries;
        }


        // Calculate total salary for a staff member
        private decimal CalculateTotalSalary(Staff staff)
        {
            if (staff == null)
            {
                throw new ArgumentNullException(nameof(staff));
            }

            return (decimal)(staff.MainSalary + staff.PremierSalary);
        }
    }
}