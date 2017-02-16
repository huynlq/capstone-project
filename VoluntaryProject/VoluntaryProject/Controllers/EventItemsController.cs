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
    public class EventItemsController : ApiController
    {
        private VoluntaryProjectContext db = new VoluntaryProjectContext();

        // GET: api/EventItems
        public IQueryable<EventItem> GetEventItems()
        {
            return db.EventItems;
        }

        // GET: api/EventItems/5
        [ResponseType(typeof(EventItem))]
        public async Task<IHttpActionResult> GetEventItem(int id)
        {
            EventItem eventItem = await db.EventItems.FindAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            return Ok(eventItem);
        }

        // PUT: api/EventItems/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutEventItem(int id, EventItem eventItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != eventItem.Id)
            {
                return BadRequest();
            }

            db.Entry(eventItem).State = System.Data.Entity.EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventItemExists(id))
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

        // POST: api/EventItems
        [ResponseType(typeof(EventItem))]
        public async Task<IHttpActionResult> PostEventItem(EventItem eventItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.EventItems.Add(eventItem);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = eventItem.Id }, eventItem);
        }

        // DELETE: api/EventItems/5
        [ResponseType(typeof(EventItem))]
        public async Task<IHttpActionResult> DeleteEventItem(int id)
        {
            EventItem eventItem = await db.EventItems.FindAsync(id);
            if (eventItem == null)
            {
                return NotFound();
            }

            db.EventItems.Remove(eventItem);
            await db.SaveChangesAsync();

            return Ok(eventItem);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EventItemExists(int id)
        {
            return db.EventItems.Count(e => e.Id == id) > 0;
        }
    }
}