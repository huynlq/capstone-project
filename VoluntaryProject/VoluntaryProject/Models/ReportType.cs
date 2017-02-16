using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class ReportType
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

<<<<<<< HEAD
        public string ReportTypes
=======
        public string Type
>>>>>>> acb501b66b39ae1d4f376b296de4f985410429ca
        {
            get
            {
                return Type;
            }

            set
            {
                type = value;
            }
        }
    }
}