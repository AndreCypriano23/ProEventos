using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.paginacao;

namespace ProEventos.Persistence.Contratos
{
    public interface IEventoPersist
    {

        //EVENTOS
        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);

        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);

    } 

}