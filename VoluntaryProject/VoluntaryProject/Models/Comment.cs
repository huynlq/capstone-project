using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class Comment
    {
        private int id;
        private string commentContent;
        private int rating;
        private int userID;
        private int postID;
        private string timeCreated;
        private string timeModified;
        private int markDeleted;

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

        public string CommentContent
        {
            get
            {
                return commentContent;
            }

            set
            {
                commentContent = value;
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

        public int PostID
        {
            get
            {
                return postID;
            }

            set
            {
                postID = value;
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

        public int MarkDeleted
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