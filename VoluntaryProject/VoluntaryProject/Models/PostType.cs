using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class PostType
    {
        private int id;
        private string type;

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



        public string PostTypes;

        public string Type
 

        {
            get
            {
                return type;
            }

            set
            {
                type = value;
            }
        }
    }
}