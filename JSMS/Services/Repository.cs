using JSMS.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Web;

namespace JSMS.Services
{
    public class Repository<T> : IRepository<T>, IDisposable where T : class
    {
        private readonly ApplicationDbContext context;

        public Repository()
        {
            context = new ApplicationDbContext();
        }


        // Synchronous methods
        public IEnumerable<T> Get()
        {
            return context.Set<T>().ToList();
        }

        public T GetById(int id)
        {
            return context.Set<T>().Find(id);
        }

        public void Post(T entity)
        {
            if (entity != null)
            {
                context.Set<T>().Add(entity);
                SaveChanges();
            }
        }

        public void PutById(T entity, int id)
        {
            var existingEntity = context.Set<T>().Find(id);

            if (existingEntity != null && entity != null)
            {
                context.Entry(existingEntity).CurrentValues.SetValues(entity);
                SaveChanges();
            }
        }

        public void DeleteById(int id)
        {
            var entity = context.Set<T>().Find(id);
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
                SaveChanges();
            }
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }

        // Asynchronous methods
        public async Task<IEnumerable<T>> GetAsync()
        {
            return await context.Set<T>().ToListAsync();
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public async Task PostAsync(T entity)
        {
            if(entity != null)
            {
                context.Set<T>().Add(entity);
                await SaveChangesAsync();
            }
        }

        public async Task PutByIdAsync(T entity, int id)
        {
            var existingEntity = await context.Set<T>().FindAsync(id);

            if (existingEntity != null && entity != null)
            {
                context.Entry(existingEntity).CurrentValues.SetValues(entity);
                await SaveChangesAsync();
            }
        }

        public async Task DeleteByIdAsync(int id)
        {
            var entity = await context.Set<T>().FindAsync(id);
            if (entity != null)
            {
                context.Set<T>().Remove(entity);
                await SaveChangesAsync();
            }
        }

        public async Task SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }


        // Implement IDisposable pattern
        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    // Dispose managed resources (e.g., DbContext)
                    context.Dispose();
                }

                disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public T FindBy(Expression<Func<T, bool>> predicate)
        {
            return context.Set<T>().FirstOrDefault(predicate);
        }

        public Task<T> FindByAsync(Expression<Func<T, bool>> predicate)
        {
            return context.Set<T>().FirstOrDefaultAsync(predicate);
        }

        ~Repository()
        {
            Dispose(false);
        }
    }
}