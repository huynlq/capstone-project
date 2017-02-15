using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Event
    {
        private int id;
        private string eventName;
        private string description;
        private string fromDate;
        private string toDate;
        private string startPlace;
        private string latitude;
        private string longtitude;
        private string budget;
        private string closingDate;
        private string donationAmount;
        private int userID;
        private int eventTypeID;
        private string markClosed;
        private string timeCreated;
        private string timeModified;
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

        public string EventName
        {
            get
            {
                return eventName;
            }

            set
            {
                eventName = value;
            }
        }

        public string Description
        {
            get
            {
                return description;
            }

            set
            {
                description = value;
            }
        }

        public string FromDate
        {
            get
            {
                return fromDate;
            }

            set
            {
                fromDate = value;
            }
        }

        public string ToDate
        {
            get
            {
                return toDate;
            }

            set
            {
                toDate = value;
            }
        }

        public string StartPlace
        {
            get
            {
                return startPlace;
            }

            set
            {
                startPlace = value;
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

        public string Budget
        {
            get
            {
                return budget;
            }

            set
            {
                budget = value;
            }
        }

        public string ClosingDate
        {
            get
            {
                return closingDate;
            }

            set
            {
                closingDate = value;
            }
        }

        public string DonationAmount
        {
            get
            {
                return donationAmount;
            }

            set
            {
                donationAmount = value;
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

        public int EventTypeID
        {
            get
            {
                return eventTypeID;
            }

            set
            {
                eventTypeID = value;
            }
        }

        public string MarkClosed
        {
            get
            {
                return markClosed;
            }

            set
            {
                markClosed = value;
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

        public string TimeModified
        {
            get
            {
                return timeModified;
            }

            set
            {
                timeModified = value;
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