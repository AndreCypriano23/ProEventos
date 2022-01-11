using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);//método get que retornará uma lista de lotes por eventoId
        Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId);//método para pegar um lote apenas eu tenho que passar uma chave composta pra ele que seria eventId(tabela evento) e o LoteId(da tabela lote)
        
    } 

}