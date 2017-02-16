using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class ReportType
    {
        private int id;
        private string reportType;

        public int Id
        {
            get
            {
                return id;
            }

            set
            {
                id = value;
            }
        }

        public string ReportTypes
        {
            get
            {
                return reportType;
            }

            set
            {
                reportType = value;
            }
        }
    }
}