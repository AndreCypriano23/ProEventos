using AutoMapper;
using Back.src.ProEventos.Aplication.Dtos;
using ProEventos.Domain;

namespace Back.src.ProEventos.Aplication.Helpers
{
    public class ProEventosProfile : Profile
    {   
        public ProEventosProfile()
        {
            CreateMap<Evento, EventoDto>().ReverseMap();//Mapeie tudo de Evento para Evento Dto e ao contrário usando o ReverseMap()
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Palestrante, PalestranteDto>().ReverseMap();

        }
    }
}