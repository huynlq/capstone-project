﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class EventItem
    {
        private int id;
        private int eventID;
        private string item;
        private string requireAmount;
        private string acquireAmount;
        private string timeCreated;
        private string timeModified;

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

<<<<<<< HEAD
        public string EventItems
=======
        public string Item
>>>>>>> acb501b66b39ae1d4f376b296de4f985410429ca
        {
            get
            {
                return Item;
            }

            set
            {
                Item = value;
            }
        }

        public string RequireAmount
        {
            get
            {
                return requireAmount;
            }

            set
            {
                requireAmount = value;
            }
        }

        public string AcquireAmount
        {
            get
            {
                return acquireAmount;
            }

            set
            {
                acquireAmount = value;
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
    }
}