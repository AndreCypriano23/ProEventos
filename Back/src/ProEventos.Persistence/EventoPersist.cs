using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.paginacao;

namespace ProEventos.Persistence
{
    public class EventoPersist : IEventoPersist
    {
         private readonly ProEventosContext _context;

        public EventoPersist(ProEventosContext context)
        {
            _context = context;
            //O Traking é um enumerator, nessa linha abaixo eu nao quero segurar, mas aqui aplicaria para todos, entao vou comentar e usar apenas o método específico
            //_context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            //Se a pessoa quer incluir palestrantes
            if(includePalestrantes)
            {
                query = query
                .Include(e => e.PalestranteEventos)
                .ThenInclude(pe => pe.Palestrante);//Do PalestranteEventos eu puxo o Palestrante
            }

            query = query.AsNoTracking()
                .Where(e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                             e.Local.ToLower().Contains(pageParams.Term.ToLower()))
                              && e.UserId == userId)
                .OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);//retornar uma query de evento
        }

                                                                            //Esse = false no parametro significa que ele é opcional
        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes)
        {
             IQueryable<Evento> query = _context.Eventos
            .Include(e => e.Lotes)
            .Include(e => e.RedesSociais);

            //Se a pessoa quer incluir palestrantes
            if(includePalestrantes)
            {
                query = query
                .Include(e => e.PalestranteEventos)
                .ThenInclude(pe => pe.Palestrante);//Do PalestranteEventos eu puxo o Palestrante
            }

            //dado um evento, a cada evento que tiver, procure um tema, converte para Lower case e analiza se ele contém um tema
            query = query.AsNoTracking().OrderBy(e => e.Id)
            .Where(e => e.Id == eventoId && e.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }

    }
}