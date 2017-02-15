using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VoluntaryProject.Models
{
    public class User
    {
        private int id;
        private string username;
        private string password;
        private string fullName;
        private string birthDate;
        private string companyName;
        private string companyDescription;
        private string phoneNumber;
        private string address;
        private string email;
        private int roleID;
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

        public string Username
        {
            get
            {
                return username;
            }

            set
            {
                username = value;
            }
        }

        public string Password
        {
            get
            {
                return password;
            }

            set
            {
                password = value;
            }
        }

        public string FullName
        {
            get
            {
                return fullName;
            }

            set
            {
                fullName = value;
            }
        }

        public string BirthDate
        {
            get
            {
                return birthDate;
            }

            set
            {
                birthDate = value;
            }
        }

        public string CompanyName
        {
            get
            {
                return companyName;
            }

            set
            {
                companyName = value;
            }
        }

        public string CompanyDescription
        {
            get
            {
                return companyDescription;
            }

            set
            {
                companyDescription = value;
            }
        }

        public string PhoneNumber
        {
            get
            {
                return phoneNumber;
            }

            set
            {
                phoneNumber = value;
            }
        }

        public string Address
        {
            get
            {
                return address;
            }

            set
            {
                address = value;
            }
        }

        public string Email
        {
            get
            {
                return email;
            }

            set
            {
                email = value;
            }
        }

        public int RoleID
        {
            get
            {
                return roleID;
            }

            set
            {
                roleID = value;
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