using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Activity
    {
        private int id;
        private int eventID;
        private int date;
        private string fromTime;
        private string toTime;
        private string place;
        private string latitude;
        private string longtitude;
        private string estimateCost;
        private string actualCost;
        private string comment;

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

        public int EventID
        {
            get
            {
                return eventID;
            }

            set
            {
                eventID = value;
            }
        }

        public int Date
        {
            get
            {
                return date;
            }

            set
            {
                date = value;
            }
        }

        public string FromTime
        {
            get
            {
                return fromTime;
            }

            set
            {
                fromTime = value;
            }
        }

        public string ToTime
        {
            get
            {
                return toTime;
            }

            set
            {
                toTime = value;
            }
        }

        public string Place
        {
            get
            {
                return place;
            }

            set
            {
                place = value;
            }
        }

        public string Latitude
        {
            get
            {
                return latitude;
            }

            set
            {
                latitude = value;
            }
        }

        public string Longtitude
        {
            get
            {
                return longtitude;
            }

            set
            {
                longtitude = value;
            }
        }

        public string EstimateCost
        {
            get
            {
                return estimateCost;
            }

            set
            {
                estimateCost = value;
            }
        }

        public string ActualCost
        {
            get
            {
                return actualCost;
            }

            set
            {
                actualCost = value;
            }
        }

        public string Comment
        {
            get
            {
                return comment;
            }

            set
            {
                comment = value;
            }
        }
    }
}