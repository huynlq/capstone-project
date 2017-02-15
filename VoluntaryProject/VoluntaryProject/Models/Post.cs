using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Post
    {
        private int id;
        private string title;
        private string postContent;
        private string postTypeID;
        private int userID;
        private string markDrafted;
        private string timeCreated;
        private string timeModified;
        private string markDeleted;
        private string markApproved;

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

        public string Title
        {
            get
            {
                return title;
            }

            set
            {
                title = value;
            }
        }

        public string PostContent
        {
            get
            {
                return postContent;
            }

            set
            {
                postContent = value;
            }
        }

        public string PostTypeID
        {
            get
            {
                return postTypeID;
            }

            set
            {
                postTypeID = value;
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

        public string MarkDrafted
        {
            get
            {
                return markDrafted;
            }

            set
            {
                markDrafted = value;
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

        public string MarkApproved
        {
            get
            {
                return markApproved;
            }

            set
            {
                markApproved = value;
            }
        }
    }
}