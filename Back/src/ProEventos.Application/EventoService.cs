using System;
using System.Threading.Tasks;
using AutoMapper;
using Back.src.ProEventos.Aplication.Dtos;
using ProEventos.Application.Contratos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class EventoService : IEventoService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly IEventoPersist _eventoPersist;

        private readonly IMapper _mapper;

        public EventoService(IGeralPersist geralPersist, 
        IEventoPersist eventoPersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _eventoPersist = eventoPersist;
            _mapper = mapper;
        }

        public async Task<EventoDto> AddEventos(EventoDto model)
        {
           
            try
            {
                var evento = _mapper.Map<Evento>(model);//ele peda o model que é Dto, mapea para evento normal e no final joga para a var evento 

                _geralPersist.Add<Evento>(evento);

                if(await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;

            }
            catch(Exception ex)
            {

                throw new Exception(ex.Message);

            }

        }
        
        public async Task<EventoDto> UpdateEvento(int eventoId, EventoDto model)
        {
       
           try
            {

                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId, false);
                
                if(evento == null) return null;
        
                //E se só tiver o ModelId
                model.Id = evento.Id;

                //mapear do model com destino para o evento
                _mapper.Map(model, evento);

                _geralPersist.Update<Evento>(evento);

                 if(await _geralPersist.SaveChangesAsync())
                {
                    var eventoRetorno = await _eventoPersist.GetEventoByIdAsync(evento.Id, false);
                    return _mapper.Map<EventoDto>(eventoRetorno);
                }

                return null;

            }
            catch(Exception ex)
            {

                throw new Exception(ex.Message);

            }
            
        }


        public async Task<bool> DeleteEvento(int eventoId)
        {
            try
            {
                var evento = await _eventoPersist.GetEventoByIdAsync(eventoId);
                if(evento == null)
                {
                    //Mando uma mensagem para o meu controller falando que o Evento para o delete não foi encontrado
                    throw new Exception("Evento para delete não encontrado");
                }

                _geralPersist.Delete<Evento>(evento);

                 return await _geralPersist.SaveChangesAsync();

            }
            catch(Exception ex)
            {

                throw new Exception(ex.Message);

            }
            
        }

        public async Task<EventoDto[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
       
            try
            {

                var eventos  = await _eventoPersist.GetAllEventosAsync(includePalestrantes);
                
                if(eventos == null)  return null;

                var resultado = _mapper.Map<EventoDto[]>(eventos);
    
                return resultado;

            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }
            

        }

        public async Task<EventoDto[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false)
        {
            try
            {

                var eventos  = await _eventoPersist.GetAllEventosByTemaAsync(tema, includePalestrantes);
                if(eventos == null) return null;             

                var resultado = _mapper.Map<EventoDto[]>(eventos);
    
                return resultado;
                
            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<EventoDto> GetEventoByIdAsync(int eventoId, bool includePalestrantes = false)
        {
            try
            {
                var evento  = await _eventoPersist.GetEventoByIdAsync(eventoId, includePalestrantes);
                if(evento == null) return null;

                //mapeando o evento domínio do meu repositório para dto, só essa linha já subtitui tudo abaixo que seria feito de forma manual
                var resultado = _mapper.Map<EventoDto>(evento);
    
                /*var  eventoRetorno = new EventoDto(){
                        Id = evento.Id,
                        Local = evento.Local,
                        DataEvento = evento.DataEvento.ToString(),
                        Tema = evento.Tema,
                        QtdPessoas = evento.QtdPessoas,
                        imagemURL = evento.imagemURL,
                        Telefone = evento.Telefone,
                        Email = evento.Email
                }; */
               
                return resultado;

            }
            catch(Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

 
    }
}