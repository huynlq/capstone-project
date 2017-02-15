using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Review
    {
        private int id;
        private int rating;
        private string reviewContent;
        private int userID;
        private int eventID;
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

        public int Rating
        {
            get
            {
                return rating;
            }

            set
            {
                rating = value;
            }
        }

        public string ReviewContent
        {
            get
            {
                return reviewContent;
            }

            set
            {
                reviewContent = value;
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