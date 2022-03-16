using System.Collections.Generic;
using System.Threading.Tasks;
using ProEventos.Domain.Identity;

namespace ProEventos.Persistence.Contratos
{
    public interface IUserPersist : IGeralPersist
    {
         //Preciso que ele seja capaz de fazer o que o meu Evento faz, todos os gets
         //Ele vai fazer tudo que o IGeral faz 

         Task<IEnumerable<User>> GetUsersAsync();
         Task<User> GetUserByIdAsync(int id);
         Task<User> GetUserByUserNameAsync(string username);

    }
}