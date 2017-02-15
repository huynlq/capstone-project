using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Report
    {
        private int id;
        private int userID;
        private int reportTypeID;
        private string link;
        private string reportContent;
        private string timeCreated;
        private string markDeleted;

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

        public int UserID
        {
            get
            {
                return userID;
            }

            set
            {
                userID = value;
            }
        }

        public int ReportTypeID
        {
            get
            {
                return reportTypeID;
            }

            set
            {
                reportTypeID = value;
            }
        }

        public string Link
        {
            get
            {
                return link;
            }

            set
            {
                link = value;
            }
        }

        public string ReportContent
        {
            get
            {
                return reportContent;
            }

            set
            {
                reportContent = value;
            }
        }

        public string TimeCreated
        {
            get
            {
                return timeCreated;
            }

            set
            {
                timeCreated = value;
            }
        }

        public string MarkDeleted
        {
            get
            {
                return markDeleted;
            }

            set
            {
                markDeleted = value;
            }
        }
    }
}