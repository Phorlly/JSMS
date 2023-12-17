using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace JSMS.Services
{
    public interface IRepository<T> : IDisposable
    {
        IEnumerable<T> Get();
        T GetById(int id);
        void Post(T entity);
        void PutById(T entity, int id);
        void DeleteById(int id);
        T FindBy(Expression<Func<T, bool>> predicate);
        void SaveChanges();

        //Async await
        Task<IEnumerable<T>> GetAsync();
        Task<T> GetByIdAsync(int id);
        Task PostAsync(T entity);
        Task PutByIdAsync(T entity, int id);
        Task DeleteByIdAsync(int id);
        Task<T> FindByAsync(Expression<Func<T, bool>> predicate);
        Task SaveChangesAsync();
    }

}
