using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class PostType
    {
        private int id;
        private string postType;

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

        public string PostType
        {
            get
            {
                return postType;
            }

            set
            {
                postType = value;
            }
        }
    }
}