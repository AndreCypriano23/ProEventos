using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class ProEventosPersistence : IPalestrantePersist
    {
         private readonly ProEventosContext _context;

        public ProEventosPersistence(ProEventosContext context)
        {
            _context = context;   
        }
        
        public async Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            //Aqui eu crio uma query proporcionando pra ela um palestrante, pq ele é do 
            //tipo palestrante e aí eu adiciono aqui as redes sociais do palestrante
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.RedesSociais);

            //Se a pessoa quer incluir eventos
            if(includeEventos)
            {
                query = query
                .Include(p => p.PalestranteEventos)
                .ThenInclude(pe => pe.Evento);//Do PalestranteEventos eu puxo o Evento 
            }

            query = query.AsNoTracking().OrderBy(p => p.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.RedesSociais);

            //Se a pessoa quer incluir eventos
            if(includeEventos)
            {
                query = query
                .Include(p => p.PalestranteEventos)
                .ThenInclude(pe => pe.Evento);//Do PalestranteEventos eu puxo o Evento 
            }

            query = query.AsNoTracking().OrderBy(p => p.Id)
                .Where(p => p.User.PrimeiroNome.ToLower().Contains(nome.ToLower()));


            return await query.ToArrayAsync();
        }

     
        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos)
        {
             IQueryable<Palestrante> query = _context.Palestrantes
            .Include(p => p.RedesSociais);

            //Se a pessoa quer incluir eventos
            if(includeEventos)
            {
                query = query
                .Include(p => p.PalestranteEventos)
                .ThenInclude(pe => pe.Evento);//Do PalestranteEventos eu puxo o Evento 
            }

            query = query.AsNoTracking().OrderBy(p => p.Id).Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }

        
    }
}