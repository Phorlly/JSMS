using JSMS.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JSMS.Models.Admin
{
    public class Leave: Global
    {
        public int StaffId { get; set; }
        public int LeaveType { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }
        public string Duration { get; set; }
        public DateTime? ApplyedAt { get; set; }
    }
}