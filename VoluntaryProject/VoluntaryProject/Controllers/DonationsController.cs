using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using VoluntaryProject.Models;

namespace VoluntaryProject.Controllers
{
    public class DonationsController : ApiController
    {
        private VoluntaryProjectContext db = new VoluntaryProjectContext();

        // GET: api/Donations
        public IQueryable<Donation> GetDonations()
        {
            return db.Donations;
        }

        // GET: api/Donations/5
        [ResponseType(typeof(Donation))]
        public async Task<IHttpActionResult> GetDonation(int id)
        {
            Donation donation = await db.Donations.FindAsync(id);
            if (donation == null)
            {
                return NotFound();
            }

            return Ok(donation);
        }

        // PUT: api/Donations/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutDonation(int id, Donation donation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != donation.Id)
            {
                return BadRequest();
            }

            db.Entry(donation).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DonationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Donations
        [ResponseType(typeof(Donation))]
        public async Task<IHttpActionResult> PostDonation(Donation donation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Donations.Add(donation);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = donation.Id }, donation);
        }

        // DELETE: api/Donations/5
        [ResponseType(typeof(Donation))]
        public async Task<IHttpActionResult> DeleteDonation(int id)
        {
            Donation donation = await db.Donations.FindAsync(id);
            if (donation == null)
            {
                return NotFound();
            }

            db.Donations.Remove(donation);
            await db.SaveChangesAsync();

            return Ok(donation);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DonationExists(int id)
        {
            return db.Donations.Count(e => e.Id == id) > 0;
        }
    }
}