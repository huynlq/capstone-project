using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Donation
    {
        private int id;
        private int userID;
        private string donateItem;
        private string donateAmount;
        private int eventID;
        private string comment;
        private string timeCreated;

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

        public string DonateItem
        {
            get
            {
                return donateItem;
            }

            set
            {
                donateItem = value;
            }
        }

        public string DonateAmount
        {
            get
            {
                return donateAmount;
            }

            set
            {
                donateAmount = value;
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
    }
}