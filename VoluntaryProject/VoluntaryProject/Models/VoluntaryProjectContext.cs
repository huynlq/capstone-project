using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class VoluntaryProjectContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
        public VoluntaryProjectContext() : base("name=VoluntaryProjectContext")
        {
        }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.Post> Posts { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.Event> Events { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.User> Users { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.Report> Reports { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.Role> Roles { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.Comment> Comments { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.Donation> Donations { get; set; }

        public System.Data.Entity.DbSet<VoluntaryProject.Models.EventItem> EventItems { get; set; }
    }
}
